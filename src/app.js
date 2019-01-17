const fs = require('fs');

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
    fs.readFile(matchingRoute[0].resource, (err, fileContents) => {
      renderFile(res, fileContents);
    });
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
  renderFile
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

module.exports = app;
