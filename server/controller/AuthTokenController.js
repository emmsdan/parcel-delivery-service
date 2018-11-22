import moment from 'moment';
import jwt from 'jsonwebtoken';

/**
 * AuthTokenController: generateToken for User Authentication
 */
class AuthTokenController {
  /**
   * generateToken
   * @param {string/object} user
   * @returns {Promise}
   */
  static generateToken(user) {
    const playload = {
      exp: moment().add(14, 'days').unix(),
      iat: moment().unix(),
      sub: user
    };
    return jwt.sign(playload, process.env.AUTH_TOKEN_SECRET);
  }

  /**
   * decode generated Token
   * @param {string} token
   * @param {function} callback
   */
  static decodeToken(token, callback) {
    const payload = jwt.decode(token);
    const now = moment().unix();
    // check if the token has expired
    if (now > payload.exp) {
      callback('Token has expired.');
    } else {
      callback(null, payload);
    }
  }
}

export default AuthTokenController;
