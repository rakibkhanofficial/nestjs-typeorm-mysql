import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './tblorderItems.entity';
import { Product } from './products.entity';

@Entity('tblOrder')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.productOrders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => Product, (product) => product.orders)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'number', nullable: true })
  deliverymanId: number | null;

  @ManyToOne(() => User, (user) => user.deliveries)
  @JoinColumn({ name: 'deliverymanId' })
  deliveryman: User | null;

  @Column({ type: 'varchar', length: 20, nullable: false })
  deliveryStatus: string;

  @Column({ type: 'date', nullable: false })
  expectedDeliveryDate: Date;

  @Column({ type: 'varchar', nullable: false })
  expectedDeliveryTime: string;

  @Column({ type: 'text', nullable: false })
  deliveryLocationAddress: string;

  @Column({ type: 'text', nullable: true })
  deliveryLocationMapLink: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalOrderPrice: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  buyerName: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  buyerPhone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripePaymentIntentId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  orderStatus: string;

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
