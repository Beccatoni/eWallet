const express = require('express');
const authRoute = require('./authRoutes');
const allRoutes = express.Router();




allRoutes.use('authentication', authRoute);


module.exports = {
    allRoutes
}