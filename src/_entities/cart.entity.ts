import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './products.entity';

@Entity('tblCart')
export class Cart {
  @PrimaryGeneratedColumn()
  cartProdId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  // Additional product information
  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sku: string;

  @Column({ type: 'varchar', length: 255 })
  packSize: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  offerPrice: number;

  @Column({ unique: false, type: 'longtext', nullable: true })
  prodimage: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;
}
