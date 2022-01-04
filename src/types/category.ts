import {IService} from "./service";

export interface ICategory {
    _id: string;
    name: string;
    photo: string;
    services?: IService;
    staffs?: object[];
}
