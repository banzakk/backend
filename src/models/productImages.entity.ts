import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '.';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  is_thumbnail: number;

  @Column()
  url: string;

  @ManyToOne(() => Product, (product) => product.product_images)
  product: Product;
}