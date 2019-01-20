const http = require('http');
const app = require('./src/handlers.js');
const PORT = process.env.PORT || 8080;

let server = http.createServer(app.handleRequest.bind(app));
server.listen(PORT, () => console.log('listening on ', PORT));
