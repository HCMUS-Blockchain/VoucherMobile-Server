var express = require('express');
var router = express.Router();
const {createUser, userSignIn, signOut}=require('../controllers/user');
const {validateUserSignUp,userValidationResult,validateUserSignIn}=require('../middlewares/validation/user');
const {isAuth} = require("../middlewares/auth");
//add user
router.post('/create',validateUserSignUp,userValidationResult, createUser);
//signin
router.post('/signin',validateUserSignIn,userValidationResult, userSignIn);
//signout
router.post('/sign-out', isAuth, signOut);
router.post('/create-post',isAuth,(req, res) => {
    //create our post
    res.send('Welcome you are in secret route')
});
//get profile
router.get('/profile',isAuth,(req, res) => {
    if (!req.user) return res.status(400).send({'error': 'User not found'});
    return res.json({
        success: true,
        profile: req.user
    })
})
router.get('/',(req, res) => {
    res.send('Welcome to the API')
})
module.exports = router;
