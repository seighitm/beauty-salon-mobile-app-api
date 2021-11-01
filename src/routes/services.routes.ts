const router = require('express').Router()
const {ServiceController} = require("../controllers");

router.post("/", ServiceController.create);
router.get("/", ServiceController.getAll);
router.get("/:id", ServiceController.getOne);

module.exports = router
export {}

