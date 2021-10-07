square1: function (number) {
    window.alert('ответ от сервера 1');
    return number;
}

function square(number) {
    window.alert('ответ от сервера 1');
    return number;
}

var express = require('express');
var route = express.Router();

route.get('/test', function (req, res, next) {
    res.send('ответ от сервера 2');
});

module.exports = route;