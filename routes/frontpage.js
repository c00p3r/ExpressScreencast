const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  // return res.json({
  //     data: {
  //       visits: req.session.visits = req.session.visits + 1 || 1
  //     }
  // });
  res.render('frontpage', { title: 'Express' });
});

module.exports = router;
