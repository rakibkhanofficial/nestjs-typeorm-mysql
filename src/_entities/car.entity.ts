// src/_entities/car.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { SubCategory } from './subcategory.entity';

@Entity('tblCar')
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.cars)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  slug: string;

  @Column({ unique: false, type: 'longtext', nullable: true })
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  pricePerHour: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  pricePerMile: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  model: string;

  @Column({ type: 'integer', nullable: false })
  year: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  make: string;

  @Column({ type: 'integer', nullable: false })
  seatingCapacity: number;

  @Column({ type: 'boolean', default: false })
  hasChildSeat: boolean;

  @Column({ type: 'boolean', default: false })
  hasWifi: boolean;

  @Column({ type: 'integer', nullable: false })
  luggageCapacity: number;

  @Column({ type: 'decimal', precision: 5, scale: 1, nullable: false })
  mileagePerGallon: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  transmission: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  fuelType: string;

  @Column({ type: 'simple-array', nullable: true })
  features: string[];

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.cars)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.cars)
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: SubCategory;

  @Column({ nullable: true })
  subCategoryId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
