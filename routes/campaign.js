const express = require('express');
const {createCampaign} = require("../controllers/campaign");
const router = express.Router();

router.post('/create', createCampaign);
module.exports = router;
