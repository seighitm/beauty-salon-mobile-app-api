const router = require('express').Router()
const {NotificationController} = require("../controllers");
import {body, param} from "express-validator";

router.post("/", [
    body("clientId").isMongoId().withMessage("Wrong CLIENT_ID format!"),
    body("staffId").isMongoId().withMessage("Wrong STAFF_ID format!"),
], NotificationController.create);
router.get("/", NotificationController.getAll);
router.get("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], NotificationController.getOne);

module.exports = router
export {}

