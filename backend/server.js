const express = require('express')
const multer = require('multer');
const morgan = require('morgan-body');
const cors = require('cors');
const fs = require('file-system');

const app = express();
morgan(app);
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));


// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)
})

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})


app.listen(2324, () => {
    console.log('Server is up on port 2324');
})

