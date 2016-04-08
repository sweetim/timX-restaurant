'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Busboy = require('busboy');
const request = require('request');
const uuid = require('node-uuid');

const router = express.Router();
const Restaurant = mongoose.model('Restaurant');
const RestaurantImage = mongoose.model('RestaurantImage');

router.get('/', (req, res, next) => {
    Restaurant.find().then((restaurants) => {
        res.json({
            restaurants: restaurants
        });
    }).catch((err) => {
        return next(err);
    })
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;

    Restaurant.findOne({ _id: id}).then((restaurant) => {
        res.json(restaurant);
    }).catch((err) => {
        return next(err);
    });
});

router.put('/:id', (req, res, next) => {
});

router.post('/', (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const location = [
        req.body.location.lng,
        req.body.location.lat
    ];

    const restaurant = new Restaurant({
        name: name,
        description: description,
        location: {
            coordinates: location
        }
    });

    restaurant.save().then((model) => {
        res.json({
            id: model.id,
            name: name
        });
    }).catch((err) => {
        return next(err);
    });
});

router.post('/image/:id', (req, res, next) => {
    const restaurantId = req.params.id;

    const busboy = new Busboy({ headers: req.headers });

    const imageId = uuid.v1();
    const imageName = `${restaurantId}/${imageId}`

    busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
        console.log(fieldName)
        const formData = {
            image: file,
            name: imageName
        }

        request.post({
            encoding: null,
            url: 'http://localhost:8080/api/image',
            formData: formData
        }, (err, httpRes, body) => {
            if (err) return next(err);

            console.log(body);
        });

        // res.send(formData)
    });

    busboy.on('finish', () => {
        console.log('Done parsing form!');
        res.sendStatus(200);
    });

    req.pipe(busboy);
});

module.exports = router;
