const express = require('express');
const router = express.Router();
const addController = require('../controllers/addController');

router.post('/', addController.addHandle);


module.exports = router;