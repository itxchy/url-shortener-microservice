var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var urlSchema = new Schema({
    id: String,
    original_url: String,
    short_url: String
});

var ShortUrl = mongoose.model('ShortUrl', urlSchema);

module.exports = ShortUrl;