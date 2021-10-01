const http = require('http');
const server = http.createServer();

server.on('request', (req, res) => {
	res.end('Основы Node.js');
});

server.listen (3000, () => console.log ('Сервер работает'));

app.post('/searching', function(req, res){
 //do something with req
 alert('ok');
});