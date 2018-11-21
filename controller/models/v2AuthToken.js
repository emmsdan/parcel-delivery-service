import moment from 'moment';
import jwt  from 'jsonwebtoken';
process.env.TOKEN_SECRET = '\xf8%\xa8\xf2INz\xcc:\x171\xeei\x82\xce\x81Y\xc2HJ\xe5\x01\xf3$';
const encodeAuthToken = (user) => {
  const playload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user
  };
  return jwt.sign(playload, process.env.TOKEN_SECRET);
}
const decodeAuthToken = (token, callback) => {
  const payload = jwt.decode(token);
  const now = moment().unix();
  // check if the token has expired
  if (now > payload.exp){
    callback('Token has expired.');
  } else {
    callback(null, payload);
  }
}
module.exports = {
  decodeAuthToken,
  encodeAuthToken
};