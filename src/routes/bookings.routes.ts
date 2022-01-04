const router = require('express').Router()
const {BookingController} = require("../controllers");
import {body, param} from "express-validator";

router.get("/mybookings", BookingController.getMyBookingFilter)

router.get("/checkAvailability", [
    body("staffId").isMongoId().withMessage("Wrong STAFF_ID format!"),
    body("date").isDate().withMessage("Wrong DATE format!")
], BookingController.checkAvailability)

router.post("/", [
    body("clientId").isMongoId().withMessage("Wrong CLIENT_ID format!"),
], BookingController.create);

router.get("/", BookingController.getAll);

router.get("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], BookingController.getOne)

router.put("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], BookingController.closeBooking)

router.delete("/:id", [
    param("id").isMongoId().withMessage("Wrong ID format!")
], BookingController.deleteOne)


module.exports = router
