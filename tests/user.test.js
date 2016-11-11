const db  = require('../server/db');
const User  = require('../server/db/models/user');
const Bluebird  = require('bluebird');

const chai  = require('chai');
chai.use(require('chai-things'));
chai.use(require('chai-properties'));
const expect = chai.expect;

describe('User Model', () => {
  before('wait for the db', function(done) {
    db.didSync
      .then(() => {
        Bluebird.all([
          User.create({
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            password: '123',
            private: false,
            profile_pic_url: 'http://s3.amazonaws.com/37assets/svn/765-default-avatar.png',
            location: 'Austin, TX'
          })
        ])
        .then(() => done())
        .catch(done);
      })
  });

  after('clear db', () => db.didSync)

  describe('data validation', () => {
    it('throws an error for required fields', (done) => {
      let user = User.build({
      });

      user.validate()
      .then(err => {
        expect(err).to.be.an('object');
        expect(err).to.be.an.instanceOf(Error);
        const required = ['first_name', 'last_name', 'email']
        const nullFields = [];
        err.errors.forEach(error => {
          expect(error).to.have.property('type', 'notNull Violation');
          nullFields.push(error.path);
        })
        expect(nullFields).to.have.members(required);
        done();
      })
      .catch(done);
    })

    it('throws an error for invalid profile picture url', (done) => {
      let user1 = User.build({
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password: '123',
        profile_pic_url: ''
      });
      let user2 = User.build({
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password: '123',
        profile_pic_url: 'im_not_a_url'
      });

      Bluebird.all([ user1.validate(), user2.validate()])
      .then(errs => {
        errs.forEach(err => {
          expect(err).to.be.an('object');
          expect(err).to.be.an.instanceOf(Error);
          expect(err.errors[0]).to.have.properties({
            path: 'profile_pic_url',
            type: 'Validation error'
          });
        })
        done();
      })
      .catch(done);
    })
  })

  describe('instance methods', () => {
    describe('authenticate(plaintext: String) ~> Boolean', () => {
      it('resolves true if the password matches', (done) => {
        User.findOne({where: {email: 'johndoe@example.com'}})
          .then(user => user.authenticate('123'))
          .then(result => {
            expect(result).to.be.true;
            done();
          })
          .catch(done);
      })

      it("resolves false if the password doesn't match", (done) => {
        User.findOne({where: {email: 'johndoe@example.com'}})
          .then(user => user.authenticate('blah'))
          .then(result => {
            expect(result).to.be.false;
            done();
          })
          .catch(done);
      })
    })

    describe('fullName() ~> String', () => {
      it('returns the concatenated full name', (done) => {
        User.findOne({where: {email: 'johndoe@example.com'}})
          .then(user => {
            expect(user.fullName()).to.equal('John Doe');
            done();
          })
          .catch(done);
      })
    })
  })
})

