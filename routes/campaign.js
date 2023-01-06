const express = require("express");

const {
  createCampaign,
  getAllCampaigns,
  getOneCampaign,
  updateCampaign,
  deleteMultipleCampaign,
  deleteSingleCampaign,
} = require("../controllers/campaign");
const { isAuth, isCounterpart } = require("../middlewares/auth");
const router = express.Router();

router.get("/", isAuth, isCounterpart, getAllCampaigns);
router.post("/", isAuth, createCampaign);
router.get("/:id", isAuth, isCounterpart, getOneCampaign);
router.put("/", isAuth, isCounterpart, updateCampaign);
router.delete("/", isAuth, isCounterpart, deleteMultipleCampaign);
router.delete("/:id", isAuth, isCounterpart, deleteSingleCampaign);

module.exports = router;
