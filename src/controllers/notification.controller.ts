import {NextFunction, Request, Response} from "express";
import {INotification} from "../types/notification";

const DateUtils = require("../utils/dateUtils")
const ApiError = require("../error/ApiError");
const {Notification} = require("../models");
const {ObjectUtils, AppConstants} = require("../utils");

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
            .populate({path: AppConstants.CLIENT})
            .populate({path: AppConstants.STAFF})
            .then((data: INotification) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async getMyNotifications(req: Request, res: Response, next: NextFunction) {
        const {userId} = req.query;
        await Notification.find({$or: [{staff: userId}, {client: userId}]})
            .populate({path: AppConstants.CLIENT})
            .populate({path: AppConstants.STAFF})
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
            .populate({path: AppConstants.CLIENT})
            .populate({path: AppConstants.STAFF})
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
