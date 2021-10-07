var express = require('express');
var route = express.Router();

route.get('/', function (req, res, next) {
    res.send('ответ от сервера');
});

route.post('/testajax', function (req, res, next) {
    res.send('ответ от сервера 2');
});

module.exports = route;