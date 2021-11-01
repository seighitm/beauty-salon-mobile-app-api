const router = require('express').Router()
const {BookingController} = require("../controllers");

router.post("/", BookingController.create);
router.get("/", BookingController.getAll);
router.get("/:id", BookingController.getOne);

module.exports = router
export {}

