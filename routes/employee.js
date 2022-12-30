const express = require("express");
const { createEmployee, getAllEmployees } = require("../controllers/employee");
const { isAuth, isCounterpart } = require("../middlewares/auth");
const router = express.Router();

router.post("/", isAuth, isCounterpart, createEmployee);
router.get("/", isAuth, isCounterpart, getAllEmployees);

module.exports = router;
