import {NextFunction, Request, Response} from "express";
import {IMulterRequest} from "../types/request";
import {ICategory} from "../types/category";

const ApiError = require("../error/ApiError");
const {Category} = require("../models");
const {ObjectUtils, AppConstants} = require("../utils");

class CategoryController {
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
