import { Request } from "express";
import { Product } from "../entity/Products";

export interface INewProductPayload extends Request {
  body: Product;
}

export interface IUpdateProductPayload extends Request {
  body: Partial<Product>;
}
