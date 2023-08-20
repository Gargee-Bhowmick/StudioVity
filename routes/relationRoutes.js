const express = require("express");
const router = express.Router();
const create = require("../controllers/relation/create")
const read = require("../controllers/relation/read")
const update = require("../controllers/relation/update")
const delte = require("../controllers/relation/delete")
const verify = require("../authSession/middleware/authMiddleware")

router.post('/createRelation',verify,create);
router.post('/readRelation',verify,read);
router.post('/updateRelation',verify,update);
router.post('/deleteRelation',verify,delte);

module.exports=router
