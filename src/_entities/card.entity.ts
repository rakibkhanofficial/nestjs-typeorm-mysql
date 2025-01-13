import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  number: string;

  @Column()
  holder: string;

  @Column()
  expiryMonth: string;

  @Column()
  expiryYear: string;

  @Column({ nullable: true })
  cvv: string;

  @Column()
  type: string;
}
