var express = require('express');
var http = require('http');
var path = require('Path');
var app = express();
var server = http.createServer(app);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'assets')));

server.listen(3000, 'localhost', function () {
	console.log('Express server started on port %s at %s', server.address().port, server.address().address);
	console.log("... port %d in %s mode", server.address().port, app.settings.env);
});


app.get('/', function (req, res, next) {
    res.send('Start page');
});

app.get('/test', function (req, res, next) {
	//res.send('/get-test');
	res.sendFile('/workpage.html', { root: __dirname });
});

app.get('/loggin', function (req, res, next) {
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

app.post('/data', function (req, res, next) {
	res.send('/data');
});

module.exports = app;