const {isAuth} = require("../middlewares/auth");
const express = require("express");
const {addNotification, getNotificationByUser, getNumberUnSeenByUser, getNumberUnSeenByListUser} = require("../controllers/notification");
const router = express.Router();


router.post('/add', isAuth, addNotification);
router.get('/user', isAuth, getNotificationByUser);
router.get('/numberunseen',isAuth, getNumberUnSeenByUser);
router.get('/numberunseen/list',isAuth,getNumberUnSeenByListUser )
module.exports = router;
