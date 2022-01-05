const router = require('express').Router()
const {FileUploadMiddleware} = require("../middlewares");
const {CategoryController} = require("../controllers");
import {body, param} from "express-validator";

router.post("/createFull", [FileUploadMiddleware.single("photo")], CategoryController.createFull);
router.post("/", [FileUploadMiddleware.single("photo")], CategoryController.create);

router.get("/", CategoryController.getAll);

router.get("/allStaffs/:id", CategoryController.getAllStaffOfCategory);

router.get("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], CategoryController.getOne);

router.delete("/deleteStaff", CategoryController.deleteStaffToCategoryServices)

router.put("/addStaff", [
    body("categoryId").isMongoId().withMessage("Wrong CATEGORY_ID format!"),
    body("staffId").isMongoId().withMessage("Wrong STAFF_ID format!")
], CategoryController.addStaffToCategoryServices);

router.delete("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], CategoryController.deleteOne)


router.put("/", [FileUploadMiddleware.single("photo")], CategoryController.updateCategory);

module.exports = router
