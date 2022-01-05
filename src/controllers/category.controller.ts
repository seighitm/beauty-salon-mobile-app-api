import {NextFunction, Request, Response} from "express";
import {IMulterRequest} from "../types/request";
import {ICategory} from "../types/category";

const ApiError = require("../error/ApiError");
const {Category} = require("../models");
const {ObjectUtils, AppConstants} = require("../utils");

class CategoryController {
    async createFull(req: IMulterRequest, res: Response, next: NextFunction) {
        const filename = req.file?.filename

        if (!filename)
            return next(ApiError.badRequest("Error! No photo added!!"))

        let updatePayload: {
            name?: string,
            photo?: string,
            staffs?: string[],
            services?: string[]
        } = {
            name: req.body.name,
            photo: filename
        };

        const categoryDb = await Category.find({name: updatePayload.name})

        if(categoryDb)
            return next(ApiError.badRequest("Error! Category with this name already exist!!"))

        if (req.body.staffs != [])
            updatePayload.staffs = req.body.staffs as string[];

        if (req.body.services != [])
            updatePayload.services = req.body.services as string[];

        await Category.create({...updatePayload})
            .then((data: ICategory) => {
                res.status(200).send(data)
            }).catch((err) => {
                return next(ApiError.badRequest(err.message));
            });
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
