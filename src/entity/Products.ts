import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Brand } from "./Brand";
import { ProductType } from "./ProductTypes";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: "brand_id" })
  brand_id: number;

  @ManyToOne(() => ProductType)
  @JoinColumn({ name: "type_id" })
  type_id: number;

  @Column()
  price: number;

  @Column({ nullable: true })
  description: string;
}
