require('dotenv').config();

const session = require('express-session');
const mongoStore = require('connect-mongo');

const MONGODB_URL = process.env.MONGODB_URI;
const ADMIN_SESSION_SECRET = process.env.SESSION_ADMIN_SECRET;
const USER_SESSION_SECRET = process.env.SESSION_USER_SECRET;

adminSessionConfig = {
    secret: ADMIN_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
        mongoUrl: MONGODB_URL,
        collectionName: "sessions",
        ttl: 1000 * 60 * 60 * 24
    })
};


userSessionConfig = {
    secret: USER_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
        mongoUrl: MONGODB_URL,
        collectionName: "sessions",
        ttl: 1000 * 60 * 60 * 24
    })
};

module.exports = {
    adminSessionConfig,
    userSessionConfig
};
