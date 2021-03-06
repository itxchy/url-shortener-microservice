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

if (process.env.NODE_ENV === 'production') {
    mongoose.connect(process.env.MONGOLAB_URI);
} else {
    mongoose.connect('mongodb://localhost:27017/local');
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose encountered an error.'));
db.once('open', function() {
    console.log('mongodb connected!');
});

/**
 * Handle Requests
 */

app.use(compression());
app.use('/', express.static(__dirname + '/public'));

let url;
let errorResponse = { error: url + " is not valid."};

app.use('/*', function redirectHandler(req, res, next) {

    url = req.params[0];

    // ignore requests for /favicon.ico
    if (url === 'favicon.ico') {
        return;
    }
    
    let validUrl = validator.isURL(url, { require_protocol: true } );

    // if the param is not a URL, assume it's a short link and redirect 
    // to its matching original URL. If it's not a valid short link, return a 404.
    if (!validUrl) {
        return redirectToOriginalUrl(res, errorResponse);
    }

    next();

}, function newShortUrlHandler(req, res, next) {

    let generatedID = shortid.generate();
    let shortendURL = `${req.hostname}/${generatedID}`;

    saveNewShortUrl(generatedID, shortendURL, res, function (newShortUrl) {
        return res.json(newShortUrl);
    });

});

function redirectToOriginalUrl(res, errorResponse) {

    return ShortUrl.findOne({'id': url}, 'original_url', (err, shortUrl) => {

        if (err) {
            return res.status(500).send({
                error: "An error occured: " + err
            }); 

        } else if (shortUrl) {
            return res.redirect(shortUrl.original_url);

        } else {
            return res.status(404).send({ 
                error: url + " does not match any saved links, and is not a valid URL. URL's must include a protocol (i.e. https)."
            });
        }
    });
}

function saveNewShortUrl(generatedID, shortenedURL, res, callback) {

    let newShortUrl = new ShortUrl({
        id: generatedID,
        original_url: url,
        short_url: shortenedURL
    });

    return newShortUrl.save( (err, newShortUrl) => {

        if (err) {
            return res.status(500).send(err);
        }

        return callback(newShortUrl);
    });
}

const server = app.listen(process.env.PORT || 4000, () => {
    console.log('Express app listening!');
});

module.exports = server;