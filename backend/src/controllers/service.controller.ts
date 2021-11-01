import {NextFunction, Request, Response} from "express";
import {IService} from "../types/service";

const ApiError = require("../error/ApiError");
const Service = require("../models/service.model");
const Category = require("../models/category.model");

class ServiceController {
    async create(req: Request, res: Response, next: NextFunction) {
        console.log(req.body)

        const {name, description, price, duration, categoryId} = req.body

        await Service.create({name, description, price, duration})
            .then((serv: IService) => {
                Category.findByIdAndUpdate(categoryId,
                    {$push: {services: serv._id}},
                    {new: true, useFindAndModify: false})
                    .catch(err => {
                        res.send(err)
                    })
                res.send(serv)
            }).catch((err) => {
                return next(ApiError.internal(err.message))
            })
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        await Service.find({})
            .then((data: IService) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        await Service.find({_id: id})
            .then((data: IService) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }
}

module.exports = new ServiceController()
