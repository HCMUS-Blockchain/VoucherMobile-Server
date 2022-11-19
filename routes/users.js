var express = require('express');
var router = express.Router();
const {createUser, userSignIn, signOut, uploadAvatar} = require('../controllers/user');
const {validateUserSignUp, userValidationResult, validateUserSignIn} = require('../middlewares/validation/user');
const {isAuth} = require("../middlewares/auth");
//add user
router.post('/create', validateUserSignUp, userValidationResult, createUser);
//signin
router.post('/signin', validateUserSignIn, userValidationResult, userSignIn);
//signout
router.get('/signout', isAuth, signOut);
router.post('/create-post', isAuth, (req, res) => {
    //create our post
    res.send('Welcome you are in secret route')
});
//get profile
router.get('/profile', isAuth, (req, res) => {
    if (!req.user) return res.status(400).send({'error': 'User not found'});
    return res.json({
        success: true,
        profile: req.user
    })
})
const multer = require('multer');
const storage = multer.diskStorage({})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);

    } else {
        cb(null, false);
    }
}
const uploads = multer({storage, fileFilter})
//avatar
router.post('/upload-profile', isAuth, uploads.single('profile'),uploadAvatar)
router.get('/', (req, res) => {
    res.send('Welcome to the API')
})
module.exports = router;
