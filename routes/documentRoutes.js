const express = require("express");
const router = express.Router();
const pdf = require('../controllers/document/pdf/generator')
const verify = require('../authSession/middleware/authMiddleware')
const excell = require('../controllers/document/excell/generator')
const csv = require('../controllers/document/csv/generator')
router.post("/pdf",verify,pdf)
router.post("/excell",verify,excell)
router.post("/csv",verify,csv)
module.exports = router
