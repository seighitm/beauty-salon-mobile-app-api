import {NextFunction, Request, Response} from "express";
import {IService} from "../types/service";
import {ICategory} from "../types/category";

const ApiError = require("../error/ApiError");
const {Service, Category} = require("../models");
const {ObjectUtils} = require("../utils");

class ServiceController {
    async create(req: Request, res: Response, next: NextFunction) {
        const {name, description, price, duration, categoryId} = req.body

        ObjectUtils.checkValuesFormat(req, next);

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

    async updateService(req: Request, res: Response, next: NextFunction) {
        let updatePayload: {
            name?: string,
            description?: string,
            price?: number,
            duration?: number
        } = {};

        if (req.body.name)
            updatePayload.name = req.body.name as string;

        if (req.body.description)
            updatePayload.description = req.body.description as string;

        if (req.body.price)
            updatePayload.price = req.body.price as number;

        if (req.body.duration)
            updatePayload.duration = req.body.duration as number;

        await Service.findByIdAndUpdate(req.body.serviceId,
            {$set: {...updatePayload}},
        ).then((data: ICategory) => {
            res.send(data);
        }).catch(err => {
            return next(ApiError.badRequest(err.message));
        });
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

        ObjectUtils.checkValuesFormat(req, next);

        await Service.find({_id: id})
            .then((data: IService) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.internal(err.message))
            });
    }

    async deleteOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        ObjectUtils.checkValuesFormat(req, next);

        Service.findByIdAndDelete(id)
            .then((data: IService) => {
                res.send(data);
            }).catch(err => {
            return next(ApiError.badRequest(err.message));
        });
    }
}

module.exports = new ServiceController()
