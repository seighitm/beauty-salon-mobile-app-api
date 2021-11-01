import {IService} from "./service";
import {IUser} from "./user";

export interface IBooking {
    _id: string;
    dateTime: string;
    status: string;
    info: string;
    service?: IService;
    staff?: IUser
}
