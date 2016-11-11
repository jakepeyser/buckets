const db  = require('../server/db');
const Goal  = require('../server/db/models/goal');
const Bluebird  = require('bluebird');

const chai  = require('chai');
chai.use(require('chai-things'));
chai.use(require('chai-properties'));
const expect = chai.expect;

describe('Goal Model', () => {
  before('wait for the db', function(done) {
    db.didSync
      .then(() => {
        Bluebird.all([
          Goal.create({
            name: 'Test Goal 1'
          }),
          Goal.create({
            name: 'Test Goal 2'
          }),
          Goal.create({
            name: 'Test Goal 3'
          })
        ])
        .then(() => done())
        .catch(done);
      })
  });

  after('clear db', () => db.didSync)

  describe('data validation', () => {
    it('throws an error for invalid name', (done) => {
      let goal = Goal.build({
      });

      goal.validate()
      .then(err => {
        expect(err).to.be.an('object');
        expect(err).to.be.an.instanceOf(Error);
        expect(err.errors[0]).to.have.properties({
          path: 'name',
          type: 'notNull Violation'
        });
        done();
      })
      .catch(done);
    })

    it('throws an error for invalid price ranges', (done) => {
      let goal1 = Goal.build({
        name: 'Price Range Too Low',
        price_range: 0
      });
      let goal2 = Goal.build({
        name: 'Price Range Too High',
        price_range: 5
      });

      Bluebird.all([ goal1.validate(), goal2.validate()])
      .then(errs => {
        errs.forEach(err => {
          expect(err).to.be.an('object');
          expect(err).to.be.an.instanceOf(Error);
          expect(err.errors[0]).to.have.properties({
            path: 'price_range',
            type: 'Validation error'
          });
        })
        done();
      })
      .catch(done);
    })

    it('throws errors for invalid lat/lon', (done) => {
      let goal1 = Goal.build({
        name: 'Lat/Lon Too Low',
        lat: -91,
        lon: -181
      });
      let goal2 = Goal.build({
        name: 'Lat/Lon Too High',
        lat: 91,
        lon: 181
      });

      Bluebird.all([ goal1.validate(), goal2.validate()])
      .then(errs => {
        errs.forEach(err => {
          expect(err).to.be.an('object');
          expect(err).to.be.an.instanceOf(Error);
          expect(err.errors[0]).to.have.properties({
            path: 'lat',
            type: 'Validation error'
          });
          expect(err.errors[1]).to.have.properties({
            path: 'lon',
            type: 'Validation error'
          });
        })
        done();
      })
      .catch(done);
    })

    it('throws an error for invalid banner picture url', (done) => {
      let goal1 = Goal.build({
        name: 'Test Goal 1',
        banner_pic_url: ''
      });
      let goal2 = Goal.build({
        name: 'Test Goal 2',
        banner_pic_url: 'im_not_valid'
      });

      Bluebird.all([ goal1.validate(), goal2.validate()])
      .then(errs => {
        errs.forEach(err => {
          expect(err).to.be.an('object');
          expect(err).to.be.an.instanceOf(Error);
          expect(err.errors[0]).to.have.properties({
            path: 'banner_pic_url',
            type: 'Validation error'
          });
        })
        done();
      })
      .catch(done);
    })
  })
})

