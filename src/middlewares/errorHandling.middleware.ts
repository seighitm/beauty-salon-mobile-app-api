import {NextFunction, Request, Response} from "express";

const ApiError = require('../error/ApiError');

module.exports = function (err, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message})
    }
    return res.status(500).json({message: "Internal Server Error!"})
}

