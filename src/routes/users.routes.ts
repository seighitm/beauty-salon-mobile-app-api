const router = require('express').Router()
const {UserController} = require("../controllers");
import {param} from "express-validator";

router.put("/updateAccType/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], UserController.updateToStaffAccountType);

router.get("/getUsers", UserController.getUsers);

router.delete("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], UserController.deleteOne);

router.get("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], UserController.getOneUser);

module.exports = router
