const router = require('express').Router()
const {BookingController} = require("../controllers");
import {body, param} from "express-validator";

router.post("/", [
    body("staffId").isMongoId().withMessage("Wrong STAFF_ID format!"),
    body("clientId").isMongoId().withMessage("Wrong CLIENT_ID format!"),
    body("serviceId").isMongoId().withMessage("Wrong SERVICE_ID format!")
], BookingController.create);

router.get("/", BookingController.getAll);

router.get("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], BookingController.getOne)

router.put("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], BookingController.closeBooking)

module.exports = router
export {}

