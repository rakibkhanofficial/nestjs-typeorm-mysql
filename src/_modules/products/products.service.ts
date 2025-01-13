import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../_entities/products.entity';
import { ProductDto } from './products.dto';
import { Category } from '../../_entities/category.entity';
import { SubCategory } from '../../_entities/subcategory.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
    const [products, total] = await this.productRepository.findAndCount({
      where: { categoryId },
      relations: ['category', 'subCategory'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByName(name: string): Promise<Product | undefined> {
    return this.productRepository.findOne({ where: { name } });
  }

  async findBySubCategory(
    subCategoryId: number,
    page: number = 1,
    limit: number = 10,
  ) {
    const [products, total] = await this.productRepository.findAndCount({
      where: { subCategoryId },
      relations: ['category', 'subCategory'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(productDto: ProductDto, userId: number): Promise<Product> {
    try {
      // Validate category exists
      const category = await this.categoryRepository.findOne({
        where: { id: productDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Category with id ${productDto.categoryId} not found`,
        );
      }

      // Validate subcategory if provided
      if (productDto.subCategoryId) {
        const subCategory = await this.subCategoryRepository.findOne({
          where: {
            id: productDto.subCategoryId,
            categoryId: productDto.categoryId,
          },
        });
        if (!subCategory) {
          throw new NotFoundException(
            `Subcategory with id ${productDto.subCategoryId} not found or does not belong to the specified category`,
          );
        }
      }

      const product = this.productRepository.create({
        userId,
        ...productDto,
      });

      const result = await this.productRepository.save(product);
      return result;
    } catch (error) {
      console.error('Error in create product:', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error.code === '23505') {
        // Unique constraint violation
        throw new BadRequestException(
          'A product with this slug already exists',
        );
      } else if (error.code === '23503') {
        // Foreign key constraint violation
        throw new BadRequestException('Invalid category or subcategory ID');
      } else {
        throw new InternalServerErrorException(
          'An error occurred while creating the product',
        );
      }
    }
  }

  async findAll() {
    try {
      const products = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('tblCategory', 'category', 'product.categoryId = category.id')
        .leftJoin(
          'tblSubCategory',
          'subcategory',
          'product.subCategoryId = subcategory.id',
        )
        .select([
          'product.*',
          'category.name AS categoryName',
          'category.slug AS categorySlug',
          'subcategory.name AS subcategoryName',
        ])
        .where(`product.isActive = ${true}`)
        .getRawMany();
      if (products.length === 0) {
        throw new NotFoundException('Products not found');
      } else {
        return products;
      }
    } catch (error) {
      throw new NotFoundException('Products not found');
    }
  }

  async getPublicList() {
    try {
      const query = await this.productRepository
        .createQueryBuilder('product')
        .leftJoin('tblCategory', 'category', 'product.categoryId = category.id')
        .leftJoin(
          'tblSubCategory',
          'subcategory',
          'product.subCategoryId = subcategory.id',
        )
        .select([
          'product.id',
          'product.name',
          'product.slug',
          'product.price',
          'product.offerprice',
          'product.prodimage',
          'product.sku',
          'product.brand',
          'product.description',
          'product.packsize',
          'product.stockQuantity',
          'product.tags',
          'product.weight',
          'product.createdAt',
          'product.updatedAt',
          'product.categoryId',
          'product.subCategoryId',
          'category.name AS categoryName',
          'category.slug AS categorySlug',
          'subcategory.name AS subcategoryName',
        ])
        .where('product.isActive = :isActive', { isActive: true });
      // console.log('Generated SQL:', query.getSql());

      const products = await query.getRawMany();

      if (products.length === 0) {
        throw new NotFoundException('No active products found');
      }

      return products;
    } catch (error) {
      console.error('Error in getPublicList:', error);
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error fetching public product list',
        );
      }
    }
  }

  async getProductSlugs() {
    try {
      const products = await this.productRepository.find({
        select: ['slug'],
        where: { isActive: true },
      });

      if (products.length === 0) {
        throw new NotFoundException('No active products found');
      }

      return products.map((product) => ({ strSlug: product.slug }));
    } catch (error) {
      throw new NotFoundException('Error fetching product slugs');
    }
  }

  async findBySlug(slug: string) {
    try {
      const product = await this.productRepository.findOne({
        where: { slug, isActive: true },
        select: [
          'id',
          'name',
          'slug',
          'description',
          'price',
          'offerprice',
          'prodimage',
          'packsize',
          'brand',
          'category',
          'tags',
          'weight',
          'dimensions',
          'allergens',
          'nutritionalInfo',
          'stockQuantity',
          'expirationDate',
          'sku',
        ],
      });
      if (!product) throw new NotFoundException('Product not found');

      return product;
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async findById(id: number) {
    try {
      const product = await this.productRepository.findOne({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');

      return product;
    } catch (error) {
      throw new NotFoundException('Product not found');
    }
  }

  async update(id: number, productDto: ProductDto) {
    try {
      await this.productRepository.update(id, productDto);
      const updatedProduct = await this.productRepository.findOne({
        where: { id },
      });
      if (!updatedProduct) throw new NotFoundException('Product not found');

      return updatedProduct;
    } catch (error) {
      throw new NotFoundException(
        'Product cannot be updated. Please try again.',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.productRepository.delete(id);
      if (result.affected === 0)
        throw new NotFoundException('Product not found');
    } catch (error) {
      throw new NotFoundException(
        'Product cannot be deleted. Please try again.',
      );
    }
  }
}
