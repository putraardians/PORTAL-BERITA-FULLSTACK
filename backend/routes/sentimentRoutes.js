const express = require('express');
const router = express.Router();
const sentimentController = require('../controllers/sentimentController');

router.post('/sentiment', sentimentController.analyzeSentiment);

module.exports = router;
