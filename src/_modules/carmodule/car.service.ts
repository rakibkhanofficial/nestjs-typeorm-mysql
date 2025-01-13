import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../../_entities/car.entity';
import { CarDto } from './car.dto';
import { Category } from '../../_entities/category.entity';
import { SubCategory } from '../../_entities/subcategory.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async findByCategory(
    categoryId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const [cars, total] = await this.carRepository.findAndCount({
      where: { categoryId },
      relations: ['category', 'subCategory'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: cars,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByName(name: string): Promise<Car | undefined> {
    return this.carRepository.findOne({ where: { name } });
  }

  async findBySubCategory(
    subCategoryId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const [cars, total] = await this.carRepository.findAndCount({
      where: { subCategoryId },
      relations: ['category', 'subCategory'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: cars,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(carDto: CarDto, userId: number): Promise<Car> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id: carDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with id ${carDto.categoryId} not found`,
        );
      }

      if (carDto.subCategoryId) {
        const subCategory = await this.subCategoryRepository.findOne({
          where: {
            id: carDto.subCategoryId,
            categoryId: carDto.categoryId,
          },
        });
        if (!subCategory) {
          throw new NotFoundException(
            `Subcategory with id ${carDto.subCategoryId} not found or does not belong to the specified category`,
          );
        }
      }

      const car = this.carRepository.create({
        userId,
        ...carDto,
      });

      const result = await this.carRepository.save(car);
      return result;
    } catch (error) {
      console.error('Error in create car:', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error.code === '23505') {
        throw new BadRequestException('A car with this slug already exists');
      } else if (error.code === '23503') {
        throw new BadRequestException('Invalid category or subcategory ID');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while creating the car',
        );
      }
    }
  }

  async findAll() {
    try {
      const cars = await this.carRepository
        .createQueryBuilder('car')
        .leftJoin('tblCategory', 'category', 'car.categoryId = category.id')
        .leftJoin(
          'tblSubCategory',
          'subcategory',
          'car.subCategoryId = subcategory.id',
        )
        .select([
          'car.*',
          'category.name AS categoryName',
          'category.slug AS categorySlug',
          'subcategory.name AS subcategoryName',
        ])
        .where(`car.isAvailable = ${true}`)
        .getRawMany();
      if (cars.length === 0) {
        throw new NotFoundException('Cars not found');
      } else {
        return cars;
      }
    } catch (error) {
      throw new NotFoundException('Cars not found');
    }
  }

  async getPublicList() {
    try {
      const query = await this.carRepository
        .createQueryBuilder('car')
        .leftJoin('tblCategory', 'category', 'car.categoryId = category.id')
        .leftJoin(
          'tblSubCategory',
          'subcategory',
          'car.subCategoryId = subcategory.id',
        )
        .select([
          'car.id',
          'car.name',
          'car.slug',
          'car.pricePerMile',
          'car.pricePerHour',
          'car.image',
          'car.model',
          'car.year',
          'car.make',
          'car.seatingCapacity',
          'car.hasChildSeat',
          'car.hasWifi',
          'car.luggageCapacity',
          'car.mileagePerGallon',
          'car.transmission',
          'car.fuelType',
          'car.features',
          'car.createdAt',
          'car.updatedAt',
          'car.categoryId',
          'car.subCategoryId',
          'category.name AS categoryName',
          'category.slug AS categorySlug',
          'subcategory.name AS subcategoryName',
        ])
        .where('car.isAvailable = :isAvailable', { isAvailable: true });

      const cars = await query.getRawMany();

      if (cars.length === 0) {
        throw new NotFoundException('No available cars found');
      }

      return cars;
    } catch (error) {
      console.error('Error in getPublicList:', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error fetching public car list',
        );
      }
    }
  }

  async getCarSlugs() {
    try {
      const cars = await this.carRepository.find({
        select: ['slug'],
        where: { isAvailable: true },
      });

      if (cars.length === 0) {
        throw new NotFoundException('No available cars found');
      }

      return cars.map((car) => ({ strSlug: car.slug }));
    } catch (error) {
      throw new NotFoundException('Error fetching car slugs');
    }
  }

  async findBySlug(slug: string) {
    try {
      const car = await this.carRepository.findOne({
        where: { slug, isAvailable: true },
        relations: ['category', 'subCategory'],
      });
      if (!car) throw new NotFoundException('Car not found');

      return car;
    } catch (error) {
      throw new NotFoundException('Car not found');
    }
  }

  async findById(id: number) {
    try {
      const car = await this.carRepository.findOne({
        where: { id },
        relations: ['category', 'subCategory'],
      });
      if (!car) throw new NotFoundException('Car not found');

      return car;
    } catch (error) {
      throw new NotFoundException('Car not found');
    }
  }

  async update(id: number, carDto: CarDto) {
    try {
      await this.carRepository.update(id, carDto);
      const updatedCar = await this.carRepository.findOne({
        where: { id },
        relations: ['category', 'subCategory'],
      });
      if (!updatedCar) throw new NotFoundException('Car not found');

      return updatedCar;
    } catch (error) {
      throw new NotFoundException('Car cannot be updated. Please try again.');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.carRepository.delete(id);
      if (result.affected === 0) throw new NotFoundException('Car not found');
    } catch (error) {
      throw new NotFoundException('Car cannot be deleted. Please try again.');
    }
  }
}
