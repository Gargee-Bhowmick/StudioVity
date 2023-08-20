const express = require("express");
const router = express.Router();
const create = require("../controllers/character/create")
const read = require("../controllers/character/read")
const update = require("../controllers/character/update")
const delte = require("../controllers/character/delete")
const verify = require("../authSession/middleware/authMiddleware")

router.post('/createCharacter',verify,create);
router.post('/readCharacter',verify,read);
router.post('/updateCharacter',verify,update);
router.post('/deleteCharacter',verify,delte);

module.exports=router
