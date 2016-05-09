var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('MagAZ.html', { title: 'AZMat' });
});

module.exports = router;
