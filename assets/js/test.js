var express = require('express');
var route = express.Router();

route.get('/', function (req, res, next) {
    res.send('ответ от сервера');
});

route.get('/loggin', function (req, res, next) {
	var xhr = new XMLHttpRequest();
	xhr.withCredentials = true;
	var authData = { "UserName": "Supervisor", "UserPassword": "Supervisor2!" };
	xhr.open("POST", "https://ab01.terrasoft.ru/ServiceModel/AuthService.svc/Login", true);

	xhr.onload = function () {
		res.send(xhr.responseText);
	}

	xhr.onerror = function () {
		res.send('Error: ' + xhr.status);
	}

	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader('Access-Control-Allow-Credentials', true);
	xhr.setRequestHeader('Access-Control-Allow-Methods', 'POST');
	xhr.send(authData);
});

route.post('/data', function (req, res, next) {
	res.send('ответ от сервера 3');
});

module.exports = route;