import {NextFunction, Request} from "express";
import {Result, ValidationError, validationResult} from "express-validator";
const ApiError = require("../error/ApiError");

class ObjectUtils {
    checkValuesFormat (req: Request, next: NextFunction) {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
            let allErrors: string = ""
            errors.array().forEach((error) => allErrors += error.msg + "; ")
            return next(ApiError.badRequest(allErrors))
        }
    }
}

module.exports = new ObjectUtils()
