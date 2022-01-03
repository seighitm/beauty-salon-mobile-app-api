const router = require('express').Router()
const {AuthController} = require("../controllers");
const {FileUploadMiddleware} = require("../middlewares");
import {body} from "express-validator";

router.post("/login", [
    body('email').isEmail().withMessage('Invalid EAMIL format!'),
    body('password').isLength({min: 3, max: 32}).withMessage("Error! Exceeded PASSWORD length!"),
], AuthController.login);

router.post("/register", [
    [FileUploadMiddleware.single("photo")],
    body('email').isEmail().withMessage('Invalid email format!'),
    body('password').isLength({min: 3, max: 32}).withMessage("Error! Exceeded PASSWORD length!"),
    body('username').isLength({min: 3, max: 32}).withMessage("Error! Exceeded USERNAME length!"),
], AuthController.register);

router.put("/validateemail", AuthController.validateEmail);

module.exports = router
