const router = require('express').Router()
const {FileUpload} = require("../middlewares");
const {CategoryController} = require("../controllers");

router.post("/", [FileUpload.single("photo")], CategoryController.create);
router.get("/", CategoryController.getAll);
router.get("/:id", CategoryController.getOne);
router.post("/addStaff", CategoryController.addStaffToCategoryServices);

module.exports = router
export {}

