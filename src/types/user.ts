import { Document, Schema } from "mongoose"

export interface IUser extends Document{
    _id: string;
    username: string;
    email: string;
    password?: string;
    role?: string;
    numberPhone?: string;
    photo?: string;
    isActive: boolean;
    cart?: object[];
}
