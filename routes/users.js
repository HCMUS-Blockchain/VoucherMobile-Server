var express = require('express');
var router = express.Router();
const {createUser}=require('../controllers/user');
const {validateUserSignUp,userValidationResult}=require('../middlewares/user');
//add user
router.post('/create',validateUserSignUp,userValidationResult, createUser);

module.exports = router;
