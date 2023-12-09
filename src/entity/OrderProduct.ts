import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product } from "./Products";
import { MyOrder } from "./Order";

@Entity()
export class MyOrderProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MyOrder)
  @JoinColumn({ name: "order_id" })
  order_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product_id: number;

  @Column()
  amount: number;

  @Column()
  price: number;
}
