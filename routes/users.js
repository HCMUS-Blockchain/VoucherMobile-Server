var express = require('express');
var router = express.Router();
const {createUser, userSignIn}=require('../controllers/user');
const {validateUserSignUp,userValidationResult,validateUserSignIn}=require('../middlewares/validation/user');
const {isAuth} = require("../middlewares/auth");
//add user
router.post('/create',validateUserSignUp,userValidationResult, createUser);
//signin
router.post('/signin',validateUserSignIn,userValidationResult, userSignIn);
router.post('/create-post',isAuth,(req, res) => {
    //create our post
    res.send('Welcome you are in secret route')
});
module.exports = router;
