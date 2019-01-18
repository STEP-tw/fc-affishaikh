const fs = require('fs');

const parser = function(parameter) {
  parameter = parameter.split('=');
  let parameterValue = parameter[1];
  return parameterValue.replace(/[+]+/g, ' ');
};

const storeCommentInFile = function(commentDetails) {
  commentDetails = commentDetails.split('&');
  let parsedCommentDetails = commentDetails.map(parser);
  let parsedComment = {};
  parsedComment.date = new Date().toLocaleString();
  parsedComment.name = parsedCommentDetails[0];
  parsedComment.comment = parsedCommentDetails[1];
  fs.readFile('./src/commentsLog.json', (err, data) => {
    let comments = JSON.parse(data);
    comments.unshift(parsedComment);
    fs.writeFile('./src/commentsLog.json', JSON.stringify(comments), () => {});
  });
};

const renderGuestBook = function(res) {
  console.log('guest book');
  fs.readFile('./src/htmlPages/Guestbook.html', (err, data) => {
    res.statusCode = 200;
    res.write(data);
    fs.readFile('./src/commentsLog.json', (err, data) => {
      const comments = JSON.parse(data);
      for (
        let commentIndex = 0;
        commentIndex < comments.length;
        commentIndex++
      ) {
        let comment =
          comments[commentIndex].date +
          '\t' +
          comments[commentIndex].name +
          '\t' +
          comments[commentIndex].comment;
        res.write('<div>' + comment + '</div>');
      }
      res.end();
    });
  });
};

const submitComment = function(req, res) {
  let commentDetails = '';
  req.on('data', chunk => {
    commentDetails += chunk;
  });
  req.on('end', () => {
    storeCommentInFile(commentDetails);
    renderGuestBook(res);
  });
};

const renderFile = function(res, fileContents) {
  res.statusCode = 200;
  res.write(fileContents);
  res.end();
};

class Route {
  constructor(method, url, resource, handler) {
    this.method = method;
    this.url = url;
    this.handler = handler;
    this.resource = resource;
  }
}

const findMatching = function(routes, req) {
  return routes.filter(
    route => req.method === route.method && req.url === route.url
  );
};

class App {
  constructor() {
    this.routes = [];
  }
  get(url, resource, handler) {
    const route = new Route('GET', url, resource, handler);
    this.routes.push(route);
  }
  post(url, resource, handler) {
    const route = new Route('POST', url, resource, handler);
    this.routes.push(route);
  }
  handleRequest(req, res) {
    const matchingRoute = findMatching(this.routes, req);
    if (matchingRoute.length === 0) {
      res.statusCode = 404;
      res.write('File not found');
      res.end();
      return;
    }
    if (req.method === 'POST') {
      matchingRoute[0].handler(req, res);
    }
    if(req.method === 'GET' && req.url === '/src/htmlPages/Guestbook.html') {
      renderGuestBook(res);
    }
    if (req.method === 'GET' && req.url !== '/src/htmlPages/Guestbook.html') {
      fs.readFile(matchingRoute[0].resource, (err, fileContents) => {
        renderFile(res, fileContents);
      });
    }
  }
}

const app = new App();
app.get('/', './src/htmlPages/landingPage.html', renderFile);
app.get('/css/main.css', './src/css/main.css', renderFile);
app.get(
  '/src/htmlPages/Abeliophyllum.html',
  './src/htmlPages/Abeliophyllum.html',
  renderFile
);
app.get(
  '/src/htmlPages/Ageratum.html',
  './src/htmlPages/Ageratum.html',
  renderFile
);
app.get('/src/handleEvents.js', './src/handleEvents.js', renderFile);
app.get(
  '/src/htmlPages/Guestbook.html',
  './src/htmlPages/Guestbook.html',
  renderGuestBook
);
app.get(
  '/src/resources/flowers.jpg',
  './src/resources/flowers.jpg',
  renderFile
);
app.get(
  '/src/resources/water_jar.gif',
  './src/resources/water_jar.gif',
  renderFile
);
app.post(
  '/src/htmlPages/Guestbook.html',
  './src/htmlPages/Guestbook.html',
  submitComment
);

module.exports = app;
