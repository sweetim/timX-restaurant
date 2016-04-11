'use strict';

const express = require('express');
const router = express.Router();
const restaurantAPI = require('./restaurant');

router.use('/restaurant', enableCors, restaurantAPI);

function enableCors(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');

    next();
}

module.exports = router;
