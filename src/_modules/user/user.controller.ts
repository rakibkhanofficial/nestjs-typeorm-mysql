// src/user/user.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../_entities/user.entity';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { Roles } from '../auth/jwt/roles.decorator';
import { RolesGuard } from '../auth/jwt/roles.guard';

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T | null;
}

@Controller('user')
// @UseGuards(TokenValidationGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // getUserStart(): string {
  //   console.log('get request from User here');
  //   return 'User start from here';
  // }

  @Get('/alldriverlist')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async getAllDriverList(): Promise<ApiResponse<User[]>> {
    try {
      const users = await this.userService.getAllDriverList();
      return {
        statusCode: 200,
        message: 'All driver list retrieved successfully',
        data: users,
      };
    } catch (error) {
      console.error('Error getting all driver list:', error);
      return {
        statusCode: 500,
        message: 'An error occurred while retrieving all driver list',
        data: null,
      };
    }
  }

  @Get('/allcustomerlist')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async getAllCustomerList(): Promise<ApiResponse<User[]>> {
    try {
      const users = await this.userService.getAllCustomerList();
      return {
        statusCode: 200,
        message: 'All customer list retrieved successfully',
        data: users,
      };
    } catch (error) {
      console.error('Error getting all customer list:', error);
      return {
        statusCode: 500,
        message: 'An error occurred while retrieving all customer list',
        data: null,
      };
    }
  }

  @Get(':email')
  async getUserByEmail(
    @Param('email') email: string,
  ): Promise<User | undefined> {
    return this.userService.findByEmail(email);
  }

  @Get('userdetails/:id')
  async getUserById(
    @Param('id') id: number,
  ): Promise<ApiResponse<Partial<User>>> {
    console.log('get request', id);
    try {
      const user = await this.userService.findUserById(id);
      if (!user) {
        return {
          statusCode: 404,
          message: 'User not found',
          data: null,
        };
      }
      // Return only specific fields
      const {
        name,
        phone,
        email,
        image,
        birthdaydate,
        homeaddress,
        officeadress,
        createdAt,
        updatedAt,
      } = user;
      return {
        statusCode: 200,
        message: 'User details retrieved successfully',
        data: {
          name,
          phone,
          email,
          image,
          birthdaydate,
          homeaddress,
          officeadress,
          createdAt,
          updatedAt,
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Internal server error',
        data: null,
      };
    }
  }

  @Put('userdetails/update/:id')
  @HttpCode(200)
  async updateUser(
    @Param('id') id: number,
    @Body()
    updateData: {
      name: string;
      phone: string | null;
      email: string;
      image: string | null;
      birthdaydate: Date | null;
      homeaddress: string | null;
      officeadress: string | null;
      createdAt: string;
      updatedAt: string;
    },
  ): Promise<ApiResponse<Partial<User>>> {
    try {
      const updatedUser = await this.userService.updateUserDetails(
        id,
        updateData,
      );
      if (!updatedUser) {
        return { statusCode: 404, message: 'User not found', data: null };
      }
      return {
        statusCode: 200,
        message: 'Information Updated Successfully',
        data: {
          name: updatedUser.name,
          phone: updatedUser.phone,
          email: updatedUser?.email,
          image: updatedUser?.image,
          birthdaydate: updatedUser?.birthdaydate,
          homeaddress: updatedUser?.homeaddress,
          officeadress: updatedUser?.officeadress,
          createdAt: updatedUser?.createdAt,
          updatedAt: updatedUser?.updatedAt,
        },
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error Updating Data',
        data: null,
      };
    }
  }
}
