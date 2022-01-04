const router = require('express').Router()
const {CartController} = require("../controllers");

router.post("/addService", CartController.addService);
router.delete("/deleteService", CartController.deleteService);

module.exports = router
export {}
