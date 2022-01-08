import {NextFunction, Request, Response} from "express";
import {IUser} from "../types/user";
import {IMulterRequest} from "../types/request";

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

    async updateUserInfo(req: IMulterRequest, res: Response, next: NextFunction) {
        const {id} = req.params

        let updatePayload: {
            username?: string,
            email?: string,
            numberPhone?: string,
            photo?: string
        } = {};

        if (req.body.username)
            updatePayload.username = req.body.username as string;
        if (req.body.email)
            updatePayload.email = req.body.email as string;
        if (req.body.numberPhone)
            updatePayload.numberPhone = req.body.numberPhone as string;
        if (req.file && req.file.filename)
            updatePayload.photo = req.file.filename as string;

        await User.findByIdAndUpdate(id,
            {$set: {...updatePayload}})

        const userDb = await User.findById(id)
        res.send(userDb)
    }
}

module.exports = new UserController()
