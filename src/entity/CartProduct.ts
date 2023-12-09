import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { MyUser } from "./MyUser";
import { Product } from "./Products";

@Entity()
export class CartProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MyUser)
  @JoinColumn({ name: "user_id" })
  user_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product_id: number;

  @Column()
  amount: number;
}
