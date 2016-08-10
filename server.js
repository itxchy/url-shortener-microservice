const mongoose    = require('mongoose');
const ShortUrl    = require('./models/shorturl');

const validator   = require('validator');
const shortid     = require('shortid');
const compression = require('compression');
const express     = require('express');
const app         = express();

/**
 * Initiallize MongoDB
 */

mongoose.connect('mongodb://localhost:27017/local');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose encountered an error.'));
db.once('open', function() {
    console.log('mongodb connected!')
});

/**
 * Handle Requests
 */

app.use(compression());

app.use('/:url', (req, res) => {

    // ignore requests for /favicon.ico
    if (req.url === '/favicon.ico') {
        return;
    }

    var url = req.params.url;
    var validUrl = validator.isUrl(url);
    var errorResponse = { error: url + " is not valid."};

    if (!validUrl) {

        // TODO check if passed param is an ID that matches a valid short URL in tge database
            // if so, return it

        return res.json(errorResponse);
    }

    var generatedID = shortid.generate();
    var shortendURL = `${req.hostname}/${generatedID}`

    var newShortUrl = new ShortUrl({
        id: generatedID,
        original_url: url,
        short_url: shortenedURL
    });

    // TODO create a new database entry with the url and hash, and save it to the database

});

var server = app.listen(process.env.PORT || 4000, () => {
    console.log('Express app listening!');
});

module.exports = server;