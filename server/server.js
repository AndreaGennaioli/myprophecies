const express = require('express');
var app = express();

// port
var port = process.env.PORT || 8080

app.use(express.static(__dirname + "/../public"));

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(port, function () {
    console.log('SERVER running on port: ', port);
});