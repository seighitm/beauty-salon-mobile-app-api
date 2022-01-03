const router = require('express').Router()
const {NotificationController} = require("../controllers");
import {body, param} from "express-validator";

router.get("/mynotifications", NotificationController.getMyNotifications);

router.post("/", [
    body("clientId").isMongoId().withMessage("Wrong CLIENT_ID format!"),
    body("staffId").isMongoId().withMessage("Wrong STAFF_ID format!"),
], NotificationController.create);

router.get("/", NotificationController.getAll);

router.get("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], NotificationController.getOne);

router.delete("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], NotificationController.deleteOne);

module.exports = router
