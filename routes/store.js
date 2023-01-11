const express = require("express");
const {
  createStore,
  getAllStores,
  updateStore,
  getStore,
  deteleStore, getStoreNearyBy,
} = require("../controllers/store");
const { isAuth, isCounterpart } = require("../middlewares/auth");
const router = express.Router();

router.get("/:id", isAuth, isCounterpart, getStore);
router.get("/", isAuth, isCounterpart, getAllStores);
router.post("/", isAuth, isCounterpart, createStore);
router.put("/", isAuth, isCounterpart, updateStore);
router.delete("/:id", isAuth, isCounterpart, deteleStore);
router.post('/find/store-neary-by',isAuth,getStoreNearyBy)
module.exports = router;
