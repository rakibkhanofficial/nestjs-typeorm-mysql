import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Car } from './car.entity';

@Entity('tblCarBooking')
export class CarBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.cars)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: false })
  carId: number;

  @ManyToOne(() => Car, (car) => car.user)
  @JoinColumn({ name: 'carId' })
  car: Car;

  // New nullable driverId column
  @Column({ type: 'number', nullable: true })
  driverId: number | null;

  // Relation to the User entity with the role of Driver
  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'driverId' })
  driver: User | null;

  @Column({ type: 'varchar', length: 50, nullable: false })
  tripType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  airportName: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  flightNo: string;

  @Column({ type: 'boolean', default: false })
  childSeat: boolean;

  @Column({ type: 'integer', nullable: false })
  luggage: number;

  @Column({ type: 'integer', nullable: false })
  passenger: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  carModel: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  carName: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  mobileNumber: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  rideStatus: string;

  @Column({ unique: false, type: 'longtext', nullable: true })
  carImage: string;

  @Column({ type: 'text', nullable: false })
  pickupLocationAddress: string;

  @Column({ type: 'text', nullable: true })
  pickupLocationMapLink: string;

  @Column({ type: 'date', nullable: false })
  pickupDate: Date;

  @Column({ type: 'time', nullable: false })
  pickupTime: string;

  @Column({ type: 'text', nullable: false })
  dropoffLocationAddress: string;

  @Column({ type: 'text', nullable: true })
  dropoffLocationMapLink: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalBookingPrice: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  renterName: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  renterPhone: string;

  @Column({ type: 'integer', nullable: true })
  hour: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  distance: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripePaymentIntentId: string;

  @Column({ type: 'varchar', length: 50 })
  paymentStatus: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
