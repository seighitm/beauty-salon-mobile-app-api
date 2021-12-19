const router = require('express').Router()
const {FileUpload, AuthMiddleware} = require("../middlewares");
const {CategoryController} = require("../controllers");
import {body, param} from "express-validator";

router.post("/", [FileUpload.single("photo")], CategoryController.create);

router.get("/", CategoryController.getAll);

router.get("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], CategoryController.getOne);

router.put("/addStaff", [
    body("categoryId").isMongoId().withMessage("Wrong CATEGORY_ID format!"),
    body("staffId").isMongoId().withMessage("Wrong STAFF_ID format!")
], CategoryController.addStaffToCategoryServices);

router.delete("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], CategoryController.deleteOne)

module.exports = router
export {}

