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

        // if the passed param is invalid, check if it's a short URL id.
        // if so, then redirect to the original URL. if not, then return an error.
        ShortUrl.findOne({'id': url}, 'original_url', function(err, shortUrl) {
            return res.redirect(shortUrl.original_url); 
        })

        return res.json(errorResponse);
    }

    var generatedID = shortid.generate();
    var shortendURL = `${req.hostname}/${generatedID}`

    var newShortUrl = new ShortUrl({
        id: generatedID,
        original_url: url,
        short_url: shortenedURL
    });

    newShortUrl.save(function(err) {
        if (err) throw err;
        console.log('New short URL saved!');
    });

});

var server = app.listen(process.env.PORT || 4000, () => {
    console.log('Express app listening!');
});

module.exports = server;