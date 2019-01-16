const fs = require('fs');
const ENCODING = 'utf8';
const ABELIOPHYLLUM = './src/htmlPages/Abeliophyllum.html';
const HANDLE_EVENTS = './src/handleEvents.js';
const AGERATUM = './src/htmlPages/Ageratum.html';
const LANDINGPAGE = './src/htmlPages/landingPage.html';
const GUESTBOOK_HTML = './src/htmlPages/Guestbook.html';
const MAIN_CSS = './src/css/main.css';
const FLOWER = './src/resources/flowers.jpg';
const WATER_JAR = './src/resources/water_jar.gif';

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
  if (req.url === '/css/main.css') {
    res.writeHead(200, { 'Content-Type': 'text/css' });
    fs.readFile(MAIN_CSS, ENCODING, writeHTML);
  }
  if (req.url === '/src/resources/flowers.jpg') {
    fs.readFile(FLOWER, writeHTML);
  }
  if (req.url === '/src/htmlPages/Abeliophyllum.html') {
    fs.readFile(ABELIOPHYLLUM, ENCODING, writeHTML);
  }
  if (req.url === '/src/htmlPages/Ageratum.html') {
    fs.readFile(AGERATUM, ENCODING, writeHTML);
  }
  if (req.url === '/src/htmlPages/Guestbook.html') {
    fs.readFile(GUESTBOOK_HTML, ENCODING, writeHTML);
  }
  if (req.url === '/src/resources/water_jar.gif') {
    fs.readFile(WATER_JAR, writeHTML);
  }
  if (req.url === '/src/handleEvents.js') {
    fs.readFile(HANDLE_EVENTS, ENCODING, writeHTML);
  }
};

module.exports = app;
