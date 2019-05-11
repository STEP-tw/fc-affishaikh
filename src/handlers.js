const fs = require('fs');
const app = require('./app.js');
const Comments = require('./comments.js');
const Cookies = require('./cookies.js');
const Cache = require('./cache.js');

const cache = new Cache();
cache.readAllCaches();

const doesFileExist = path => fs.existsSync(path);

const getStoredComments = function() {
  let comments = [];
  if (doesFileExist('./src/comments.json')) {
    comments = fs.readFileSync('./src/comments.json', 'utf8');
    return JSON.parse(comments);
  }
  fs.writeFileSync('./src/comments.json', JSON.stringify(comments), 'utf8');
  return comments;
};

const getStoredCookies = function() {
  let cookies = [];
  if (doesFileExist('./Private/cookies.json')) {
    cookies = fs.readFileSync('./Private/cookies.json', 'utf8');
    return JSON.parse(cookies);
  }
  fs.writeFileSync('./Private/cookies.json', JSON.stringify(cookies), 'utf8');
  return cookies;
};

const comments = new Comments(getStoredComments());
const cookies = new Cookies(getStoredCookies());

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
  if (cache.isCacheAvailable(resourcePath)) {
    send(res, 200, cache.getCache(resourcePath));
    return;
  }
  sendNotFound(res);
  return;
};

const reducer = function(parsedDataSoFar, keyAndValue) {
  const keyAndValueArr = keyAndValue.split('=');
  const key = keyAndValueArr[0];
  const value = unescape(keyAndValueArr[1]).replace(/[+]+/g, ' ');
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
  const comment = JSON.parse(req.body);
  comment.date = new Date().toUTCString();
  storeComment(comment, res);
  send(res, 200, '');
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
  if (req.headers.cookie && cookies.includes(req.headers.cookie)) {
    fs.readFile('./Public/template/profile.html', (err, resource) => {
      if (err) {
        sendNotFound(res);
        return;
      }
      const name = cookies.getUserName(req.headers.cookie);
      const profile = replacePlaceHolder(
        resource.toString(),
        '###Name###',
        name
      );
      const commentsInPreTag = insertCommentsInPreTag(comments.allComments);
      const commentsInDiv = insertCommentsInDiv(commentsInPreTag);
      let appendedData = appendComments(profile, commentsInDiv);
      send(res, 200, appendedData);
      return;
    });
  } else {
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
  }
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

const replacePlaceHolder = function(resource, placeHolder, newPlaceHolder) {
  return resource.replace(placeHolder, newPlaceHolder);
};

const storeCookie = function(userId, name) {
  const cookie = {};
  cookie[userId] = name;
  cookies.addCookie(cookie);
  fs.writeFile(
    './Private/cookies.json',
    JSON.stringify(cookies.getCookies()),
    err => {}
  );
};

const setCookie = function(res, name) {
  const userId = new Date().getTime();
  res.setHeader('Set-Cookie', `userID=${userId}; path=/`);
  storeCookie(userId, name);
};

const login = function(req, res) {
  const profileTemp = cache.getCache('./Public/template/profile.html');
  const name = parse(req.body).name;
  setCookie(res, name);
  const profile = replacePlaceHolder(
    profileTemp.toString(),
    '###Name###',
    name
  );
  const commentsInDiv = getCommentsInDiv(comments.allComments);
  let appendedData = appendComments(profile, commentsInDiv);
  send(res, 200, appendedData);
  return;
};

const logout = function(req, res) {
  const userId = req.headers.cookie.split('=')[1];
  cookies.deleteCookie(userId);
  fs.writeFile(
    './Private/cookies.json',
    JSON.stringify(cookies.getCookies()),
    err => {}
  );
  res.statusCode = 302;
  res.setHeader('location', '/htmlPages/Guestbook.html');
  res.end();
};

app.use(readBody);
app.use(logRequest);
app.get('/logout?', logout);
app.get('/comments', getComments);
app.get('/htmlPages/Guestbook.html', renderGuestbook);
app.post('/submitComment', submitComment);
app.post('/htmlPages/Guestbook.html', login);
app.use(renderResource);

module.exports = app;
