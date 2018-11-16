import supertest from 'supertest';
import chai from 'chai'
import app from "../controller/server";

global.app = app;
global.expect = chai.expect;
global.request = supertest(app);

describe ( 'Parcel API Routes', () => {
  // This function will run before every test to clear database
  beforeEach( (done) => {
      done();
  });

  describe('POST /api/v1/parcel', () => {
    it('should create parcels order successfully', (done) => {
      request.post('/api/v1/parcel')
      .send ({
        userId: 3244,
        id : 1023,
        content : 'iphone 6+ with hp 665 notepad',
        weight : 23,
        pickup : 'Ikeja, Lagos Nigeria',
        destination : 'Ojota, Lagos Nigeria'
      })
      .expect(200)
      .end( (err, res) => {
        expect(res.body.message).equal('parcel order created')
        expect(res.body.countParcel).equal(1)
          done(err);
      });
    });
  });
  // In this test it's expects an object
  describe('GET /api/v1/parcel', () => {
    it('should return list of parcels as an array ', (done) => {
      request.get('/api/v1/parcel')
      .expect(200)
      .end( (err, res) => {
        expect(res.body).to.a('array')
          done(err);
      });
    });
  });
  describe('GET /api/v1/parcel/:parcelID/cancel', () => {
    it('should remove item from list', (done) => {
      request.get('/api/v1/parcel/1023/cancel')
      .expect(200)
      .end( (err, res) => {
        expect(res.body.message).equal('This Order has been deleted')
        expect(res.body.countParcel).equal(0)
          done(err);
      });
    });
  });

})
