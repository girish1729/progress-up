// HTTP module
var http = require('http');
const auth = require('http-auth');

var digest = auth.digest({
    realm: 'progress-up',
    file: __dirname + "/cred.txt"
});

var basic = auth.basic({
    realm: 'progress-up',
    file: __dirname + "/cred.txt"
});

// Creating new HTTP server.
http.createServer(digest, function(req, res) {
    res.end("Welcome to private area - " + req.user + "!");
}).listen(1337);
