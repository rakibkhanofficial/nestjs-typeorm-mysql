// subcategory.controller.ts
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
import { SubCategoryDto } from './subcategory.dto';
import { SubCategoryService } from './subcategory.service';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
    // Add other properties from your token payload if needed
  };
}

@Controller('subcategories')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}

  @Get()
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async findAll() {
    const responsedata = await this.subCategoryService.findAll();
    return {
      statusCode: 200,
      message: 'Subcategory list was successfully retrieved',
      data: responsedata,
    };
  }

  @Get('subcategorybycategoryId/:id')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async findAllByCategoryId(@Param('id') id: number) {
    const responsedata = await this.subCategoryService.findBycategoryId(id);
    return {
      statusCode: 200,
      message: 'Subcategory was successfully retrieved By categoryId',
      data: responsedata,
    };
  }

  @Get('details/:id')
  async findOne(@Param('id') id: number) {
    const responsedata = await this.subCategoryService.findById(id);
    return {
      statusCode: 200,
      message: 'Subcategory was successfully retrieved',
      data: responsedata,
    };
  }

  @Post('createSubCategory')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async create(
    @Req() request: RequestWithUser,
    @Body() subCategoryDto: SubCategoryDto,
  ) {
    try {
      if (!request.user || !request.user.userId) {
        return {
          statusCode: 401,
          error: 'Unauthorized',
        };
      }
      const userId = request.user.userId; // Extract userId from the user object attached by TokenValidationGuard
      // Check if Subcategory already exists
      const existingSubCategory = await this.subCategoryService.findByName(
        subCategoryDto.name,
      );
      if (existingSubCategory) {
        throw new ConflictException('Sub-Category already exists');
      }
      const data = await this.subCategoryService.create(subCategoryDto, userId);
      return {
        statusCode: 200,
        message: 'Subcategory was successfully created',
        data,
      };
    } catch (error) {
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
  async update(
    @Param('id') id: number,
    @Body() subCategoryDto: SubCategoryDto,
  ) {
    const updatedData = await this.subCategoryService.update(
      id,
      subCategoryDto,
    );
    return {
      statusCode: 200,
      message: 'Subcategory was successfully updated',
      data: updatedData,
    };
  }

  @Delete('delete/:id')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async remove(@Param('id') id: number) {
    const response = await this.subCategoryService.remove(id);
    return {
      statusCode: 200,
      message: 'Subcategory was successfully deleted',
      data: response,
    };
  }
}
