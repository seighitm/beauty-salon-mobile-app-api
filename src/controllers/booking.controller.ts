import {NextFunction, Request, Response} from "express";
import {IBooking} from "../types/booking";
import {IService} from "../types/service";
import {IUser} from "../types/user";
import {IBookingFilterRequest} from "../types/payload/bookingFilterRequest";

const ApiError = require("../error/ApiError");
const {Service, Cart, Booking, User, BookingList} = require("../models");
const {ObjectUtils, DateUtils, AppConstants} = require("../utils");

class BookingController {
    async create(req: Request, res: Response, next: NextFunction) {
        const {clientId}: any = req.body;

        ObjectUtils.checkValuesFormat(req, next);

        const cartDb = await Cart.find({user: clientId, status: "PENDING"})
        for (let i = 0; i < cartDb.length; i++) {
            cartDb[i].set({status: "IN_PROGRESS"})
            cartDb[i].save()
        }

        await User.findByIdAndUpdate(clientId,
            {$push: {bookingServices: cartDb}, $set: {cart: []}},
            {new: true, useFindAndModify: false}
        ).populate("bookingServices")
            .then((data: IUser) => {
                res.send(data)
            }).catch((err) => {
                return next(ApiError.internal(err.message));
            });
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        await Cart.find({})
            .populate({path: AppConstants.SERVICE})
            .populate({path: AppConstants.STAFF})
            .then((data: IBooking) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params

        ObjectUtils.checkValuesFormat(req, next);

        await Cart.find({_id: id, $or: [{status: "IN_PROGRESS"}, {status: "CLOSED"}]})
            .populate({path: AppConstants.SERVICE})
            .populate({path: AppConstants.STAFF})
            .populate({path: 'user'})
            .then((data: IBooking) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async getMyBookingFilter(req: Request, res: Response, next: NextFunction) {
        let filter: any = {};

        if (req.query.status != null) {
            filter.status = req.query.status as string;
            filter.status = filter.status.toUpperCase();
        }else {
            filter.status = { "$ne": "PENDING" }
        }
        if (req.query.clientId != null)
            filter.user = req.query.clientId as string;

        await Cart.find({...filter})
            .populate({path: AppConstants.SERVICE})
            .populate({path: AppConstants.STAFF})
            .then((data: IUser) => {
                res.send(data)
            }).catch((err) => {
                return next(ApiError.internal(err.message));
            });
    }

    async closeBooking(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        ObjectUtils.checkValuesFormat(req, next);

        await Cart.findByIdAndUpdate(id, {status: AppConstants.STATUS_CLOSED})
            .then((data: IUser) => {
                res.send(data)
            }).catch((err) => {
                return next(ApiError.internal(err.message));
            });
    }

    async checkAvailability(req: Request, res: Response, next: NextFunction) {
        const {staffId, date} = req.body;

        const timeIntervals = ["7:00", "8:30", "10:00", "11:30", "13:00", "14:30", "16:00"]

        ObjectUtils.checkValuesFormat(req, next);

        await Cart.find({
            staff: staffId,
            status: "IN_PROGRESS",
            dateTime: {"$regex": date, "$options": "i"}
        }).then((bookings: IBooking[]) => {
            let dateFromDb = bookings.map(item => item.dateTime.split("/")[1]);
            let timeAvailable = timeIntervals.filter(item => !dateFromDb.includes(item))
            res.send(timeAvailable)
        }).catch((err) => {
            return next(ApiError.internal(err.message));
        });
    }

    async deleteOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        ObjectUtils.checkValuesFormat(req, next);

        await Cart.findByIdAndDelete(id)
            .then((data: IUser) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.badRequest(err.message));
            });
    }
}

module.exports = new BookingController()
