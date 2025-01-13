// subcategory.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubCategory } from '../../_entities/subcategory.entity';
import { SubCategoryDto } from './subcategory.dto';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  async findAll(): Promise<SubCategory[]> {
    return this.subCategoryRepository.find({ relations: ['category'] });
  }

  async findBycategoryId(id: number): Promise<SubCategory[]> {
    console.log('categoryId', id);
    const subcategory = await this.subCategoryRepository.find({
      where: { categoryId: id },
    });
    return subcategory;
  }

  async findById(id: number): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!subCategory) {
      throw new NotFoundException('SubCategory not found');
    }
    return subCategory;
  }

  async findByName(name: string): Promise<SubCategory | undefined> {
    return this.subCategoryRepository.findOne({ where: { name } });
  }

  async create(
    subCategoryDto: SubCategoryDto,
    userId: number,
  ): Promise<SubCategory> {
    const subCategory = this.subCategoryRepository.create({
      ...subCategoryDto,
      userId, // Inject the userId from request.user
    });
    return this.subCategoryRepository.save(subCategory);
  }

  async update(
    id: number,
    subCategoryDto: SubCategoryDto,
  ): Promise<SubCategory> {
    await this.subCategoryRepository.update(id, subCategoryDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.subCategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('SubCategory not found');
    }
  }
}
