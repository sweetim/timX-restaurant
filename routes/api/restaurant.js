'use strict';

const express = require('express');
const mongoose = require('mongoose');
const multer  = require('multer')({
    inMemory: true,
    fileSize: 5 * 1024 * 1024,
});

const Promise = require('bluebird');
const request = require('request');
Promise.promisifyAll(require('request'));

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
    const id = req.params.id;

    const newModel = {};

    for (let prop in req.body) {
        newModel[prop] = req.body[prop];
    }

    Restaurant.findByIdAndUpdate(
        id,
        newModel,
        { new: true }
    ).then((model) => {
        res.json(model);
    }).catch((err) => {
        return next(err);
    });
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;

    Restaurant.findByIdAndRemove(id).then(() => {
        res.json({
            id: id
        });
    }).catch((err) => {
        return next(err);
    })
});

router.post('/', (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const location = req.body.location;

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

router.post('/image/:id', multer.single('image'), (req, res, next) => {
    const restaurantId = req.params.id;
    const imageId = uuid.v1();
    const imageName = `${restaurantId}/${imageId}`

    const formData = {
        image: {
            value: req.file.buffer,
            options: {
                filename: req.file.originalname
            }
        },
        contentType: req.file.mimetype,
        name: imageName
    };

    request.postAsync({
        url: 'http://localhost:8080/api/image',
        formData: formData
    }).then((data) => {
        const body = JSON.parse(data.body);

        const restaurantImage = new RestaurantImage({
            id: body.id,
            url: body.url,
            contentType: body.mimetype
        });

        return Restaurant.findByIdAndUpdate(
            restaurantId,
            {
                $push: {
                    'images': restaurantImage
                }
            },
            {
                new: true
            }
        );
    }).then((model) => {
        res.json(model);
    }).catch((err) => {
        return next(err);
    });
});

router.delete('/image/:id', (req, res, next) => {
    const restaurantId = req.params.id;
    const imageId = req.body.id;

    request.delAsync({
        url: `http://localhost:8080/api/image/${imageId}`
    }).then((output) => {
        return Restaurant.findByIdAndUpdate(
            restaurantId,
            {
                $pull: {
                    'images': {
                        id: imageId
                    }
                }
            },
            {
                new: true
            }
        );
    }).then((model) => {
        res.json({
            restaurantId: restaurantId,
            imageId: imageId
        });
    }).catch((err) => {
        return next(err);
    });
});

module.exports = router;
