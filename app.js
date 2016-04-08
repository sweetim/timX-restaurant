'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const ENV = process.env.NODE_ENV || 'development';
const config = require('./config/' + ENV);
const database = require('./setup/database');
const databaseSchemas = require('./models/restaurant');

database.connect(config);
database.registerSchemas(databaseSchemas);

const app = express();

const apiRoutes = require('./routes/api');

app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));
app.use(bodyParser.json());

app.use('/api', apiRoutes);

app.listen(config.port, () => {
    console.log(`Server started in port ${config.port}`);
});
