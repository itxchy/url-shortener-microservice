
const compression = require('compression');
const parser      = require('ua-parser-js');
const express     = require('express');
const app         = express();

app.use(compression());

app.use( (req, res) => {

    if (req.url === '/favicon.ico') {
        return;
    }

    let ipAddress = req.ip;
    let language = req.get('Accept-Language');
    let userAgent = req.get('User-Agent');

    let reIp = /\d\.?/g;
    let reLanguage = /,.*/g;

    // returns the matched IP address only
    let filteredIpAddress = ipAddress.match(reIp).join('');

    // filters out everything after the initial language code
    let filteredLanguage = language.replace(reLanguage, '');

    // parses User-Agent string into an object
    let parsedUa = parser(userAgent);
    let os = parsedUa.os;
    let filteredOperatingSystem = `${os.name} ${os.version}`;

    parsedJSON = {
        ip_address: filteredIpAddress,
        language: filteredLanguage,
        operating_system: filteredOperatingSystem
    };

    return res.json(parsedJSON);
});

var server = app.listen(process.env.PORT || 4000, () => {
    console.log('Express app listening!');
});

module.exports = server;