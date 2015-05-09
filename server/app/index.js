'use strict';
var path = require('path');
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
module.exports = app;

var rootPath = path.join(__dirname, '../');
var indexPath = path.join(rootPath, './app/views/index.html');

// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
// require('./configure')(app);
app.use(cookieParser());

// Parse our POST and PUT bodies.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Pass our express application pipeline into the configuration
// function located at server/app/configure/index.js
require('./configure')(app);

// Routes that will be accessed via AJAX should be prepended with
// /api so they are isolated from our GET /* wildcard.
app.use('/api', require('./routes'));


/*
    This middleware will catch any URLs resembling a file extension
    for example: .js, .html, .css
    This allows for proper 404s instead of the wildcard '/*' catching
    URLs that bypass express.static because the given file does not exist.
*/
app.use(function (req, res, next) {

    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }

});

app.get('/*', function (req, res) {
    res.sendFile(indexPath);
});

// Error catching endware.
app.use(function (err, req, res) {
    // console.error(err);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});