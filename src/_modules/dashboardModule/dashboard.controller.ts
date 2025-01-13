import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { DashboardService, IBookingListType } from './dashboard.service';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Roles } from '../auth/jwt/roles.decorator';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
    role: string;
  };
}

@Controller('dashboard')
@UseGuards(TokenValidationGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @Roles('Admin', 'SuperAdmin')
  async getAdminDashboard(@Req() request: RequestWithUser) {
    try {
      const dashboardData = await this.dashboardService.getAdminDashboardData();
      return {
        statusCode: HttpStatus.OK,
        message: 'Admin dashboard data retrieved successfully',
        data: dashboardData,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while fetching admin dashboard data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user')
  @Roles('Customer')
  async getUserDashboard(@Req() request: RequestWithUser) {
    try {
      const userId = request.user.userId;
      const dashboardData =
        await this.dashboardService.getUserDashboardData(userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'User dashboard data retrieved successfully',
        data: dashboardData,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while fetching user dashboard data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('driver')
  @Roles('Driver')
  async getDriverDashboard(@Req() request: RequestWithUser) {
    try {
      const userId = request.user.userId;
      const dashboardData =
        await this.dashboardService.getUserDashboardData(userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'User dashboard data retrieved successfully',
        data: dashboardData,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while fetching user dashboard data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('admin/booking-list-type')
  @Roles('Admin', 'SuperAdmin')
  async getAdminBookingListType(@Req() request: RequestWithUser): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: IBookingListType;
  }> {
    try {
      const bookingListType =
        await this.dashboardService.getAdminBookingListType();
      return {
        statusCode: HttpStatus.OK,
        message: 'Admin booking list type data retrieved successfully',
        data: bookingListType,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            'An error occurred while fetching admin booking list type data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/booking-list-type')
  @Roles('Customer')
  async getUserBookingListType(@Req() request: RequestWithUser): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: IBookingListType;
  }> {
    try {
      const userId = request.user.userId;
      const bookingListType =
        await this.dashboardService.getUserBookingListType(userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'User booking list type data retrieved successfully',
        data: bookingListType,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            'An error occurred while fetching user booking list type data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('driver/booking-list-type')
  @Roles('Driver')
  async getDriverBookingListType(@Req() request: RequestWithUser): Promise<{
    statusCode: HttpStatus;
    message: string;
    data: IBookingListType;
  }> {
    try {
      const userId = request.user.userId;
      const bookingListType =
        await this.dashboardService.getDriverBookingListType(userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'User booking list type data retrieved successfully',
        data: bookingListType,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            'An error occurred while fetching user booking list type data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
