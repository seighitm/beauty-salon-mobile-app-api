import {Request} from "express";
import {IUser} from "./user";

export interface IAuthInfoRequest extends Request {
    user: IUser
}

export interface IMulterRequest extends Request {
    file: any;
}
