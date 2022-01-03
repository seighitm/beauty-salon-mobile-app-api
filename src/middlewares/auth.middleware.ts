import {NextFunction, Response} from "express";
import {IAuthInfoRequest} from "../types/request";
import {IUser} from "../types/user";

const jwt = require('jsonwebtoken')
const ApiError = require("../error/ApiError");

module.exports = function (role: string) {
    return function (req: IAuthInfoRequest, res: Response, next: NextFunction) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token: any = req.headers.authorization?.split(' ')[1]
            if (!token) {
                return next(ApiError.unauthorized('No token, authorization denied!'))
            }

            const decoded: IUser = jwt.verify(token, process.env.JWT_SECRET)

            // // Role validation
            // if (decoded.role !== role) {
            //     return next(ApiError.forbidden("No access!"))
            // }

            req.user = decoded
            next()
        } catch (e: any) {
            res.status(401).send({message: e.message})
        }
    }
}

