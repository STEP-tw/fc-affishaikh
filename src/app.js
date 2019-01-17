const fs = require('fs');

const renderFile = function(res, fileContents) {
  res.statusCode = 200;
  res.write(fileContents);
  res.end();
};

class Route {
  constructor(url, resource, handler) {
    this.url = url;
    this.handler = handler;
    this.resource = resource;
  }
}

const findMatching = function(routes, url) {
  return routes.filter(route => url === route.url);
};

class App {
  constructor() {
    this.routes = [];
  }
  addRoute(url, handler, resource) {
    const route = new Route(url, handler, resource);
    this.routes.push(route);
  }
  handleRequest(req, res) {
    const matchingRoute = findMatching(this.routes, req.url);
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
app.addRoute('/', './src/htmlPages/landingPage.html', renderFile);
app.addRoute('/css/main.css', './src/css/main.css', renderFile);
app.addRoute(
  '/src/htmlPages/Abeliophyllum.html',
  './src/htmlPages/Abeliophyllum.html',
  renderFile
);
app.addRoute(
  '/src/htmlPages/Ageratum.html',
  './src/htmlPages/Ageratum.html',
  renderFile
);
app.addRoute('/src/handleEvents.js', './src/handleEvents.js', renderFile);
app.addRoute(
  '/src/htmlPages/Guestbook.html',
  './src/htmlPages/Guestbook.html',
  renderFile
);
app.addRoute(
  '/src/resources/flowers.jpg',
  './src/resources/flowers.jpg',
  renderFile
);
app.addRoute(
  '/src/resources/water_jar.gif',
  './src/resources/water_jar.gif',
  renderFile
);

module.exports = app;
