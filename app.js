var express = require('express');
var http = require('http');
var https = require('https');
const rp = require('request-promise');
var path = require('Path');
var cookieParser = require('cookie-parser');
var xlsx = require('node-xlsx')
var bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);

app.set('view engine', 'html');

app.use(cookieParser('MYY SECRET'));
app.use(express.static(path.join(__dirname, 'assets')));
//app.use(express.limit('2mb'));
app.use(bodyParser.raw({
	type: 'application/octet-stream',
	limit: '10mb'
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

var site = "https://ab01.terrasoft.ru";
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
		//Авторизация в Creatio
		if (!cookies) {
			const answer = await creatioRequest(site + '/ServiceModel/AuthService.svc/Login', authData, 'POST');
			console.log(answer);
		}

		var Data = { "login": login, "password": password };
		const result = await creatioRequest(site + '/0/rest/qrtServiceSiteAbipa/AuthorizationSiteAbipa', Data, 'POST');
		var obj = JSON.parse(result);
		obj = JSON.parse(obj.AuthorizationSiteAbipaResult);
		console.log(obj.Status + ": " + obj.cookie);

		if (obj.cookie) {
			let options = {
				maxAge: 1000 * 60 * 15, // истечет через 15 минут
				httpOnly: true, // Файл cookie доступен только веб-серверу.
				signed: true // Указывает, должен ли быть подписан файл cookie
			}
			res.cookie('CookieAbipaName', obj.cookie, options)
		}
		
		let answer = {
			url: req.protocol + '://' + req.get('host') + "/order",
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
		const result = await creatioRequest(site + '/0/rest/qrtServiceSiteAbipa/UpdatePasswordSiteAbipa', Data, 'POST');
		var obj = JSON.parse(result);
		obj = JSON.parse(obj.UpdatePasswordSiteAbipaResult);

		var answer = {
			url: req.protocol + '://' + req.get('host') + "/order",
			status: obj.Status
		}
		//res.send(obj.Status);
		res.send(answer);

	} else {
		res.send({
			status: "400"
		});
	}
});

app.get('/order', async function (req, res, next) {
	var cookie = req.signedCookies['CookieAbipaName'];

	if (cookie) {
		res.sendFile('/workpage.html', { root: __dirname });
	} else {
		res.redirect('/');
	}
});

app.get('/account', async function (req, res, next) {
	var cookie = req.signedCookies['CookieAbipaName'];

	if (cookie) {
		res.sendFile('/account.html', { root: __dirname });
	} else {
		res.redirect('/');
	}
});

app.get('/newOrder', async function (req, res, next) {
	var cookie = req.signedCookies['CookieAbipaName'];
	if (cookie) {
		res.sendFile('/newOrder.html', { root: __dirname });
	} else {
		res.redirect('/');
	}
});

app.get('/getData', async function (req, res, next) {
	var cookie = req.signedCookies['CookieAbipaName'];
	var isButton = req.query.isButton;
	if (cookie && isButton) {
		//Авторизация в Creatio
		if (!cookies) {
			const answer = await creatioRequest(site + '/ServiceModel/AuthService.svc/Login', authData, 'POST');
			console.log(answer);
		}

		var Data = { "cookie": cookie };
		const result = await creatioRequest(site + '/0/rest/qrtServiceSiteAbipa/GenerateTableData', Data, 'POST');
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
	}

	var unit = req.query.unit;
	var len = req.query.len;
	var width = req.query.width;
	var height = req.query.height;
	var weight = req.query.weight;
	var price = req.query.price;

	//Авторизация в Creatio
	if (!cookies) {
		const answer = await creatioRequest(site + '/ServiceModel/AuthService.svc/Login', authData, 'POST');
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
	
	const result = await creatioRequest(site + '/0/rest/qrtServiceSiteAbipa/qrtCreateOrder', Data, 'POST');
	/*
	var getData = 'testAnswer';
	const answer2 = await creatioRequest(site + '/0/rest/qrtServiceSiteAbipa/GetOrdersValue?data=' + getData, Data, 'GET');
	*/
	console.log(result);
	res.send({
		url: req.protocol + '://' + req.get('host') + "/order",
		status: "200"
	});	
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

app.get('/resetPassword', async function (req, res, next) {
	var isButton = req.query.isButton;
	console.log(isButton);
	if (!isButton) {
		res.redirect('/');
		return;
	}

	var login = req.query.login;

	if (!login) {
		res.send({
			status: "400"
		});
		return;
	}

	var Data = { "login": login };
	const result = await creatioRequest(site + '/0/rest/qrtServiceSiteAbipa/ResetPasswordSiteAbipa', Data, 'POST');
	var obj = JSON.parse(result);
	obj = JSON.parse(obj.ResetPasswordSiteAbipaResult);

	if (!obj|| !obj.Status) {
		res.send({
			status: "404"
		});
		return;
    }

	res.send({
		status: obj.Status
	});

});

app.post('/updatePhoto', async function (req, res, next) {

	var cookie = req.signedCookies['CookieAbipaName'];

	var body = req.body.toString();
	var list = body.split("&");

	var isButton = list[1].split("=")[1];
	var filename = list[2].split("=")[1];

	var file = list[0].replace("file=", "");
	file = String(file).replace(/%2C/g, ",");

	if (!cookie && !isButton) {
		res.redirect('/');
		return;
	} else if (!cookie && isButton) {
		res.send({
			url: req.protocol + '://' + req.get('host') + "/",
			status: "401"
		});
		return;
	}

	//Авторизация в Creatio
	if (!cookies) {
		const answer = await creatioRequest(site + '/ServiceModel/AuthService.svc/Login', authData, 'POST');
		console.log(answer);
	}

	var Data = { "data": file.toString(), "cookie": cookie, "filename": filename };
	const result = await creatioRequest(site + '/0/rest/qrtServiceSiteAbipa/UpdatePhotoFromSite', Data, 'POST');
	var obj = JSON.parse(result);
	console.log(obj);

	obj = JSON.parse(obj.UpdatePhotoFromSiteResult);
	if (!obj || !obj.Status) {
		res.send({
			url: req.protocol + '://' + req.get('host') + "/",
			status: "401"
		});
		return;
	}

	res.send({
		status: "200",
		id: obj.Guid
	});

});

app.post('/addFile', async function (req, res, next) {

	var cookie = req.signedCookies['CookieAbipaName'];
	
	var body = req.body.toString();
	var list = body.split("&");

	var isButton = list[1].split("=")[1];
	var filename = list[2].split("=")[1];

	var file = list[0].replace("file=", "");
	file = String(file).replace(/%2C/g, ",");



	if (!cookie && !isButton) {
		res.redirect('/');
		return;
	} else if (!cookie && isButton) {
		res.send({
			url: req.protocol + '://' + req.get('host') + "/",
			status: "401"
		});
		return;
	}

	//Авторизация в Creatio
	if (!cookies) {
		const answer = await creatioRequest(site + '/ServiceModel/AuthService.svc/Login', authData, 'POST');
		console.log(answer);
	}

	var Data = { "data": file.toString(), "cookie": cookie, "filename": filename };
	const result = await creatioRequest(site + '/0/rest/qrtServiceSiteAbipa/AddFileFromSite', Data, 'POST');
	var obj = JSON.parse(result);
	console.log(obj);

	obj = JSON.parse(obj.AddFileFromSiteResult);
	if (!obj || !obj.Status) {
		res.send({
			url: req.protocol + '://' + req.get('host') + "/",
			status: "401"
		});
		return;
	}

	res.send({
		status: "200",
		id: obj.Guid
	});

});

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
				'Content-Type': 'application/json; charset=utf-8',
				'Accept': 'application/json; charset=utf-8',
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