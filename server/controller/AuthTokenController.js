import jwt from 'jsonwebtoken';

process.env.AUTH_TOKEN_SECRET = '\xf8%\xa8\xf2INz\xcc:\x171\xeei\x82\xce\x81Y\xc2HJ\xe5\x01\xf3$';
/**
 * AuthTokenController: generateToken for User Authentication
 */
class AuthTokenController {
  /**
   * generateToken
   * @param {string/object} user
   * @returns {string}
   */
  static generateToken(user) {
    return jwt.sign(user, process.env.AUTH_TOKEN_SECRET);
  }

  /**
   * decode generated Token
   * @param {string} token
   * @returns {string}
   */
  static decodeToken(token) {
    if (!token){
      return false;
    }
    return jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
  }
}
export default AuthTokenController;
