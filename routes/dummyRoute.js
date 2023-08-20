const express = require("express");
const router = express.Router();
const dummy = require('../controllers/dummy');

router.get('/dummy',dummy);

module.exports=router
