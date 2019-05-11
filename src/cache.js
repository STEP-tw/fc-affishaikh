const fs = require('fs');

const readCache = function(cacheReadSoFar, path) {
  const cache = { ...cacheReadSoFar };
  cache[path] = fs.readFileSync(path);
  return cache;
};

class Cache {
  constructor() {
    this.cachePaths = [
      './Public/htmlPages/Abeliophyllum.html',
      './Public/htmlPages/Ageratum.html',
      './Public/htmlPages/Guestbook.html',
      './Public/htmlPages/landingPage.html',
      './Public/css/main.css',
      './Public/resources/abeliophyllum.jpg',
      './Public/resources/flowers.jpg',
      './Public/resources/Abeliophyllum.pdf',
      './Public/resources/ageratum.jpg',
      './Public/resources/Ageratum.pdf',
      './Public/resources/water_jar.gif',
      './Public/handleEvents.js',
      './Public/guestBook.js',
      './Public/template/profile.html'
    ];
    this._cache = {};
  }
  getAllCaches() {
    return this._cache;
  }
  getCache(filePath) {
    return this._cache[filePath];
  }
  readAllCaches() {
    this._cache = this.cachePaths.reduce(readCache, {});
  }
  isCacheAvailable(filePath) {
    return this.cachePaths.includes(filePath);
  }
}

module.exports = Cache;
