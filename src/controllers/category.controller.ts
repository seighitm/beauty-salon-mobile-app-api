import {NextFunction, Request, Response} from "express";
import {IMulterRequest} from "../types/request";
import {ICategory} from "../types/category";
import {IService} from "../types/service";

const ApiError = require("../error/ApiError");
const {Category, Service} = require("../models");
const {ObjectUtils, AppConstants} = require("../utils");

class CategoryController {
    async createFull(req: IMulterRequest, res: Response, next: NextFunction) {
        const filename = req.file?.filename

        if (!filename)
            return next(ApiError.badRequest("Error! No photo added!!"))

        let updatePayload: {
            name?: string,
            photo?: string,
            staffs?: object[],
            services?: any
        } = {
            name: req.body.name,
            photo: filename
        };

        const candidateDb = await Category.findOne({name: updatePayload.name})

        if (candidateDb)
            return next(ApiError.badRequest("Error! Category with this name already exist!!"))

        if (req.body.staffs != [])
            updatePayload.staffs = req.body.staffs as object[];

        if (JSON.parse(req.body.services) != [])
            updatePayload.services = JSON.parse(req.body.services) as object[];

        const categoryDb = await Category.create({name: updatePayload.name, photo: filename})

        let tempDb: any = [];
        for (let i = 0; i < updatePayload.services.length; i++) {
            updatePayload.services[i].categoryId = categoryDb._id
            tempDb[i] = await Service.create({...updatePayload.services[i]})
        }

        await Category.findByIdAndUpdate(categoryDb._id,
            {$set: {services: tempDb, staffs: updatePayload.staffs}},
            {new: true, useFindAndModify: false})
            .then((data: ICategory) => {
                res.status(200).send(data)
            }).catch((err) => {
                return next(ApiError.badRequest(err.message));
            });
    }

    async updateFull(req: IMulterRequest, res: Response, next: NextFunction) {
        const {id} = req.params;
        const {name, staffs} = req.body;

        let updatePayload: {
            name?: string,
            photo?: string,
            staffs?: string[]
        } = {
            name: name,
            staffs: staffs
        };

        if (req.file && req.file.filename)
            updatePayload.photo = req.file.filename as string;

        const candidateDb = await Category.findByIdAndUpdate(id, {$set: {...updatePayload}})

        // if (candidateDb.name != name || candidateDb)
        //     return next(ApiError.badRequest("Error! Category with this name already exist!!"))

        // if (req.body.deletServices)
        //     await Service.deleteMany({_id: {$in: req.body.deletServices}})

        if (req.body.services) {
            const services = JSON.parse(req.body.services)
            for (let i = 0; i < services.length; i++) {
                if (services[i]._id) {
                    await Service.findByIdAndUpdate(services[i]._id, {$set: {...services[i]}})
                        .catch(err => {
                            res.send(err)
                        })
                } else {
                    await Service.create({
                        name: services[i].name,
                        description: services[i].description,
                        price: services[i].price,
                        duration: services[i].duration
                    }).then((serv: IService) => {
                        Category.findByIdAndUpdate(id,
                            {$push: {services: serv._id}},
                            {new: true, useFindAndModify: false})
                            .catch(err => {
                                res.send(err)
                            })
                    }).catch((err) => {
                        return next(ApiError.internal(err.message))
                    })
                }
            }
        }

        const updatedCategory = await Category.findById(id).populate("services staffs")
        res.send(updatedCategory)
    }

    async create(req: IMulterRequest, res: Response, next: NextFunction) {
        const {name} = req.body
        const filename = req.file?.filename

        if (!name)
            return next(ApiError.badRequest("Error! Content can not be empty!"))

        if (!filename)
            return next(ApiError.badRequest("Error! No photo added!!"))

        await Category.create({name, photo: filename})
            .then((data: ICategory) => {
                res.status(200).send(data)
            }).catch((err) => {
                return next(ApiError.badRequest(err.message));
            });
    }


    async updateCategory(req: IMulterRequest, res: Response, next: NextFunction) {
        const {categoryId, name} = req.body;

        const filename = req.file?.filename

        Category.findByIdAndUpdate(categoryId,
            {$set: filename ? {name: name, photo: filename} : {name: name}},
            {new: true, useFindAndModify: false})
            .then((data: ICategory) => {
                res.send(data);
            }).catch(err => {
            return next(ApiError.badRequest(err.message));
        });
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        await Category.find({})
            .populate({path: AppConstants.MULTIPLE_SERVICES})
            .populate({path: AppConstants.MULTIPLE_STAFFS})
            .then((data: ICategory) => {
                res.status(200).send(data);
            }).catch(err => {
                return next(ApiError.badRequest(err.message));
            });
    }

    async getAllStaffOfCategory(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        await Category.findById(id)
            .populate({path: AppConstants.MULTIPLE_SERVICES})
            .populate({path: AppConstants.MULTIPLE_STAFFS})
            .then((data: ICategory) => {
                res.status(200).send(data.staffs);
            }).catch(err => {
                return next(ApiError.badRequest(err.message));
            });
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        ObjectUtils.checkValuesFormat(req, next);

        await Category.find({_id: id})
            .populate({path: AppConstants.MULTIPLE_SERVICES})
            .populate({path: AppConstants.MULTIPLE_STAFFS})
            .then((data: ICategory) => {
                res.send(data);
            }).catch(err => {
                return next(ApiError.badRequest(err.message));
            });
    }

    async addStaffToCategoryServices(req: Request, res: Response, next: NextFunction) {
        const {categoryId, staffId} = req.body;

        ObjectUtils.checkValuesFormat(req, next);

        Category.findByIdAndUpdate(categoryId,
            {$push: {staffs: staffId}},
            {new: true, useFindAndModify: false})
            .then((data: ICategory) => {
                res.send(data);
            }).catch(err => {
            return next(ApiError.badRequest(err.message));
        });
    }

    async deleteStaffToCategoryServices(req: Request, res: Response, next: NextFunction) {
        const {categoryId, staffId} = req.body;

        Category.findByIdAndUpdate(categoryId,
            {$pull: {staffs: staffId}},
            {new: true, useFindAndModify: false})
            .then((data: ICategory) => {
                res.send(data);
            }).catch(err => {
            return next(ApiError.badRequest(err.message));
        });
    }

    async deleteOne(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        ObjectUtils.checkValuesFormat(req, next);

        Category.findByIdAndDelete(id)
            .then((data: ICategory) => {
                res.send(data);
            }).catch(err => {
            return next(ApiError.badRequest(err.message));
        });
    }
}

module.exports = new CategoryController()
