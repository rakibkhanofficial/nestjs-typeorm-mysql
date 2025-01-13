// product.controller.ts
import {
  Controller,
  Get,
  Req,
  Res,
  Param,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { success, requestInvalid } from '../../helpers/http';
import { SUCCESS, REQUEST_ERROR } from '../../shared/constants/httpCodes';
import { ProductDto } from './products.dto';
import { ProductService } from './products.service';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Roles } from '../auth/jwt/roles.decorator';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
    // Add other properties from your token payload if needed
  };
}

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async findAll(@Req() request: Request, @Res() response: Response) {
    try {
      const products = await this.productService.findAll();
      return response.status(200).json({
        statusCode: 200,
        message: 'Product list was successfully retrieved',
        data: products,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while fetching the product list',
        error: error.message,
      });
    }
  }

  @Get('public-list')
  async getPublicList(@Req() request: Request, @Res() response: Response) {
    try {
      const products = await this.productService.getPublicList();
      return response.status(200).json({
        statusCode: 200,
        message: 'Product list was successfully retrieved',
        data: products,
      });
    } catch (error) {
      console.error('Error in getPublicList:', error);
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while fetching the product list',
        error: error.message,
      });
    }
  }

  @Get('slugs')
  async getProductSlugs(@Req() request: Request, @Res() response: Response) {
    try {
      const slugs = await this.productService.getProductSlugs();
      return response.status(SUCCESS).json(success(slugs));
    } catch (error) {
      console.log(error);
      return response.status(REQUEST_ERROR).json(requestInvalid(error));
    }
  }

  @Get('public-details/:slug')
  async getPublicDetailsBySlug(
    @Req() request: Request,
    @Res() response: Response,
    @Param('slug') slug: string,
  ) {
    try {
      const data = await this.productService.findBySlug(slug);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      console.log(error);
      return response.status(REQUEST_ERROR).json(requestInvalid(error));
    }
  }

  @Get('by-category/:categoryId')
  async getProductsByCategory(
    @Param('categoryId') categoryId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.productService.findByCategory(
      categoryId,
      page,
      limit,
    );
    return {
      ...result,
      data: result.data.map((product) => ({
        ...product,
        categoryName: product.category ? product.category.name : null,
        subCategoryName: product.subCategory ? product.subCategory.name : null,
      })),
    };
  }

  @Get('by-subcategory/:subCategoryId')
  async getProductsBySubCategory(
    @Param('subCategoryId') subCategoryId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.productService.findBySubCategory(
      subCategoryId,
      page,
      limit,
    );
    return {
      ...result,
      data: result.data.map((product) => ({
        ...product,
        categoryName: product.category ? product.category.name : null,
        subCategoryName: product.subCategory ? product.subCategory.name : null,
      })),
    };
  }

  @Get(':id')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async findOne(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: number,
  ) {
    try {
      const product = await this.productService.findById(id);
      return {
        statusCode: SUCCESS,
        data: {
          ...product,
          categoryName: product.category ? product.category.name : null,
          subCategoryName: product.subCategory
            ? product.subCategory.name
            : null,
        },
      };
    } catch (error) {
      console.log(error);
      return response.status(REQUEST_ERROR).json(requestInvalid(error));
    }
  }

  @Post('create')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async create(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body() productDto: ProductDto,
  ) {
    try {
      if (!request.user || !request.user.userId) {
        return response
          .status(REQUEST_ERROR)
          .json(requestInvalid('User ID not found in token'));
      }
      const userId = request.user.userId; // Extract userId from the user object attached by TokenValidationGuard

      // Check if category already exists
      const existingCproduct = await this.productService.findByName(
        productDto.name,
      );
      if (existingCproduct) {
        return response
          .status(REQUEST_ERROR)
          .json(requestInvalid('Product already exists'));
      }

      const data = await this.productService.create(productDto, userId);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      console.log(error);
      return response.status(REQUEST_ERROR).json(requestInvalid(error));
    }
  }

  @Put('update/:id')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async update(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: number,
    @Body() productDto: ProductDto,
  ) {
    try {
      const data = await this.productService.update(id, productDto);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      return response.status(REQUEST_ERROR).json(requestInvalid(error));
    }
  }

  @Delete('delete/:id')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async remove(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: number,
  ) {
    try {
      await this.productService.remove(id);
      return response
        .status(SUCCESS)
        .json(success({ message: 'Product deleted successfully' }));
    } catch (error) {
      return response.status(REQUEST_ERROR).json(requestInvalid(error));
    }
  }
}
