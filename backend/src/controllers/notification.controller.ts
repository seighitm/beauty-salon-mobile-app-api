import {NextFunction, Request, Response} from "express";
import {INotification} from "../types/notification";

const DateUtils = require("../utils/dateUtils")
const ApiError = require("../error/ApiError");
const Notification = require("../models/notification.model");

class NotificationController {
    async create(req: Request, res: Response, next: NextFunction) {
        const {clientId, staffId, message} = req.body;

        await Notification.create({
            dateTime: DateUtils.getCurrentDate,
            message,
            staff: staffId,
            client: clientId
        }).then((data: INotification) => {
            res.send(data)
        }).catch((err) => {
            return next(ApiError.internal(err.message))
        })
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        await Notification.find({})
            .populate({path: "client"})
            .populate({path: "staff"})
            .then((data: INotification) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params

        await Notification.find({_id: id})
            .populate({path: "client"})
            .populate({path: "staff"})
            .then((data: INotification) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }
}

module.exports = new NotificationController()
