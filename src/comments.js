class Comments {
  constructor(commentsLog) {
    this.allComments = commentsLog;
  }
  getComments() {
    return this.comments;
  }
  addComment(comment) {
    this.comments.push(comment);
  }
}

module.exports = Comments;
