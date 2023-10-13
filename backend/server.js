const express = require('express')
const fs = require('fs');
//const https = require('https');
const http = require('http');
const multer = require('multer');
const morgan = require('morgan-body');
const cors = require('cors');
const tus = require('tus');
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');

//const cert = fs.readFileSync(__dirname + "/localhost.pem", 'utf-8');
//const key = fs.readFileSync(__dirname + "/localhost-key.pem", 'utf-8');
const app = express();
morgan(app);
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ 
    extended: true
}));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

app.post('/uploadmultiple', upload.array('uploadFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

/*
https.createServer({key: key, cert: cert}, app).listen(2324, () => {
    console.log('Server is up on port 2324');
})
*/
http.createServer( app).listen(2324, () => {
    console.log('Server is up on port 2324');
})
