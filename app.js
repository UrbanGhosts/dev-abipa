var express = require('express');
var http = require('http');
var https = require('https');
const rp = require('request-promise');
var path = require('Path');
var cookieParser = require('cookie-parser');
var xlsx = require('node-xlsx')
var app = express();
var server = http.createServer(app);

app.set('view engine', 'html');

app.use(cookieParser('MYY SECRET'));
app.use(express.static(path.join(__dirname, 'assets')));

var authData = { "UserName": "Supervisor", "UserPassword": "Supervisor2!!" };

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

	if (login && login.length > 0 && password && password.length > 0) {
		//����������� � Creatio
		if (!cookies) {
			const answer = await creatioRequest('https://ab01.terrasoft.ru/ServiceModel/AuthService.svc/Login', authData, 'POST');
			console.log(answer);
		}

		var Data = { "login": login, "password": password };
		const result = await creatioRequest('https://ab01.terrasoft.ru/0/rest/qrtServiceSiteAbipa/AuthorizationSiteAbipa', Data, 'POST');
		var obj = JSON.parse(result);
		obj = JSON.parse(obj.AuthorizationSiteAbipaResult);
		console.log(obj.Status + ": " + obj.cookie);

		if (obj.cookie) {
			let options = {
				maxAge: 1000 * 60 * 15, // ������� ����� 15 �����
				httpOnly: true, // ���� cookie �������� ������ ���-�������.
				signed: true // ���������, ������ �� ���� �������� ���� cookie
			}
			res.cookie('CookieAbipaName', obj.cookie, options)
		}
		
		let answer = {
			url: req.protocol + '://' + req.get('host') + "/account",
			status: obj.Status
		}
		res.send(answer);
	} else {
		res.redirect('/');
	}
});

app.get('/updatePassword', async function (req, res, next) {
	var cookie = req.signedCookies['CookieAbipaName'];
	var isButton = req.query.isButton;
	if (!cookie || !isButton) {
		res.redirect('/');
		return;
	}

	var newVal = req.query.newVal;
	var repeateVal = req.query.repeateVal;

	if (!newVal || !repeateVal) {
		res.send({
			status: "400"
		});
		return;
	}

	if (newVal && repeateVal && newVal != repeateVal) {
		res.send({
			status: "401"
		});
		return;
	}

	if (newVal.length > 0 && repeateVal.length > 0 && newVal == repeateVal) {

		var Data = { "cookie": cookie, "password": newVal };
		const result = await creatioRequest('https://ab01.terrasoft.ru/0/rest/qrtServiceSiteAbipa/UpdatePasswordSiteAbipa', Data, 'POST');
		var obj = JSON.parse(result);
		obj = JSON.parse(obj.UpdatePasswordSiteAbipaResult);

		var answer = {
			url: req.protocol + '://' + req.get('host') + "/account",
			status: obj.Status
		}
		//res.send(obj.Status);
		res.send(answer);

	} else {
		res.send("400");
	}
});

app.get('/account', async function (req, res, next) {
	var cookie = req.signedCookies['CookieAbipaName'];

	if (cookie) {
		res.sendFile('/workpage.html', { root: __dirname });
	} else {
		res.redirect('/');
	}
});

app.get('/getData', async function (req, res, next) {
	var cookie = req.signedCookies['CookieAbipaName'];
	var isButton = req.query.isButton;
	if (cookie && isButton) {
		var Data = { "cookie": cookie };
		const result = await creatioRequest('https://ab01.terrasoft.ru/0/rest/qrtServiceSiteAbipa/GenerateTableData', Data, 'POST');
		var obj = JSON.parse(result);
		obj = JSON.parse(obj.GenerateTableDataResult);

		if (obj.Status != "200") {
			res.redirect('/');
		} else {
			res.send(result);
        }
	} else {
		res.redirect('/');
	}
});

app.get('/sendOrder', async function (req, res, next) {
	var cookie = req.signedCookies['CookieAbipaName'];
	var isButton = req.query.isButton;
	if (!cookie && !isButton) {
		res.redirect('/');
		return;
	} else if (!cookie && isButton) {
		res.send({
			url: req.protocol + '://' + req.get('host') + "/",
			status: "401"
		});
		return;
	} else if (cookie && !isButton) {
		res.redirect('/account');
		return;
	}

	var unit = req.query.unit;
	var len = req.query.len;
	var width = req.query.width;
	var height = req.query.height;
	var weight = req.query.weight;
	var price = req.query.price;

	//����������� � Creatio
	if (!cookies) {
		const answer = await creatioRequest('https://ab01.terrasoft.ru/ServiceModel/AuthService.svc/Login', authData, 'POST');
		console.log(answer);
	}

	var Data = {"cookie": cookie, "data": [ 
			unit,
			len,
			width,
			height,
			weight,
			price,
		]};
	
	const result = await creatioRequest('https://ab01.terrasoft.ru/0/rest/qrtServiceSiteAbipa/qrtCreateOrder', Data, 'POST');
	/*
	var getData = 'testAnswer';
	const answer2 = await creatioRequest('https://ab01.terrasoft.ru/0/rest/qrtServiceSiteAbipa/GetOrdersValue?data=' + getData, Data, 'GET');
	*/
	console.log(result);

	res.redirect('/account');
	
});

app.get('/getDataCountry', function (req, res, next) {
	var obj = xlsx.parse(__dirname + '/assets/data/country.xlsx'); // parses a file
	res.send(obj);
	//var obj = xlsx.parse(fs.readFileSync(__dirname + '/country.xlsx')); // parses a buffer
});

app.get('/getDataZipCode', function (req, res, next) {
	var obj = xlsx.parse(__dirname + '/assets/data/ZipCode.xlsx'); // parses a file
	res.send(obj);
	//var obj = xlsx.parse(fs.readFileSync(__dirname + '/ZipCode.xlsx')); // parses a buffer
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