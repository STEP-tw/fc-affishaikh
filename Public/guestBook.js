const reloadComments = function(document) {
  fetch('/comments')
    .then(response => response.text())
    .then(content => {
      document.getElementById('Comments').innerHTML = content;
    });
};

const initialize = function() {
  const reloadCommentsButton = document.getElementById('reloadComments');
  reloadCommentsButton.onclick = reloadComments.bind(null, document);
};

window.onload = initialize;
