import {body} from "express-validator";

const router = require('express').Router()
const {AuthController} = require("../controllers");
const {FileUpload} = require("../middlewares");

router.post("/login", [
        body('email').isEmail().withMessage('Invalid email format!'),
        body('password').isLength({min: 3, max: 32}).withMessage("Incorrect username!"),
    ],
    AuthController.login);

router.post("/register", [
        [FileUpload.single("photo")],
        body('email').isEmail().withMessage('Invalid email format!'),
        body('password').isLength({min: 3, max: 32}).withMessage("Incorrect username!"),
        body('username').isLength({min: 3, max: 32}).withMessage("Incorrect username!"),
    ],
    AuthController.register);

router.post("/updateToStaffAcc/:id", AuthController.updateToStaffAccountType);

module.exports = router
