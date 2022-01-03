const router = require('express').Router()
const {ServiceController} = require("../controllers");
import {body, param} from "express-validator";

router.post("/", [
    body("categoryId").isMongoId().withMessage("Wrong CATEGORY_ID format!"),
    body("price")
        .isDecimal().withMessage("The duration must be of type Number!")
        .isNumeric().isLength({min: 0, max: 3}).withMessage("The price is too high!"),
    body('description').isLength({min: 3, max: 250}).withMessage("Error! Exceeded DESCRIPTION length!"),
    body('name').isLength({min: 3, max: 50}).withMessage("Error! Exceeded NAME length!"),
    body('duration')
        .isDecimal().withMessage("The duration must be of type Number!")
        .isNumeric().isLength({min: 0, max: 3}).withMessage("Duration is too long!"),
], ServiceController.create);

router.get("/", ServiceController.getAll);

router.get("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], ServiceController.getOne);

router.delete("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], ServiceController.deleteOne);

module.exports = router
