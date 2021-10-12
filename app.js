var express = require('express');
var http = require('http');
var https = require('https');
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
	res.sendFile('/index.html', { root: __dirname });
});

app.get('/login', function (req, res, next) {
	var login = req.query.name;
	var password = req.query.password;

	console.log(login.length + "/" + password.length);
	if (login.length > 0 && password.length > 0) {
		//TODO: отправить запрос в БД и заполнить значение cookie из абипы
		let options = {
			maxAge: 1000 * 60 * 15, // истечет через 15 минут
			httpOnly: true, // Файл cookie доступен только веб-серверу.
			signed: true // Указывает, должен ли быть подписан файл cookie
		}
		res.cookie('CookieAbipaName', 'testAbipaValue', options)
		res.redirect('/account');
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


var BPMCSRF = null;
var ASPXAUTH = null;
var BPMLOADER = null;
var userName = null;
var cookies;
app.get('/sendOrder', async function (req, res, next) {
	//Авторизация в Creatio
	if (!BPMLOADER) {
		var authData = { "UserName": "Supervisor", "UserPassword": "Supervisor2!" };
		const answer = await creatioRequest('https://ab01.terrasoft.ru/ServiceModel/AuthService.svc/Login', authData);
		//cookie from Creatio
		BPMCSRF = req.cookies['BPMCSRF'];
		ASPXAUTH = req.cookies['.ASPXAUTH'];
		BPMLOADER = req.cookies['BPMLOADER'];
		userName = req.cookies['UserName'];

		cookies = req.cookies;
    }


	var testSiteRequest = 'testSiteRequest';
	var Data = "{ data:" + testSiteRequest + "}";
	const answer2 = await creatioRequest('https://ab01.terrasoft.ru/0/rest/RivileWebService/PostInvoiceValue', Data);
	res.send(answer2);

});

app.post('/addOrder', function (req, res) {
	console.log(req);
	res.redirect('/account');
});

module.exports = app;


async function creatioRequest(url, data) {
	const dataString = JSON.stringify(data)

	var options = {};
	if (BPMLOADER) {
		console.log('1');
		var cookie = 'BPMCSRF=' + BPMCSRF + "; UserName=" + userName + "; .ASPXAUTH=" + ASPXAUTH + "; BPMLOADER=" + BPMLOADER;
		options = {
			method: 'POST',
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
		console.log(options);
	} else {
		console.log('0');
		options = {
			method: 'POST',
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