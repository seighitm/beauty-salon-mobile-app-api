import {NextFunction, Request, Response} from "express";
import {IBooking} from "../types/booking";
import {IService} from "../types/service";
import {IUser} from "../types/user";

const ApiError = require("../error/ApiError");
const Service = require("../models/service.model");
const Booking = require("../models/booking.model");
const {ObjectUtils, DateUtils} = require("../utils");

class BookingController {
    async create(req: Request, res: Response, next: NextFunction) {
        const {staffId, clientId, serviceId, dateTime} = req.body;

        ObjectUtils.checkValuesFormat(req, next);

        await Service.findById(serviceId)
            .then((data: IService) => {
                console.log(data)
                Booking.create({
                    createdAt: DateUtils.getCurrentDate(),
                    status: "PENDING",
                    price: data.price,
                    service: serviceId,
                    staff: staffId,
                    client: clientId,
                    serviceDuration: data.duration,
                    dateTime: dateTime
                }).then((data: IBooking) => {
                    res.send(data)
                }).catch((err) => {
                    return next(ApiError.internal(err.message))
                })
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        await Booking.find({})
            .populate({path: "service"})
            .populate({path: "staff"})
            .then((data: IBooking) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params

        ObjectUtils.checkValuesFormat(req, next);

        await Booking.find({_id: id})
            .populate({path: "service"})
            .populate({path: "staff"})
            .then((data: IBooking) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async closeBooking(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        ObjectUtils.checkValuesFormat(req, next);

        await Booking.findByIdAndUpdate(id, {status: "CLOSED"})
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

        await Booking.find({staff: staffId, status: "PENDING", dateTime: {"$regex": date, "$options": "i"}})
            .then((bookings: IBooking[]) => {
                let dateFromDb = bookings.map(item => item.dateTime.split("/")[1]);
                let timeAvailable = timeIntervals.filter(item => !dateFromDb.includes(item))
                res.send(timeAvailable)
            }).catch((err) => {
                return next(ApiError.internal(err.message));
            });
    }
}

module.exports = new BookingController()
