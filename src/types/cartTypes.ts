import { IUserIdPayload } from "./userTypes";

export interface IUpdateCartPayload extends IUserIdPayload {
  productId?: number;
  amount?: number;
}
