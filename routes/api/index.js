'use strict';

const express = require('express');
const router = express.Router();
const restaurantAPI = require('./restaurant');

router.use('/restaurant', restaurantAPI);

module.exports = router;
