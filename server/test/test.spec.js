import supertest from 'supertest';
import chai from 'chai'
import app from "../controller/server";

global.app = app;
global.expect = chai.expect;
global.request = supertest(app);

describe ( 'Parcel API Routes', () => {
  beforeEach( (done) => {
      done();
  });

  describe('POST /api/v1/parcel', () => {
    it('should create parcels order successfully', (done) => {
      request.post('/api/v1/parcel')
      .type ('form')
      .send ({
        userId: 3244,
        content : 'iphone 6+ with hp 665 notepad',
        weight : 23,
        pickup : 'Ikeja, Lagos Nigeria',
        destination : 'Ojota, Lagos Nigeria',
        destinationcode: 123
      })
      .set('Accept', /application\/json/)
      .expect(200)
      .end( (err, res) => {
        expect(res.body.message).equal('new order created')
          done(err);
      });
    });
  });
  
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


  describe('GET /api/v1/parcel/:parcelID', () => {
    it('should get single parcel order', (done) => {
      request.get ('/api/v1/parcel')
      .expect(200)
      .end ( (err, res ) => {
        request.get(`/api/v1/parcel/${res.body[0].id}`)
        .expect(200)
        .end( (err, res) => {
          expect(res.body)
          .to.a('object')
            done(err);
        });
      })
    });
  });

  describe('PUT /api/v1/parcel/:parcelID/cancel', () => {
    it('cannot change status of an Item that does not exist to cancel', (done) => {
      request.put('/api/v1/parcel/1023/cancel')
      .expect(200)
      .end( (err, res) => {
        expect(res.body.message)
        .equal('parcel not found')
          done(err);
      });
    });
  });

  describe('PUT /api/v1/parcel/:parcelID/cancel', () => {
    it('should change status of the order to cancelled', (done) => {
      request.get ('/api/v1/parcel')
      .expect(200)
      .end ( (err, res ) => {
        request.put(`/api/v1/parcel/${res.body[0].id}/cancel`)
        .expect(200)
        .end( (err, res) => {
          expect(res.body.message)
          .equal('This parcel has be canceled')
            done(err);
        });
      })
    });
  });

  describe('GET /api/v1/users/:userId/parcels', () => {
    it('should return an array of users parcels', (done) => {
      request.get('/api/v1/users/3244/parcels')
      .expect(200)
      .end( (err, res) => {
        expect(res.body).to.a('array')
          done(err);
      });
    });
  });

})
