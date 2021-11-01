import {IUser} from "./user";

export interface INotification {
    _id: string;
    staff?: IUser;
    client?: IUser;
    message?: string;
    dateTime?: string;
}

