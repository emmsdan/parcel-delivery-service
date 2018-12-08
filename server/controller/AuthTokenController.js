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
   * @returns {object}
   */
  static decodeToken(token) {
    if (!token) return false;
    return jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
  }

  /**
   * check Token
   * @param {string} req
   * @param {string} res
   * @param {string} next
   * @returns {string}
   */
  static checkToken(req, res, next) {
    if (req.cookies['x-token'] === undefined && req.url.search('auth') < 1) {
      res.json({ error: 'Unauthoerized', status: 401 }).status(401);
      return;
    }
    next();
  }

  /**
   * check role Token
   * @param {string} req
   * @param {string} res
   * @param {string} next
   * @returns {string}
   */
  static adminToken(req, res, next) {
    AuthTokenController.checkToken(req, res, next);
    const token = AuthTokenController.decodeToken(req.cookies['x-token']);
    if (token.role === 'user' || token.userId === undefined) {
      res.json({ error: 'Unauthoerized', status: 401 }).status(401);
      return;
    }
    next();
  }
}
export default AuthTokenController;
