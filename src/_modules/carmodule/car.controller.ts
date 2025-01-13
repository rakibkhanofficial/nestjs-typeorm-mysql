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
import { CarDto } from './car.dto';
import { CarService } from './car.service';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Roles } from '../auth/jwt/roles.decorator';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
  };
}

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get('public-list')
  async getPublicList(@Req() request: Request, @Res() response: Response) {
    try {
      const cars = await this.carService.getPublicList();
      return response.status(200).json({
        statusCode: 200,
        message: 'Car list was successfully retrieved',
        data: cars,
      });
    } catch (error) {
      console.error('Error in getPublicList:', error);
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while fetching the car list',
        error: error.message,
      });
    }
  }

  @Get('public-details/:slug')
  async getPublicDetailsBySlug(
    @Req() request: Request,
    @Res() response: Response,
    @Param('slug') slug: string,
  ) {
    try {
      const data = await this.carService.findBySlug(slug);
      return response.status(SUCCESS).json(success(data));
    } catch (error) {
      console.log(error);
      return response.status(REQUEST_ERROR).json(requestInvalid(error));
    }
  }

  @Get()
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Admin', 'SuperAdmin')
  async findAll(@Req() request: Request, @Res() response: Response) {
    try {
      const cars = await this.carService.findAll();
      return response.status(200).json({
        statusCode: 200,
        message: 'Car list was successfully retrieved',
        data: cars,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while fetching the car list',
        error: error.message,
      });
    }
  }

  @Get('by-category/:categoryId')
  async getCarsByCategory(
    @Param('categoryId') categoryId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.carService.findByCategory(
      categoryId,
      page,
      limit,
    );
    return {
      ...result,
      data: result.data.map((car) => ({
        ...car,
        categoryName: car.category ? car.category.name : null,
        subCategoryName: car.subCategory ? car.subCategory.name : null,
      })),
    };
  }

  @Get('by-subcategory/:subCategoryId')
  async getCarsBySubCategory(
    @Param('subCategoryId') subCategoryId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.carService.findBySubCategory(
      subCategoryId,
      page,
      limit,
    );
    return {
      ...result,
      data: result.data.map((car) => ({
        ...car,
        categoryName: car.category ? car.category.name : null,
        subCategoryName: car.subCategory ? car.subCategory.name : null,
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
      const car = await this.carService.findById(id);
      return {
        statusCode: SUCCESS,
        data: {
          ...car,
          categoryName: car.category ? car.category.name : null,
          subCategoryName: car.subCategory ? car.subCategory.name : null,
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
    @Body() carDto: CarDto,
  ) {
    try {
      if (!request.user || !request.user.userId) {
        return response
          .status(REQUEST_ERROR)
          .json(requestInvalid('User ID not found in token'));
      }
      const userId = request.user.userId;

      const existingCar = await this.carService.findByName(carDto.name);
      if (existingCar) {
        return response
          .status(REQUEST_ERROR)
          .json(requestInvalid('Car already exists'));
      }

      const data = await this.carService.create(carDto, userId);
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
    @Body() carDto: CarDto,
  ) {
    try {
      const data = await this.carService.update(id, carDto);
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
      await this.carService.remove(id);
      return response
        .status(SUCCESS)
        .json(success({ message: 'Car deleted successfully' }));
    } catch (error) {
      return response.status(REQUEST_ERROR).json(requestInvalid(error));
    }
  }
}
