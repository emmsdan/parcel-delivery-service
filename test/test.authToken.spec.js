import chai from 'chai';
import {encodeAuthToken, decodeAuthToken} from '../controller/models/v2AuthToken';

const should = chai.should();

describe('auth : local', () => {

  describe('encodeToken()', () => {
    it('should return a token', (done) => {
      const token = encodeAuthToken('emmsdan');
      should.exist(token);
      token.should.be.a('string');
      done();
    });
  });

  describe('decodeToken()', () => {
    it('should return a payload', (done) => {
      const token = encodeAuthToken('emmsdan');
      should.exist(token);
      token.should.be.a('string');
      decodeAuthToken(token, (err, res) => {
        should.not.exist(err);
        should.exist(res)
        console.log ('expect res', res)
        res.sub.should.eql('emmsdan');
        done();
      });
    });
  });

});