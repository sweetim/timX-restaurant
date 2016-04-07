'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const ENV = process.env.NODE_ENV || 'development';
const config = require('./config/' + ENV);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/restaurant', (req, res) => {
    res.json({
        name: 'Regal',
        description: 'An Italian pasta restaurant',
        location: {
            lng: ''
            lat: ''
        },
        images: [
            ''
        ]
    })
});

app.post('/restaurant', (req, res) => {

});


app.listen(config.port, () => {
    console.log(`Server started in port ${config.port}`);
});
