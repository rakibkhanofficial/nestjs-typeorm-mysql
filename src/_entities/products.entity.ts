import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { SubCategory } from './subcategory.entity';
import { Order } from './tblorder.entity';

@Entity('tblProduct')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  slug: string;

  @Column({ unique: false, type: 'longtext', nullable: true })
  prodimage: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  offerprice: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  packsize: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sku: string;

  @Column({ type: 'integer', nullable: false, default: 0 })
  stockQuantity: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  brand: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: 'simple-json', nullable: true })
  dimensions: { length: number; width: number; height: number };

  @Column({ type: 'simple-array', nullable: true })
  allergens: string[];

  @Column({ type: 'date', nullable: true })
  expirationDate: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  barcode: string;

  // In your Product entity
  @OneToMany(() => Order, (order) => order.product)
  orders: Order[];

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.products)
  @JoinColumn({ name: 'subCategoryId' })
  subCategory: SubCategory;

  @Column({ nullable: true })
  subCategoryId: number;

  @Column({ type: 'simple-json', nullable: true })
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
