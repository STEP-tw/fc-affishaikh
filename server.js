const http = require('http');
const app = require('./src/app.js');
const PORT = process.env.PORT || 8080;

let server = http.createServer(app.handleRequest.bind(app));
server.listen(PORT, () => console.log('listening on ', PORT));
