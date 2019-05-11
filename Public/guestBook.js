const reloadComments = function(document) {
  fetch('/comments')
    .then(response => response.text())
    .then(content => {
      document.getElementById('Comments').innerHTML = content;
    });
};

const submitComment = function(document) {
  const commentDiv = document.getElementById('comment');
  const nameDiv = document.getElementById('name');
  const commentDetails = {};
  commentDetails.name = nameDiv.innerText;
  commentDetails.comment = commentDiv.value;
  const req = new Request('/submitComment', {
    method: 'POST',
    body: JSON.stringify(commentDetails)
  });
  fetch(req).then(response => {
    reloadComments(document);
  });
  commentDiv.value = '';
};

const initialize = function() {
  const submitButton = document.getElementById('submit');
  submitButton.onclick = submitComment.bind(null, document);
  const reloadCommentsButton = document.getElementById('reloadComments');
  reloadCommentsButton.onclick = reloadComments.bind(null, document);
};

window.onload = initialize;
