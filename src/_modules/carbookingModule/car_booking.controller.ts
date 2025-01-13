import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Put,
  Query,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CarBookingService } from './car_booking.service';
import { CreateCarBookingDto, UpdateCarBookingDto } from './car_booking.dto';
import { TokenValidationGuard } from '../../guards/token-validation.guard';
import { RolesGuard } from '../auth/jwt/roles.guard';
import { Roles } from '../auth/jwt/roles.decorator';

interface RequestWithUser extends Request {
  user?: {
    userId: number;
  };
}

@Controller('car-bookings')
// @UseGuards(TokenValidationGuard, RolesGuard)
export class CarBookingController {
  constructor(private readonly carBookingService: CarBookingService) {}

  @Post('createbookingbycash')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Customer', 'Admin', 'SuperAdmin')
  async create(@Body() createCarBookingDto: CreateCarBookingDto, @Req() req) {
    if (createCarBookingDto.paymentMethod !== 'cash') {
      throw new Error(
        'This endpoint is for cash payments only. For online payments, use the payments/process-online-payment endpoint.',
      );
    }

    const booking = await this.carBookingService.CashBookingcreate(
      createCarBookingDto,
      req.user.userId,
    );
    return {
      statusCode: 201,
      message: 'Car booking was successfully created',
      data: booking,
    };
  }

  @Get('/carBookingsbyuser/:page/:limit')
  @Roles('Customer')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAll(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    try {
      if (!request.user || !request.user.userId) {
        return {
          statusCode: 401,
          error: 'Unauthorized',
        };
      }
      const data = await this.carBookingService.findAll(
        request.user.userId,
        page,
        limit,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Car booking list was successfully retrieved',
        data,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while fetching the car booking list',
        error: error.message,
      });
    }
  }

  @Get('/admincarbookinglist/:page/:limit')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAllBookingForAdmin(
    @Res() response: Response,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    try {
      const data = await this.carBookingService.findAllBookingforadmin(
        page,
        limit,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Car booking list was successfully retrieved',
        data,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while fetching the car booking list',
        error: error.message,
      });
    }
  }

  @Get('/admincarbookingpendinglist/:page/:limit')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAllPendingBookingForAdmin(
    @Res() response: Response,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    try {
      const data = await this.carBookingService.findAllPendingBookingforadmin(
        page,
        limit,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Pending Car booking list was successfully retrieved',
        data,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message:
          'An error occurred while fetching the Pending car booking list',
        error: error.message,
      });
    }
  }

  @Get('/admincarbookingacceptedlist/:page/:limit')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAllAcceptedBookingForAdmin(
    @Res() response: Response,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    try {
      const data = await this.carBookingService.findAllAcceptedBookingforadmin(
        page,
        limit,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Accepted Car booking list was successfully retrieved',
        data,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message:
          'An error occurred while fetching the Accepted car booking list',
        error: error.message,
      });
    }
  }

  @Get('/admincarbookingassignedlist/:page/:limit')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAllAssignedBookingForAdmin(
    @Res() response: Response,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    try {
      const data = await this.carBookingService.findAllAssignedBookingforadmin(
        page,
        limit,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Assigned Car booking list was successfully retrieved',
        data,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message:
          'An error occurred while fetching the Assigned car booking list',
        error: error.message,
      });
    }
  }

  @Get('/carbookingassignedlistfordriver/:page/:limit')
  @Roles('Driver')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAllAssignedBookingForDriver(
    @Res() response: Response,
    @Req() request: RequestWithUser,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    try {
      const data = await this.carBookingService.findAllAssignedBookingfordriver(
        page,
        limit,
        request.user.userId,
      );
      return response.status(200).json({
        statusCode: 200,
        message: ' Car booking list was successfully retrieved',
        data,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while fetching the car booking list',
        error: error.message,
      });
    }
  }

  @Get('/admincarbookingcompletelist/:page/:limit')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAllCompleteBookingForAdmin(
    @Res() response: Response,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    try {
      const data = await this.carBookingService.findAllCompletedBookingforadmin(
        page,
        limit,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Completed Car booking list was successfully retrieved',
        data,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message:
          'An error occurred while fetching the Completed car booking list',
        error: error.message,
      });
    }
  }

  @Get('/carbookingcompletelistfordriver/:page/:limit')
  @Roles('Driver')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAllCompleteBookingForDriver(
    @Res() response: Response,
    @Req() request: RequestWithUser,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    try {
      const data =
        await this.carBookingService.findAllCompletedBookingfordriver(
          page,
          limit,
          request.user.userId,
        );
      return response.status(200).json({
        statusCode: 200,
        message: 'Completed Car booking list was successfully retrieved',
        data,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message:
          'An error occurred while fetching the Completed car booking list',
        error: error.message,
      });
    }
  }

  @Get('/admincarbookingcanceledlist/:page/:limit')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAllCanceledBookingForAdmin(
    @Res() response: Response,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    try {
      const data = await this.carBookingService.findAllCancelBookingforadmin(
        page,
        limit,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Canceled Car booking list was successfully retrieved',
        data,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message:
          'An error occurred while fetching the Canceled car booking list',
        error: error.message,
      });
    }
  }

  @Get('/carbookingcnceledlistfordriver/:page/:limit')
  @Roles('Driver')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAllCanceledBookingForDriver(
    @Res() response: Response,
    @Req() request: RequestWithUser,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    try {
      const data = await this.carBookingService.findAllCanceledBookingfordriver(
        page,
        limit,
        request.user.userId,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Completed Car booking list was successfully retrieved',
        data,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message:
          'An error occurred while fetching the Completed car booking list',
        error: error.message,
      });
    }
  }

  @Get('/admincarbookingdetails/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async adminfindOne(@Res() response: Response, @Param('id') id: string) {
    try {
      const booking = await this.carBookingService.adminfindOne(+id);
      return response.status(200).json({
        statusCode: 200,
        message: 'Car booking was successfully retrieved',
        data: booking,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while fetching the car booking',
        error: error.message,
      });
    }
  }

  @Get('/carbookingdetails/:id')
  @Roles('Customer')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findOne(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('id') id: string,
  ) {
    try {
      const booking = await this.carBookingService.findOne(
        +id,
        request.user.userId,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Car booking was successfully retrieved',
        data: booking,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while fetching the car booking',
        error: error.message,
      });
    }
  }

  @Get('/carbookingdetailsfordriver/:id')
  @Roles('Driver')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async findAssignOneforDriver(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('id') id: string,
  ) {
    try {
      const booking = await this.carBookingService.findAssignOneBydriverId(
        +id,
        request.user.userId,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Car booking was successfully retrieved',
        data: booking,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while fetching the car booking',
        error: error.message,
      });
    }
  }

  @Put('update-status/:id')
  @Roles('Admin', 'SuperAdmin', 'Driver')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    try {
      const booking = await this.carBookingService.updateStatus(+id, status);
      return {
        statusCode: HttpStatus.OK,
        message: 'Car booking status was successfully updated',
        data: booking,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while updating the car booking status',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('assign-driver/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async assignDriver(
    @Param('id') id: string,
    @Body('driverId') driverId: number,
  ) {
    try {
      const booking = await this.carBookingService.assigndriver(+id, driverId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Car booking Driver was successfully updated',
        data: booking,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'An error occurred while updating the car booking Driver',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('update/:id')
  @Roles('Customer', 'Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async update(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('id') id: string,
    @Body() updateCarBookingDto: UpdateCarBookingDto,
  ) {
    try {
      const booking = await this.carBookingService.update(
        +id,
        updateCarBookingDto,
        request.user.userId,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Car booking was successfully updated',
        data: booking,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while updating the car booking',
        error: error.message,
      });
    }
  }

  @Delete('delete/:id')
  @UseGuards(TokenValidationGuard, RolesGuard)
  @Roles('Customer', 'Admin', 'SuperAdmin')
  async remove(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('id') id: string,
  ) {
    try {
      await this.carBookingService.remove(+id, request.user.userId);
      return response.status(200).json({
        statusCode: 200,
        message: 'Car booking was successfully deleted',
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message: 'An error occurred while deleting the car booking',
        error: error.message,
      });
    }
  }

  @Put('update-payment/:id')
  @Roles('Admin', 'SuperAdmin')
  @UseGuards(TokenValidationGuard, RolesGuard)
  async updatePaymentStatus(
    @Res() response: Response,
    @Param('id') id: string,
    @Body('paymentStatus') paymentStatus: string,
    @Body('paymentId') paymentId: string,
  ) {
    try {
      const booking = await this.carBookingService.updatePaymentStatus(
        +id,
        paymentStatus,
        paymentId,
      );
      return response.status(200).json({
        statusCode: 200,
        message: 'Car booking payment status was successfully updated',
        data: booking,
      });
    } catch (error) {
      return response.status(500).json({
        statusCode: 500,
        message:
          'An error occurred while updating the car booking payment status',
        error: error.message,
      });
    }
  }
}
