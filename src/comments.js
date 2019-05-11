class Comments {
  constructor(commentsLog) {
    this.allComments = commentsLog;
  }
  getComments() {
    return this.allComments;
  }
  addComment(comment) {
    this.allComments.push(comment);
  }
}

module.exports = Comments;
