const express = require("express");
const router = express.Router();
const fetchCharacter = require('../controllers/fetch/fetchCharacters')
const fetchCharacterRelations = require('../controllers/fetch/fetchCR')
const verify = require("../authSession/middleware/authMiddleware")

router.post('/fetchCharacter',verify,fetchCharacter);
router.post('/fetchCharacterRelations',verify,fetchCharacterRelations);

module.exports=router
