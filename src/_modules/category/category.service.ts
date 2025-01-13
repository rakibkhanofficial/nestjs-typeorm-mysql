// category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../_entities/category.entity';
import { CategoryDto } from './category.dto';
import { PublicCategory } from './category.types';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.categoryRepository.findOne({ where: { name } });
  }

  async findPublicCategoryList(): Promise<PublicCategory[]> {
    const categoryList = await this.categoryRepository.find({
      relations: ['subCategories'],
      select: ['id', 'name', 'slug', 'description'],
    });

    return categoryList.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      subCategories: category.subCategories.map((subCategory) => ({
        id: subCategory.id,
        name: subCategory.name,
        slug: subCategory.slug,
      })),
    }));
  }

  async findById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(categoryDto: CategoryDto, userId: number): Promise<Category> {
    const category = this.categoryRepository.create({
      ...categoryDto,
      userId, // Inject the userId from request.user
    });
    return this.categoryRepository.save(category);
  }

  async update(id: number, categoryDto: CategoryDto): Promise<Category> {
    await this.categoryRepository.update(id, categoryDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
  }
}
