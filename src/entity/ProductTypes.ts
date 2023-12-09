import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class ProductType {
  @PrimaryGeneratedColumn()
  type_id: number;

  @Column()
  name: string;

  @Column()
  label: string;
}
