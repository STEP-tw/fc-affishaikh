const isMatching = function(route, req) {
  if (route.method && route.method !== req.method) {
    return false;
  }
  if (route.url && route.url !== req.url) {
    return false;
  }
  return true;
};

const findMatching = function(routes, req) {
  return routes.filter(route => isMatching(route, req));
};

class App {
  constructor() {
    this.routes = [];
  }
  use(handler) {
    this.routes.push({ handler });
  }
  get(url, handler) {
    this.routes.push({ method: 'GET', url, handler });
  }
  post(url, handler) {
    this.routes.push({ method: 'POST', url, handler });
  }
  handleRequest(req, res) {
    const matchingRoutes = findMatching(this.routes, req);
    let remaining = [...matchingRoutes];

    let next = () => {
      let current = remaining[0];
      if (!current) return;
      remaining = remaining.slice(1);
      current.handler(req, res, next);
    };
    next();
  }
}

const app = new App();
module.exports = app;
