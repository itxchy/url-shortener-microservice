const validator   = require('validator');
const compression = require('compression');
const mongoose    = require('mongoose');
const express     = require('express');
const app         = express();

/**
 * Initiallize MongoDB
 */

var Schema = mongoose.Schema;

var urlSchema = new Schema({
    id: String,
    original_url: String,
    short_url: String
});

var ShortUrl = mongoose.model('ShortUrl', urlSchema);

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

    if (req.url === '/favicon.ico') {
        return;
    }

    var url = req.params.url;
    var validUrl = validator.isUrl(url);

    var errorResponse = { error: url + " is not valid."};

    if (!validUrl) {
        return res.json(errorResponse);
    }

    return res.json({url: url});
});

var server = app.listen(process.env.PORT || 4000, () => {
    console.log('Express app listening!');
});

module.exports = server;