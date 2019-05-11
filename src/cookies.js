const isMatching = function(cookie, userId) {
  return Object.keys(cookie).includes(userId);
};

class Cookies {
  constructor(cookiesLog) {
    this.allCookies = cookiesLog;
  }
  getCookies() {
    return this.allCookies;
  }
  addCookie(cookie) {
    this.allCookies.push(cookie);
  }
  deleteCookie(cookie) {
    const index = this.allCookies.findIndex(cookie => {
      return Object.keys(cookie).includes(cookie);
    });
    this.allCookies.copyWithin(index, index + 1);
    this.allCookies.pop();
  }
  getUserName(userDetails) {
    const userId = userDetails.split('=')[1];
    const matching = this.allCookies.filter(cookie =>
      isMatching(cookie, userId)
    );
    const name = matching[0][userId];
    return name;
  }
  includes(userId) {
    return this.allCookies.some(cookie =>
      isMatching(cookie, userId.split('=')[1])
    );
  }
}

module.exports = Cookies;
