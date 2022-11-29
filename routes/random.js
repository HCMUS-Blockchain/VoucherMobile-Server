const express = require('express');
const router = express.Router();
const {isAuth} = require("../middlewares/auth");
const {interaction} = require("../scripts/interaction");

router.get('/', isAuth, (req, res) => {
    try{
        interaction().then((x) => {
            res.send({success: true, message: x})
        });
    }catch (e){
        res.status(400).send({success: false, message: e.message});
    }
});
module.exports = router;
