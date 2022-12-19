const express = require("express");
const {
  createCampaign,
  getAllCampaigns,
  getOneCampaign,
  updateCampaign,
  deleteMultipleCampaign,
  deleteSingleCampaign,
} = require("../controllers/campaign");
const { isAuth } = require("../middlewares/auth");
const router = express.Router();

router.post("/campaigns", createCampaign);
router.get("/campaigns", getAllCampaigns);
router.get("/campaigns/:id", getOneCampaign);
router.put("/campaigns", updateCampaign);
router.delete("/campaigns", deleteMultipleCampaign);
router.delete("/campaigns/:id", deleteSingleCampaign);

module.exports = router;
