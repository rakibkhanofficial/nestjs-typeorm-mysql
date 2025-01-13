import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarBooking } from '../../_entities/car_booking.entity';

export interface MonthlyData {
  x: string;
  y: number;
}

export interface PieDonutData {
  labels: string[];
  values: number[];
}

export interface IBookingListType {
  totalPendingBookingdata: number;
  totalAcceptedBookingdata: number;
  totalAssignedBookingdata: number;
  totalCompleteBookingdata: number;
  totalCanceledBookingdata: number;
}

export interface AdminDashboardData {
  totalBookings: number;
  totalRevenue: number;
  monthlyBookingData: MonthlyData[];
  pieDonutData: PieDonutData;
}

export interface UserDashboardData {
  totalBookings: number;
  totalSpent: number;
  userBookingData: MonthlyData[];
  pieDonutData: PieDonutData;
}

export interface DriverDashboardData {
  totalBookings: number;
  totalEarn: number;
  userBookingData: MonthlyData[];
  pieDonutData: PieDonutData;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(CarBooking)
    private readonly carBookingRepository: Repository<CarBooking>,
  ) {}

  async getAdminDashboardData(): Promise<AdminDashboardData> {
    const totalBookings = await this.carBookingRepository.count();

    const totalRevenueResult = await this.carBookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalBookingPrice)', 'total')
      .where('booking.rideStatus = :rideStatus', { rideStatus: 'Completed' })
      .getRawOne();

    const totalRevenue = totalRevenueResult
      ? parseFloat(totalRevenueResult.total) || 0
      : 0;

    const monthlyBookingData = await this.carBookingRepository
      .createQueryBuilder('booking')
      .select("DATE_FORMAT(booking.createdAt, '%b')", 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // const bookingCategories = await this.carBookingRepository
    //   .createQueryBuilder('booking')
    //   .select('booking.tripType', 'category')
    //   .addSelect('COUNT(*)', 'count')
    //   .groupBy('booking.tripType')
    //   .getRawMany();

    const tripTypeData = await this.carBookingRepository
      .createQueryBuilder('booking')
      .select('booking.tripType', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('booking.tripType')
      .getRawMany();

    const pieDonutData = {
      labels: tripTypeData.map((item) => item.type),
      values: tripTypeData.map((item) => parseInt(item.count)),
    };

    return {
      totalBookings,
      totalRevenue,
      monthlyBookingData: monthlyBookingData.map((item) => ({
        x: item.month,
        y: parseInt(item.count),
      })),
      pieDonutData,
    };
  }

  async getUserDashboardData(userId: number): Promise<UserDashboardData> {
    const totalBookings = await this.carBookingRepository.count({
      where: { userId: userId },
    });

    const totalSpentResult = await this.carBookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalBookingPrice)', 'total')
      .where('booking.userId = :userId', { userId })
      .andWhere('booking.rideStatus = :rideStatus', { rideStatus: 'Completed' })
      .getRawOne();

    const totalSpent = totalSpentResult
      ? parseFloat(totalSpentResult.total) || 0
      : 0;

    const userBookingData = await this.carBookingRepository
      .createQueryBuilder('booking')
      .select("DATE_FORMAT(booking.createdAt, '%b')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('booking.userId = :userId', { userId })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    const tripTypeData = await this.carBookingRepository
      .createQueryBuilder('booking')
      .select('booking.tripType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('booking.userId = :userId', { userId })
      .groupBy('booking.tripType')
      .getRawMany();

    const pieDonutData = {
      labels: tripTypeData.map((item) => item.type),
      values: tripTypeData.map((item) => parseInt(item.count)),
    };

    return {
      totalBookings,
      totalSpent,
      userBookingData: userBookingData.map((item) => ({
        x: item.month,
        y: parseInt(item.count),
      })),
      pieDonutData,
    };
  }

  async getDriverDashboardData(driverId: number): Promise<DriverDashboardData> {
    const totalBookings = await this.carBookingRepository.count({
      where: { driverId: driverId },
    });

    const totalEarnResult = await this.carBookingRepository
      .createQueryBuilder('booking')
      .select('SUM(booking.totalBookingPrice)', 'total')
      .where('booking.driverId = :driverId', { driverId })
      .andWhere('booking.rideStatus = :rideStatus', { rideStatus: 'Completed' })
      .getRawOne();

    const totalEarn = totalEarnResult
      ? parseFloat(totalEarnResult.total) || 0
      : 0;

    const userBookingData = await this.carBookingRepository
      .createQueryBuilder('booking')
      .select("DATE_FORMAT(booking.createdAt, '%b')", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('booking.driverId = :driverId', { driverId })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    const tripTypeData = await this.carBookingRepository
      .createQueryBuilder('booking')
      .select('booking.tripType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('booking.driverId = :driverId', { driverId })
      .groupBy('booking.tripType')
      .getRawMany();

    const pieDonutData = {
      labels: tripTypeData.map((item) => item.type),
      values: tripTypeData.map((item) => parseInt(item.count)),
    };

    return {
      totalBookings,
      totalEarn,
      userBookingData: userBookingData.map((item) => ({
        x: item.month,
        y: parseInt(item.count),
      })),
      pieDonutData,
    };
  }

  async getAdminBookingListType(): Promise<IBookingListType> {
    return this.getBookingListType();
  }

  async getUserBookingListType(userId: number): Promise<IBookingListType> {
    return this.getBookingListType(userId);
  }

  private async getBookingListType(userId?: number): Promise<IBookingListType> {
    const baseQuery = this.carBookingRepository.createQueryBuilder('booking');

    if (userId) {
      baseQuery.where('booking.userId = :userId', { userId });
    }

    const bookingCounts = await baseQuery
      .select('booking.rideStatus', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('booking.rideStatus')
      .getRawMany();

    const countMap = bookingCounts.reduce((acc, { status, count }) => {
      acc[status] = parseInt(count);
      return acc;
    }, {});

    return {
      totalPendingBookingdata: countMap['Pending'] || 0,
      totalAcceptedBookingdata: countMap['Accepted'] || 0,
      totalAssignedBookingdata: countMap['Assigned'] || 0,
      totalCompleteBookingdata: countMap['Completed'] || 0,
      totalCanceledBookingdata: countMap['Canceled'] || 0,
    };
  }

  async getDriverBookingListType(driverId: number): Promise<IBookingListType> {
    return this.getBookingListTypedriver(driverId);
  }

  private async getBookingListTypedriver(
    driverId?: number,
  ): Promise<IBookingListType> {
    const baseQuery = this.carBookingRepository.createQueryBuilder('booking');

    if (driverId) {
      baseQuery.where('booking.driverId = :driverId', { driverId });
    }

    const bookingCounts = await baseQuery
      .select('booking.rideStatus', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('booking.rideStatus')
      .getRawMany();

    const countMap = bookingCounts.reduce((acc, { status, count }) => {
      acc[status] = parseInt(count);
      return acc;
    }, {});

    return {
      totalPendingBookingdata: countMap['Pending'] || 0,
      totalAcceptedBookingdata: countMap['Accepted'] || 0,
      totalAssignedBookingdata: countMap['Assigned'] || 0,
      totalCompleteBookingdata: countMap['Completed'] || 0,
      totalCanceledBookingdata: countMap['Canceled'] || 0,
    };
  }
}
