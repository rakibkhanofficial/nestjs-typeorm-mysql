// src/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from './products.entity';
import { Order } from './tblorder.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: false })
  name: string;

  @Column({ unique: false })
  email: string;

  @Column({ unique: false, nullable: true })
  phone: string;

  @Column({ unique: false, nullable: true })
  image: string;

  @Column({ unique: false, nullable: true })
  birthdaydate: Date;

  @Column({ unique: false, nullable: true })
  homeaddress: string;

  @Column({ unique: false, nullable: true })
  homeaddresslocationLink: string;

  @Column({ unique: false, nullable: true })
  officeadress: string;

  @Column({ unique: false, nullable: true })
  officeadresslocationLink: string;

  @Column()
  password: string;

  @Column({ unique: false })
  role: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Order, (order) => order.user)
  productOrders: Order[];

  // New OneToMany relation with order as Deliveryman
  @OneToMany(() => Order, (order) => order.deliveryman)
  deliveries: Order[]; // This will represent the bookings where the user is a Deliveryman

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ unique: false, nullable: true })
  access_token: string;

  @Column({ unique: false, nullable: true })
  refresh_token: string;

  @Column({ unique: false, nullable: true })
  access_tokenExpiresIn: string;

  @Column({ unique: false, nullable: true })
  refresh_tokenExpiresIn: string;

  @Column({ unique: false, nullable: true })
  provider: string;

  @Column({ unique: false, nullable: true })
  providerId: string;

  @Column({ unique: false, nullable: true })
  createdAt: Date;

  @Column({ unique: false, nullable: true })
  updatedAt: Date;
}
