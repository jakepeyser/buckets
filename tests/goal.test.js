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
        first_name: null
      });

      goal.validate()
      .then(err => {
        console.log(err.errors)
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
  })
})

