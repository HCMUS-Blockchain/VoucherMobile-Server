const express = require('express');
const {createCampaign} = require("../controllers/campaign");
const {isAuth} = require("../middlewares/auth");
const router = express.Router();

router.post('/create', isAuth, createCampaign);
module.exports = router;
