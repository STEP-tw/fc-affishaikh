const fs = require('fs');
const app = require('./app.js');
const Comments = require('./comments.js');

const doesFileExist = path => fs.existsSync('./src/comments.json');

const getStoredComments = function() {
  let comments = [];
  if (doesFileExist('./src/comments.json')) {
    comments = fs.readFileSync('./src/comments.json', 'utf8');
    return JSON.parse(comments);
  }
  fs.writeFileSync('./src/comments.json', JSON.stringify(comments), 'utf8');
  return comments;
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

const sendNotFound = function(res) {
  send(res, 404, 'Not found');
};

const renderResource = function(req, res, next) {
  const resourcePath = getResourcePath(req.url);
  fs.readFile(resourcePath, (err, resource) => {
    if (err) {
      sendNotFound(res);
      return;
    }
    send(res, 200, resource);
    return;
  });
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
    err => {
      return;
    }
  );
};

const submitComment = function(req, res) {
  const comment = parse(req.body);
  comment.date = new Date().toUTCString();
  storeComment(comment, res);
  renderGuestbook(req, res);
};

const appendComments = function(guestBookHtml, comments) {
  let appendedData = guestBookHtml + comments;
  return appendedData;
};

const insertCommentsInPreTag = function(allComments) {
  let commentsInPreTag = '';
  for (comment of allComments) {
    const localDateAndTime = new Date(comment.date).toLocaleString();
    commentsInPreTag += `<pre>${localDateAndTime}    ${comment.name}    ${
      comment.comment
    }</pre>`;
  }
  return commentsInPreTag;
};

const insertCommentsInDiv = function(allComments) {
  return `<div id="Comments">${allComments}</div>`;
};

const renderGuestbook = function(req, res) {
  fs.readFile('./Public/htmlPages/Guestbook.html', (err, resource) => {
    if (err) {
      sendNotFound(res);
      return;
    }
    const commentsInPreTag = insertCommentsInPreTag(comments.allComments);
    const commentsInDiv = insertCommentsInDiv(commentsInPreTag);
    let appendedData = appendComments(resource, commentsInDiv);
    send(res, 200, appendedData);
    return;
  });
};

const getComments = function(req, res) {
  const commentsInPreTag = insertCommentsInPreTag(comments.allComments);
  res.write(commentsInPreTag);
  res.end();
};

const getCommentsInDiv = function(allComments) {
  const commentsInPreTag = insertCommentsInPreTag(comments.allComments);
  const commentsInDiv = insertCommentsInDiv(commentsInPreTag);
  return commentsInDiv;
};

const insertName = function(resource, name) {
  return resource.replace('###Name###', name);
};

const storeCookie = function(userId, name) {
  const cookie = {};
  cookie[userId] = name;
  fs.writeFile('./Private/cookies.json', JSON.stringify(cookie), err => {});
};

const giveCookie = function(req, res, name) {
  const userId = new Date().getTime();
  res.setHeader('Set-Cookie', `userID=${userId}`);
  storeCookie(userId, name);
};

const login = function(req, res) {
  fs.readFile('./Public/template/profile.html', (err, resource) => {
    if (err) {
      sendNotFound(res);
      return;
    }
    const name = parse(req.body).name;
    giveCookie(req, res, name);
    const profile = insertName(resource.toString(), name);
    const commentsInDiv = getCommentsInDiv(comments.allComments);
    let appendedData = appendComments(profile, commentsInDiv);
    send(res, 200, appendedData);
    return;
  });
};

app.use(readBody);
app.use(logRequest);
app.get('/comments', getComments);
app.get('/htmlPages/Guestbook.html', renderGuestbook);
app.post('/htmlPages/Guestbook.html', login);
app.use(renderResource);

module.exports = app;
