import {NextFunction, Request, Response} from "express";
import {INotification} from "../types/notification";
import {IService} from "../types/service";

const DateUtils = require("../utils/dateUtils")
const ApiError = require("../error/ApiError");
const Notification = require("../models/notification.model");
const {ObjectUtils} = require("../utils");

class NotificationController {
    async create(req: Request, res: Response, next: NextFunction) {
        const {clientId, staffId, message} = req.body;

        ObjectUtils.checkValuesFormat(req, next);

        await Notification.create({
            dateTime: DateUtils.getCurrentDate(),
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

        ObjectUtils.checkValuesFormat(req, next);

        await Notification.find({_id: id})
            .populate({path: "client"})
            .populate({path: "staff"})
            .then((data: INotification) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    deleteOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        ObjectUtils.checkValuesFormat(req, next);

        Notification.findByIdAndDelete(id)
            .then((data: INotification) => {
                res.send(data);
            }).catch(err => {
            return next(ApiError.badRequest(err.message));
        });
    }
}

module.exports = new NotificationController()
