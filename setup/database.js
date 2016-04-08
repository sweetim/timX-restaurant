'use strict';

const mongoose = require('mongoose');

function getDatabaseUrl(url, portNumber, name) {
    return `mongodb://${url}:${portNumber}/${name}`
}

function connect(config) {
    const databaseUrl = getDatabaseUrl(
        config.database.url,
        config.database.port,
        config.database.name);

    const databaseOptions = {
        auth: {
            authdb: config.database.name
        },
        user: config.database.user,
        pass: config.database.pass
    };

    mongoose.connect(databaseUrl, databaseOptions);

    mongoose.connection.on('connected', () => {
        console.log(`MongoDB connected at ${databaseUrl}`);
    });

    mongoose.connection.on('error', (err) => {
        console.error(err);
    });

    mongoose.connection.on('disconnected', () => {
        console.log(`MongoDB disconnected at ${databaseUrl}`);
    });
}

function registerSchemas(schemas) {
    for (let i = 0, length = schemas.length; i < length; i++) {
        mongoose.model(schemas[i].name, schemas[i].schema);
    }
}

module.exports = {
    connect: connect,
    registerSchemas: registerSchemas,
    getDatabaseUrl: getDatabaseUrl
}
