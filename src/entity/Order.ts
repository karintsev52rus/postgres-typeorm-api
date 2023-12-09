import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { MyUser } from "./MyUser";

@Entity()
export class MyOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MyUser)
  @JoinColumn({ name: "user_id" })
  user_id: number;

  @Column()
  datetime: Date;
}
