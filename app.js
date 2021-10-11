var express = require('express');
var http = require('http');
var https = require('https');
var path = require('Path');
var app = express();
var server = http.createServer(app);
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'assets')));

var port = process.env.PORT || 3000;
server.listen(port, 'localhost', function () {
	console.log('Express server started on port %s at %s', server.address().port, server.address().address);
	console.log("... port %d in %s mode", server.address().port, app.settings.env);
});


app.get('/', function (req, res, next) {
	res.sendFile('/index.html', { root: __dirname });
});

app.get('/account', function (req, res, next) {
	var login = req.query.name;
	var password = req.query.password;
	if (login != '' && password != '') {
		
		res.sendFile('/workpage.html', { root: __dirname });
		//res.end('{"success" : "Ok", "status" : 200}');
	} else {
		res.redirect('/');
		//res.sendFile('/index.html', { root: __dirname });
		//res.end('{"success" : "Unauthorized", "status" : 401}');
	}
	
});

app.get('/loggin', function (req, res1, next) {
	var authData = { "UserName": "Supervisor", "UserPassword": "Supervisor2!" };

	https.get('https://ab01.terrasoft.ru/ServiceModel/AuthService.svc/Login', res => {
		let data = [];
		const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
		console.log('Status Code:', res.statusCode);
		console.log('Date in Response header:', headerDate);

		res.on('data', chunk => {
			data.push(chunk);
		});

		res.on('end', () => {
			res1.send((data).toString());
		});
	}).on('error', err => {
		console.log('Error: ', err.message);
	});
	/*
	var authData = { "UserName": "Supervisor", "UserPassword": "Supervisor2!" };
	xhr.open("POST", "https://ab01.terrasoft.ru/ServiceModel/AuthService.svc/Login", true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("Accept", "application/json");
	
	http.get('https://jsonplaceholder.typicode.com/users', res => {
		let data = [];
		const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
		console.log('Status Code:', res.statusCode);
		console.log('Date in Response header:', headerDate);

		res.on('data', chunk => {
			data.push(chunk);
		});

		res.on('end', () => {
			console.log('Response ended: ');
			const users = JSON.parse(Buffer.concat(data).toString());

			for (user of users) {
				console.log(`Got user with id: ${user.id}, name: ${user.name}`);
			}
		});
	}).on('error', err => {
		console.log('Error: ', err.message);
	});
	*/
});

app.post('/addOrder', function (req, res) {
	//res.send('/data');
	console.log(req);
	res.redirect('/account');
});

module.exports = app;