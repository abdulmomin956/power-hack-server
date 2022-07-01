const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

router.get('/', billController.loadBills);

module.exports = router;