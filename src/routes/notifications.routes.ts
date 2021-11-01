const router = require('express').Router()
const {NotificationController} = require("../controllers");

router.post("/", NotificationController.create);
router.get("/", NotificationController.getAll);
router.get("/:id", NotificationController.getOne);

module.exports = router
export {}

