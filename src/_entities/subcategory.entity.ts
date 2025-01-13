// subcategory.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Product } from './products.entity';

@Entity('tblSubCategory')
export class SubCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Category, (category) => category.subCategories)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: false })
  categoryId: number;

  @Column({ nullable: false })
  userId: number;

  @OneToMany(() => Product, (product) => product.subCategory)
  products: Product[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
