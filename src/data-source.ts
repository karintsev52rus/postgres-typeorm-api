import "reflect-metadata";
import { DataSource } from "typeorm";
import { MyUser } from "./entity/MyUser";
import { Product } from "./entity/Products";
import { Brand } from "./entity/Brand";
import { ProductType } from "./entity/ProductTypes";
import { Role } from "./entity/Role";
import { CartProduct } from "./entity/CartProduct";
import { MyOrder } from "./entity/Order";
import { MyOrderProduct } from "./entity/OrderProduct";
import config from "config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: config.get("username"),
  password: config.get("password"),
  database: config.get("database"),
  synchronize: true,
  logging: false,
  entities: [
    MyUser,
    Product,
    Brand,
    ProductType,
    Role,
    CartProduct,
    MyOrder,
    MyOrderProduct,
  ],
  migrations: [],
  subscribers: [],
});
