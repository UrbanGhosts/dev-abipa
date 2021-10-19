var express = require('express');
var http = require('http');
var https = require('https');
const rp = require('request-promise');
var path = require('Path');
var cookieParser = require('cookie-parser');
var app = express();
var server = http.createServer(app);

app.set('view engine', 'html');

app.use(cookieParser('MYY SECRET'));
app.use(express.static(path.join(__dirname, 'assets')));

var port = process.env.PORT || 3000;
server.listen(port, 'localhost', function () {
	console.log('Express server started on port %s at %s', server.address().port, server.address().address);
	console.log("... port %d in %s mode", server.address().port, app.settings.env);
});


app.get('/', function (req, res, next) {
	res.clearCookie('CookieAbipaName');
	res.sendFile('/index.html', { root: __dirname });
});

app.get('/login', async function (req, res, next) {
	var login = req.query.name;
	var password = req.query.password;

	if (login.length > 0 && password.length > 0) {
		//Авторизация в Creatio
		if (!cookies) {
			var authData = { "UserName": "Supervisor", "UserPassword": "Supervisor2!" };
			const answer = await creatioRequest('https://ab01.terrasoft.ru/ServiceModel/AuthService.svc/Login', authData, 'POST');
			console.log(answer);
			//Set cookie from Creatio
			/*
			var CookieAbipaName = req.cookies['CookieAbipaName'];
			*/
		}

		var Data = { "login": login, "password": password };
		const result = await creatioRequest('https://ab01.terrasoft.ru/0/rest/qrtServiceSiteAbipa/AuthorizationSiteAbipa', Data, 'POST');
		var obj = JSON.parse(result);
		obj = JSON.parse(obj.AuthorizationSiteAbipaResult);
		console.log(obj.Status);
		console.log(obj.cookie);

		if (obj.cookie) {
			let options = {
				maxAge: 1000 * 60 * 15, // истечет через 15 минут
				httpOnly: true, // Файл cookie доступен только веб-серверу.
				signed: true // Указывает, должен ли быть подписан файл cookie
			}
			res.cookie('CookieAbipaName', obj.cookie, options)
			//res.redirect('/account');
			res.send(obj.Status);
		} else {
			res.send(obj.Status);
        }
		
	} else {
		res.redirect('/');
	}
});

app.get('/updatePassword', async function (req, res, next) {
	var cookie = req.signedCookies['CookieAbipaName'];
	if (!cookie) {
		res.redirect('/');
		return;
	}

	var newVal = req.query.newVal;
	if (newVal.length > 0) {

		var Data = { "cookie": cookie, "password": newVal };
		const result = await creatioRequest('https://ab01.terrasoft.ru/0/rest/qrtServiceSiteAbipa/UpdatePasswordSiteAbipa', Data, 'POST');
		var obj = JSON.parse(result);
		obj = JSON.parse(obj.UpdatePasswordSiteAbipaResult);

		res.send(obj.Status);

	} else {
		res.redirect('/');
	}
});

app.get('/account', function (req, res, next) {
	var cookie = req.signedCookies['CookieAbipaName'];
	console.log("cookie: " + cookie);

	if (cookie) {
		res.sendFile('/workpage.html', { root: __dirname });
	} else {
		res.redirect('/');
	}
});




app.get('/sendOrder', async function (req, res, next) {
	//Remove cookie from Creatio
	/*
	res.clearCookie('BPMCSRF');
	res.clearCookie('.ASPXAUTH');
	res.clearCookie('BPMLOADER');
	res.clearCookie('UserName');
	*/
	var cookie = req.signedCookies['CookieAbipaName'];
	if (!cookie) {
		res.redirect('/');
		return;
	}
	var unit = req.query.unit;
	var len = req.query.len;
	var width = req.query.width;
	var height = req.query.height;
	var weight = req.query.weight;
	var price = req.query.price;
	
	//Авторизация в Creatio
	if (!cookies) {
		var authData = { "UserName": "Supervisor", "UserPassword": "Supervisor2!" };
		const answer = await creatioRequest('https://ab01.terrasoft.ru/ServiceModel/AuthService.svc/Login', authData, 'POST');
		console.log(answer);
		//Set cookie from Creatio
		/*
		BPMCSRF = req.cookies['BPMCSRF'];
		ASPXAUTH = req.cookies['.ASPXAUTH'];
		BPMLOADER = req.cookies['BPMLOADER'];
		userName = req.cookies['UserName'];
		*/
	}

	var Data = {"cookie": cookie, "data": [ 
			unit,
			len,
			width,
			height,
			weight,
			price,
		]};
	var getData = 'testAnswer';
	const answer2 = await creatioRequest('https://ab01.terrasoft.ru/0/rest/qrtServiceSiteAbipa/qrtCreateOrder', Data, 'POST');
	//const answer2 = await creatioRequest('https://ab01.terrasoft.ru/0/rest/qrtServiceSiteAbipa/GetOrdersValue?data=' + getData, Data, 'GET');
	console.log(answer2);
	res.redirect('/account');
	
});

app.post('/addOrder', function (req, res) {
	console.log(req);
	res.redirect('/account');
});

module.exports = app;

var cookies;
var BPMCSRF;
async function creatioRequest(url, data, method) {
	const dataString = JSON.stringify(data);
	var options = {};

	if (cookies) {
		options = {
			method: method,
			headers: {
				'Cookie': cookies,
				'BPMCSRF': BPMCSRF,
				'KeepAlive': true,
				'ForceUseSession': true,
				'muteHttpExceptions': true,
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Content-Length': dataString.length,
			},
		};
	} else {
		options = {
			method: method,
			headers: {
				'KeepAlive': true,
				'Content-Type': 'application/json',
				'Content-Length': dataString.length,
			},
		};
	}

	return new Promise((resolve, reject) => {
		const req = https.request(url, options, (res) => {
			if (res.statusCode < 200 || res.statusCode > 299) {
				return reject(new Error(`HTTP status code ${res.statusCode}`));
			}

			const body = [];
			res.on('data', (chunk) => body.push(chunk));
			res.on('end', () => {
				const resString = Buffer.concat(body).toString();
				resolve(resString);
				if (!cookies) {
					cookies = res.headers['set-cookie'];
					BPMCSRF = cookies[2].split(';')[0];
					BPMCSRF = BPMCSRF.split('=')[1];
                }
				
			});
		});

		req.on('error', (err) => {
			reject(err);
		});

		req.on('timeout', () => {
			req.destroy();
			reject(new Error('Request time out'));
		});

		req.write(dataString);
		req.end();
	});
}