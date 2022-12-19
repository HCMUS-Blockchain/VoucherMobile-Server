var express = require('express');
var router = express.Router();
const path = require('path');
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(path.join(__dirname+'/test.html'))
  res.sendFile(path.join(__dirname+'/test.html'));
});

module.exports = router;
