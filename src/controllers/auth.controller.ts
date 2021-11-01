import {NextFunction, Request, Response} from "express";
import {IUser} from "../types/user";
import {IMulterRequest} from "../types/request";
import {Result, ValidationError, validationResult} from "express-validator";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const User = require("../models/user.model");

const generateJwt = (payload: IUser) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET, {
            expiresIn: '24h'
        }
    )
}

class AuthController {
    async register(req: IMulterRequest, res: Response, next: NextFunction) {
        const {email, password, username, role, numberPhone}: IUser = req.body
        const photo = req.file?.filename

        try {
            if (!email || !password || !username)
                return next(ApiError.badRequest('Please enter all fields!'));

            const errors: Result<ValidationError> = validationResult(req);

            if (!errors.isEmpty()) {
                let allErrors: string = ""
                errors.array().forEach((error) => allErrors += error.msg + "; ")
                return next(ApiError.badRequest(allErrors))
            }

            const candidate: IUser = await User.findOne(
                {$or: [{email}, {numberPhone}]}
            ).catch((err) => {
                return next(ApiError.internal(err.message));
            });

            if (candidate)
                return next(ApiError.badRequest("User already exists [with email or numberPhone]!"))

            const hashedPassword: string = await bcrypt.hash(password, 8);

            const userRole: string = role ? role : 'USER'

            const result = await User.create({
                email,
                password: hashedPassword,
                role: userRole,
                username,
                numberPhone,
                photo
            }).catch((err) => {
                return next(ApiError.internal(err.message));
            });

            const token: string = generateJwt({
                _id: result._id,
                email: result.email,
                username: result.username,
                role: userRole,
            });
            res.status(200).json({user: result, token});
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    };

    async login(req: Request, res: Response, next: NextFunction) {
        const {email, password} = req.body

        try {
            if (!email || !password)
                return next(ApiError.badRequest('Please enter all fields!'));

            const errors: Result<ValidationError> = validationResult(req);

            if (!errors.isEmpty()) {
                let allErrors: string = ""
                errors.array().forEach((error) => allErrors += error.msg + "; ")
                return next(ApiError.badRequest(allErrors))
            }

            const user: IUser = await User.findOne({email})
                .catch((err) => {
                    return next(ApiError.internal(err.message));
                });

            if (!user)
                return next(ApiError.badRequest("User does not exist!"));

            const isMatch: boolean = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return next(ApiError.badRequest("Invalid credentials!"));

            const token: string = generateJwt({
                _id: user._id,
                role: user.role,
                email: user.email,
                username: user.username
            });
            res.status(200).json({user, token});
        } catch (e) {
            return next(ApiError.internal(e.message));
        }
    };

    async updateToStaffAccountType(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;

        await User.findByIdAndUpdate(id, {
            role: "ADMIN"
        }).then((data: IUser) => {
            res.send(data)
        }).catch((err) => {
            return next(ApiError.internal(err.message));
        });
    }
}

module.exports = new AuthController()
