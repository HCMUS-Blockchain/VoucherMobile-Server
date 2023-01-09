const express = require("express");

const {
  createCampaign,
  getAllCampaigns,
  getOneCampaign,
  updateCampaign,
  deleteMultipleCampaign,
  deleteSingleCampaign, getPopularBranch, getNewestCampaign, addFavorite, deleteFavorite,
} = require("../controllers/campaign");
const { isAuth, isCounterpart } = require("../middlewares/auth");
const router = express.Router();

router.get("/", isAuth, isCounterpart, getAllCampaigns);
router.post("/", isAuth, createCampaign);
router.get("/:id", isAuth, isCounterpart, getOneCampaign);
router.put("/", isAuth, isCounterpart, updateCampaign);
router.delete("/", isAuth, isCounterpart, deleteMultipleCampaign);
router.delete("/:id", isAuth, isCounterpart, deleteSingleCampaign);
router.get("/v1/newest", isAuth, getNewestCampaign);
router.get("/v1/popular-branch",isAuth,getPopularBranch);
router.post("/v1/favorite",isAuth,addFavorite);
router.post("/v1/favorite/delete",isAuth,deleteFavorite);
module.exports = router;
