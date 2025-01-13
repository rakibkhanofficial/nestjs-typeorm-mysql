// category.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  ConflictException,
} from '@nestjs/common';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Roles } from '../auth/jwt/roles.decorator';
import { CategoryService } from './category.service';
import { CategoryDto } from './category.dto';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
    // Add other properties from your token payload if needed
  };
}

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async findAll() {
    const responsedata = await this.categoryService.findAll();
    return {
      statusCode: 200,
      message: 'Category list was successfully retrieved',
      data: responsedata,
    };
  }

  @Get('/publicCategory')
  async PubliccategoryList() {
    const responsedata = await this.categoryService.findPublicCategoryList();
    return {
      statusCode: 200,
      message: 'Category list was successfully retrieved',
      data: responsedata,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.categoryService.findById(id);
  }

  @Post('createCategory')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async create(
    @Req() request: RequestWithUser,
    @Body() categoryDto: CategoryDto,
  ) {
    try {
      if (!request.user || !request.user.userId) {
        return {
          statusCode: 401,
          error: 'Unauthorized',
        };
      }
      const userId = request.user.userId;

      // Check if category already exists
      const existingCategory = await this.categoryService.findByName(
        categoryDto.name,
      );

      if (existingCategory) {
        throw new ConflictException('Category already exists');
      }

      const data = await this.categoryService.create(categoryDto, userId);
      return {
        statusCode: 200,
        message: 'Category was successfully created',
        data,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        return {
          statusCode: 409,
          message: error.message,
        };
      }
      console.log(error);
      return {
        statusCode: 500,
        error: 'Internal Server Error',
      };
    }
  }

  @Put('update/:id')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async update(@Param('id') id: number, @Body() categoryDto: CategoryDto) {
    const updatedData = await this.categoryService.update(id, categoryDto);
    return {
      statusCode: 200,
      message: 'Category was successfully updated',
      data: updatedData,
    };
  }

  @Delete('delete/:id')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async remove(@Param('id') id: number) {
    const response = await this.categoryService.remove(id);
    return {
      statusCode: 200,
      message: 'Category was successfully deleted',
      data: response,
    };
  }
}
