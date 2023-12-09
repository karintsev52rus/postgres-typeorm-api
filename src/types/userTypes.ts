import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface IUserJWTPayload extends JwtPayload {
  id: number;
  password: string;
}

export interface ICreateUserPayload extends Request {
  body: {
    email: string;
    password: string;
    name?: string;
  };
}

export interface ILoginUserPayload extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface IUserDataRequest extends Request {
  user: {
    userId?: number;
    role?: string;
  };
}

export interface IAuthRequest<BodyPayload> extends IUserDataRequest {
  body: BodyPayload;
}

export interface IUserIdPayload {
  userId: number;
}

export interface IUserAuthData {
  password: string;
  role_name: string;
}
