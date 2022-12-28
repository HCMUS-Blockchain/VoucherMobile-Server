const express = require("express");

const {
  createCampaign,
  getAllCampaigns,
  getOneCampaign,
  updateCampaign,
  deleteMultipleCampaign,
  deleteSingleCampaign,
} = require("../controllers/campaign");
const router = express.Router();

router.get("/", getAllCampaigns);
router.post("/", createCampaign);
router.get("/:id", getOneCampaign);
router.put("/", updateCampaign);
router.delete("/", deleteMultipleCampaign);
router.delete("/:id", deleteSingleCampaign);

module.exports = router;
