import {NextFunction, Request, Response} from "express";
import {IBooking} from "../types/booking";
import {IService} from "../types/service";

const DateUtils = require("../utils/dateUtils")
const ApiError = require("../error/ApiError");
const Service = require("../models/service.model");
const Booking = require("../models/booking.model");

class BookingController {
    async create(req: Request, res: Response, next: NextFunction) {
        const {userId, serviceId} = req.body;

        await Service.findById(serviceId)
            .then((data: IService) => {
                Booking.create({
                    dateTime: DateUtils.getCurrentDate,
                    status: "PENDING",
                    price: data.price,
                    service: serviceId,
                    staff: userId
                }).then((data: IBooking) => {
                    res.send(data)
                }).catch((err) => {
                    return next(ApiError.internal(err.message))
                })
            })
            .catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        await Booking.find({})
            .populate({path: "service"})
            .populate({path: "staff"})
            .then((data: IBooking) => {
                res.send(data);
            })
            .catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        await Booking.find({_id: id})
            .populate({path: "service"})
            .populate({path: "staff"})
            .then((data: IBooking) => {
                res.send(data);
            })
            .catch(err => {
                return next(ApiError.internal(err.message))
            });
    }
}

module.exports = new BookingController()
