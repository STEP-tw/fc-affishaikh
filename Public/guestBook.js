const reloadComments = function(document) {
  fetch('/comments')
    .then(response => response.text())
    .then(content => {
      document.getElementById('Comments').innerHTML = content;
    });
};

const createLoginRequest = function(document) {
  const inputField = document.getElementById('name');
  const userName = inputField.value;
  const req = new Request('/login', {
    method: 'POST',
    body: userName
  });
  return req;
};

const login = function(document) {
  const request = createLoginRequest(document);
  fetch(request)
    .then(response => response.text())
    .then(content => {
      document.getElementById('Login').innerHTML = content;
    });
};

const initialize = function() {
  const loginButton = document.getElementById('login');
  loginButton.onclick = login.bind(null, document);
  const reloadCommentsButton = document.getElementById('reloadComments');
  reloadCommentsButton.onclick = reloadComments.bind(null, document);
};

window.onload = initialize;
