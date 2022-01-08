import {NextFunction, Request, Response} from "express";
import {IUser} from "../types/user";
import {IMulterRequest} from "../types/request";
import {nanoid} from "nanoid";
import {IMailRequest} from "../types/payload/mailRequest";

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const {User, EmailValidation} = require("../models");
const {ObjectUtils, AppConstants} = require("../utils");
const {MailService} = require("../service")

const generateJwt = (payload) => {
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
            if (!email || !password || !username) {
                return next(ApiError.badRequest('Please enter all fields!'));
            }

            // Validation request fields
            ObjectUtils.checkValuesFormat(req, next);

            // Check if the user already exists with this email
            const candidate: IUser = await User.findOne({email})

            // Check if the user exists and the account is active
            if (candidate && candidate.isActive) {
                return next(ApiError.badRequest("Email is already taken!"))
            }

            // Encrypt the password
            const hashedPassword: string = await bcrypt.hash(password, 8);

            // By default, everyone is associated with "USER" role
            const userRole: string = role ? role : AppConstants.ROLE_USER

            let user: IUser;
            const secretKey = nanoid(4);

            if (candidate) {
                // If the user exists and is not active,
                // then we change the credentials, but not the email.
                user = await User.findByIdAndUpdate(candidate._id, {
                    password: hashedPassword,
                    role: userRole,
                    username,
                    numberPhone,
                    photo: photo ? photo : null,
                    isActive: false
                })
            } else {
                // If the user does not exist then he is created
                user = await User.create({
                    email,
                    password: hashedPassword,
                    role: userRole,
                    username,
                    numberPhone,
                    photo,
                    isActive: false
                })
            }

            if (user) {
                const createdAt = Date.now();
                const validationEmailToken = await EmailValidation.findOne({user: user._id})

                if (validationEmailToken) {
                    // If the user exists, and does not have the account activated,
                    // then we send a new secret code by email.
                    await EmailValidation.findOneAndUpdate({user: candidate._id}, {
                        createdAt,
                        secretKey
                    })
                } else {
                    // If the user does not exist
                    // then we create a new secret code and send it by email.
                    await EmailValidation.create({
                        createdAt,
                        secretKey,
                        user: user._id,
                        isValid: true
                    })
                }

                // Generate jwt code
                const token = generateJwt({
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    role: userRole,
                })

                const mailPayload: IMailRequest = {
                    to: user.email,
                    subject: "EMAIL VALIDATION",
                    secretKey
                }

                // Send email
                MailService(mailPayload)
                    .then(() => {
                        res.status(200).json({user, token: user.isActive ? token : ""});
                    }).catch(console.error);
            }
        } catch (e: unknown) {
            if (typeof e === "string") {
                return next(ApiError.internal(e));
            } else if (e instanceof Error) {
                return next(ApiError.internal(e.message));
            }
        }
    };

    async validateEmail(req: Request, res: Response, next: NextFunction) {
        const {userId, secretKey} = req.body

        try {
            // If the user exists but does not have a validated account,
            // then we validate it and delete the secret code related to this user
            // from the "email_validation" table.
            EmailValidation.findOneAndDelete({user: userId, secretKey: secretKey})
                .then(emailValidationToken => {
                    User.findByIdAndUpdate(userId, {
                        isActive: true
                    }).then(user =>
                        res.status(200).json({user, emailValidationToken})
                    )
                })
        } catch (e: unknown) {
            if (typeof e === "string") {
                return next(ApiError.internal(e));
            } else if (e instanceof Error) {
                return next(ApiError.internal(e.message));
            }
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const {email, password} = req.body

        try {
            if (!email || !password) {
                return next(ApiError.badRequest('Please enter all fields!'));
            }
            // Validation request fields
            ObjectUtils.checkValuesFormat(req, next);

            // Check if the user already exists with this email
            const user: IUser = await User.findOne({email})

            if (!user) {
                return next(ApiError.badRequest("User does not exist!"));
            }

            if (user && !user.isActive) {
                return next(ApiError.badRequest("Account is not validated!"));
            }

            const isMatch: boolean = await bcrypt.compare(password, user.password);

            // Check the current password with the password saved in the database.
            if (!isMatch)
                return next(ApiError.badRequest("Invalid credentials!"));

            // Generate jwt code
            const token: string = generateJwt({
                _id: user._id,
                role: user.role,
                email: user.email,
                username: user.username
            });
            res.status(200).json({user, token});
        } catch (e: unknown) {
            if (typeof e === "string") {
                return next(ApiError.internal(e));
            } else if (e instanceof Error) {
                return next(ApiError.internal(e.message));
            }
        }
    };
}

module.exports = new AuthController()
