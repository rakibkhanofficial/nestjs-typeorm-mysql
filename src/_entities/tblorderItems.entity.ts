// tblorderItems.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './tblorder.entity';
import { Product } from './products.entity';

@Entity('tblOrderItem')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  orderId: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ nullable: false })
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({ unique: false, type: 'longtext', nullable: true })
  productImage: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
