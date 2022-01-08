import {NextFunction, Request, Response} from "express";
import {IUser} from "../types/user";

const ApiError = require("../error/ApiError");
const {User} = require("../models");
const {ObjectUtils, AppConstants} = require("../utils");

class UserController {
    async updateToStaffAccountType(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        ObjectUtils.checkValuesFormat(req, next);

        await User.findByIdAndUpdate(id, {role: AppConstants.ROLE_ADMIN})
            .then((data: IUser) => {
                res.send(data)
            }).catch((err) => {
                return next(ApiError.internal(err.message));
            });
    }

    async deleteOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        ObjectUtils.checkValuesFormat(req, next);

        await User.findByIdAndDelete(id)
            .then((data: IUser) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.badRequest(err.message));
            });
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        let filter: any = {};

        if (req.query.role != null)
            filter.role = req.query.role as string;

        await User.find(filter)
            .populate("bookingServices")
            .populate("cart")
            .then((data: IUser) => {
                res.send(data)
            }).catch((err) => {
                return next(ApiError.internal(err.message));
            });
    }

    async getOneUser(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params

        await User.findById(id)
            .populate("bookingServices")
            .populate("cart")
            .then((data: IUser) => {
                res.send(data)
            }).catch((err) => {
                return next(ApiError.internal(err.message));
            });
    }
}

module.exports = new UserController()
