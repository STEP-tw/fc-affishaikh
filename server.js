const http = require('http');
const fs = require('fs');
const Comments = require('./src/comments.js');
const PORT = process.env.PORT || 8080;

let commentsLog = fs.readFileSync('./src/commentsLog.json', 'utf8');
commentsLog = JSON.parse(commentsLog);
const comments = new Comments(commentsLog);
module.exports = comments;

const app = require('./src/app.js');
let server = http.createServer(app.handleRequest.bind(app));
server.listen(PORT, () => console.log('listening on ', PORT));
