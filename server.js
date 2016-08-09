const validator   = require('validator');
const compression = require('compression');
const mongoose    = require('mongoose');
const express     = require('express');
const app         = express();

app.use(compression());

mongoose.connect('mongodb://localhost:27017/local');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongoose encountered an error.'));
db.once('open', function() {
    console.log('mongodb connected!')
});

// create schema {
//      original_url: URL,
//      short_url: SHORTY
//  }

app.use('/:url', (req, res) => {

    if (req.url === '/favicon.ico') {
        return;
    }

    var url = req.params.url;
    var validUrl = validator.isUrl(url);

    var errorResponse = { error: url + " is not valid."};

    if (!validUrl) {
        return res.json(errorObj)
    }

    return res.json({url: url});
});

var server = app.listen(process.env.PORT || 4000, () => {
    console.log('Express app listening!');
});

module.exports = server;