const router = require('express').Router()
const {UserController} = require("../controllers");
import {param} from "express-validator";

router.put("/updateAccType/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], UserController.updateToStaffAccountType);

router.delete("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], UserController.deleteOne);

module.exports = router
