'use strict';

const mongoose = require('mongoose');

const RestaurantImageSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const RestuarantSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number]
    },
    date: {
        type: Date,
        default: Date.now
    },
    images: [RestaurantImageSchema]
});

module.exports = [
    { name: 'RestaurantImage', schema: RestaurantImageSchema },
    { name: 'Restaurant', schema: RestuarantSchema },
];
