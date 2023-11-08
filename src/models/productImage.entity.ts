import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '.';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'tinyint',
    width: 1,
  })
  is_thumbnail: number;

  @Column({
    length: 255,
  })
  url: string;

  @ManyToOne(() => Product, (product) => product.product_images)
  @JoinColumn()
  product: Product;
}
