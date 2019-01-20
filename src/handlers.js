const fs = require('fs');
const app = require('./app.js');
const Comments = require('./comments.js');

const getStoredComments = function() {
  const comments = fs.readFileSync('./src/comments.json', 'utf8');
  return JSON.parse(comments);
};

const comments = new Comments(getStoredComments());

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const logRequest = function(req, res, next) {
  console.log(req.method, '\t', req.url);
  next();
};

const getResourcePath = function(url) {
  if (url === '/') {
    return './Public/htmlPages/landingPage.html';
  }
  return `./Public${url}`;
};

const send = function(res, statusCode, resource) {
  res.statusCode = statusCode;
  res.write(resource);
  res.end();
};

const renderResource = function(req, res, next) {
  const resourcePath = getResourcePath(req.url);
  fs.readFile(resourcePath, (err, content) => {
    let statusCode = 200;
    let resource = content;
    if (err) {
      statusCode = 404;
      resource = 'File not found';
    }
    send(res, statusCode, resource);
    return;
  });
};

const sendNotFound = function(req, res) {
  send(res, 404, 'Not found');
};

const reducer = function(parsedDataSoFar, keyAndValue) {
  const keyAndValueArr = keyAndValue.split('=');
  const key = keyAndValueArr[0];
  const value = keyAndValueArr[1].replace(/[+]+/g, ' ');
  parsedDataSoFar[key] = value;
  return parsedDataSoFar;
};

const parse = function(keysAndValues) {
  const keysAndValuesArr = keysAndValues.split('&');
  return keysAndValuesArr.reduce(reducer, {});
};

const storeComment = function(comment, res) {
  comments.allComments.unshift(comment);
  fs.writeFile(
    './src/comments.json',
    JSON.stringify(comments.allComments),
    () => {
      res.end();
    }
  );
};

const submitComment = function(req, res) {
  const comment = parse(req.body);
  comment.date = new Date().toLocaleString();
  storeComment(comment, res);
};

app.use(readBody);
app.use(logRequest);
app.get(renderResource);
app.post(submitComment);
app.use(sendNotFound);

module.exports = app;