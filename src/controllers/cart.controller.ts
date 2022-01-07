import {NextFunction, Request, Response} from "express";

const {User, Cart, Service} = require("../models");

const ApiError = require("../error/ApiError");
const {ObjectUtils, DateUtils, AppConstants} = require("../utils");

class CartController {
    async addService(req: Request, res: Response, next: NextFunction) {
        const {userId, serviceId, price, staffId, dateTime} = req.body;

        const userDb = await User.findById(userId).populate("cart")
        if (!userDb) {
            return next(ApiError.badRequest("User not exist!"))
        }

        const serviceDb = await Service.findById(serviceId)
        if (!serviceDb) {
            return next(ApiError.badRequest("Service not exist!"))
        }

        const cartService: any = userDb.cart.find((x: any) => x.service == serviceId && x.staff == staffId)

        if (cartService) {
            await Cart.findByIdAndUpdate(cartService._id,
                {$set: {counter: cartService.counter + 1}},
                {new: true, useFindAndModify: false}
            ).then((c) => {
                return res.send(userDb)
            })
        } else {
            const staffDB = await User.findById(userId)
            const serviceDB = await Service.findById(serviceId)

            await Cart.create(
                {
                    user: userId,
                    serviceName: serviceDB.name,
                    service: serviceId,
                    staffName: staffDB.username,
                    staff: staffId,
                    dateTime: dateTime,
                    price: price,
                    counter: 1,
                    createdAt: DateUtils.getCurrentDate(),
                    status: AppConstants.STATUS_PENDING,
                }
            ).then((c: any) => {
                User.findByIdAndUpdate(userId,
                    {$push: {cart: c._id}},
                    {new: true, useFindAndModify: false}
                ).populate("cart")
                    .catch(err => {
                        res.send(err)
                    })
                res.send(c)
            }).catch((err) => {
                return next(ApiError.internal(err.message))
            })
        }
    }

    async deleteService(req: Request, res: Response, next: NextFunction) {
        const {userId, serviceId} = req.body;

        const userDb = await User.findById(userId).populate("cart")
        if (!userDb) {
            return next(ApiError.badRequest("User not exist!"))
        }

        const serviceDb = await Service.findById(serviceId)
        if (!serviceDb) {
            return next(ApiError.badRequest("Service not exist!"))
        }

        const cartService: any = userDb.cart.find((x: any) => x.service == serviceId)

        if (cartService && cartService.counter <= 1) {
            await Cart.findByIdAndDelete(cartService._id)
                .then((c) => {
                    return res.send(userDb)
                })
        } else if (cartService) {
            await Cart.findByIdAndUpdate(cartService._id,
                {$set: {counter: cartService.counter - 1}},
                {new: true, useFindAndModify: false}
            ).then((c) => {
                return res.send(userDb)
            })
        } else {
            return res.send(userDb)
        }
    }
}

module.exports = new CartController()
