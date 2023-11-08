import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from '.';
import { Market } from './market.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 20,
  })
  title: string;

  @Column()
  content: string;

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
  })
  price: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  product_images: ProductImage[];

  @ManyToOne(() => Market, (market) => market.products)
  @JoinColumn()
  market: Market;
}
