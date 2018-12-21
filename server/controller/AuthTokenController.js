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
    res.setHeader('API-Author', 'Emmanuel Daniel');
    res.setHeader('App-Client', 'Andela Bootcamp Cycle 38');
    const token = AuthTokenController.decodeToken(req.cookies['x-token']);
    if (!token || (token.role === 'user' && token.userId !== req.params.userId) || (req.cookies['x-token'] === undefined && req.url.search('auth/') < 1)) {
      res.json({ error: 'Unauthorized', status: 401 }).status(401);
      res.end();
    } else {
      next();
    }
    return false;
  }

  /**
   * check role Token
   * @param {string} req
   * @param {string} res
   * @param {string} next
   */
  static adminToken(req, res, next) {
    res.setHeader('API-Author', 'Emmanuel Daniel');
    res.setHeader('App-Client', 'Andela Bootcamp Cycle 38');
    const token = AuthTokenController.decodeToken(req.cookies['x-token']);
    if (token.userId === undefined || token.role.includes('user')) {
      res.json({ error: 'Unauthorized', status: 401, youAre: token.role }).status(401);
      res.end();
    } else {
      next();
    }
  }
}
export default AuthTokenController;
