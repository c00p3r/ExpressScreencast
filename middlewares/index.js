const express = require('express');
const routerBefore = express.Router();
const routerAfter = express.Router();

routerBefore.use(require('./loadAuthUser'));

module.exports.before = routerBefore;
module.exports.after = routerAfter;
