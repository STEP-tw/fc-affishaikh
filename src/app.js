const fs = require('fs');
const ENCODING = 'utf8';
const LANDINGPAGE = './src/landingPage.html';

const createHTMLWriter = function(res) {
  return function(err, html) {
    res.write(html);
    res.statusCode = 200;
    res.end();
  };
};

const app = (req, res) => {
  const writeHTML = createHTMLWriter(res);
  if (req.url === '/') {
    fs.readFile(LANDINGPAGE, ENCODING, writeHTML);
  }
};

module.exports = app;
