import moment from 'moment';
import jwt  from 'jsonwebtoken';

const encodeAuthToken = (user) => {
  const playload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user
  };
  return jwt.sign(playload, process.env.TOKEN_SECRET);
}
const decodeAuthToken = (token, callback) => {
  const now = moment().unix();
  // check if the token has expired
  const payload = jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      callback('Token has expired.')
    }else {
      callback(null, payload);
    }
  });
}
module.exports = {
  decodeAuthToken,
  encodeAuthToken
};