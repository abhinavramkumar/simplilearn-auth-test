const express = require('express');
const authRoute = require('./auth');

const Router = express.Router();

Router.use('/auth', authRoute);

module.exports = Router;