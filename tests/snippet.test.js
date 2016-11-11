const db  = require('../server/db');
const Goal  = require('../server/db/models/goal');
const Snippet  = require('../server/db/models/snippet');
const Bluebird  = require('bluebird');

const chai  = require('chai');
chai.use(require('chai-things'));
chai.use(require('chai-properties'));
const expect = chai.expect;

describe('Snippet Model', () => {
  before('wait for the db', function(done) {
    db.didSync
      .then(() => {
        Bluebird.all([
          Goal.create({
            name: 'Test Goal',
            price_range: 3,
            location: 'New York, NY',
            lat: 40.7127,
            lon: -74.0059,
            date: new Date(),
            snippets: [
              {
                title: 'Overview',
                description: 'Normally, both your asses would be dead as fucking fried chicken, but you happen to pull this shit while I\'m in a transitional period so I don\'t wanna kill you, I wanna help you. But I can\'t give you this case, it don\'t belong to me. Besides, I\'ve already been through too much shit this morning over this case to hand it over to your dumb ass.'
              }, {
                title: 'Where to go',
                description: 'The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother\'s keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee.'
              }
            ]
          }, {
            include: [ Snippet ]
          })
        ])
        .then(() => done())
        .catch(done);
      })
  });

  after('clear db', () => db.didSync)

  describe('data validation', () => {
    it('throws an error for required fields', (done) => {
      let snippet = Snippet.build({
      });

      snippet.validate()
      .then(err => {
        expect(err).to.be.an('object');
        expect(err).to.be.an.instanceOf(Error);
        const required = ['title', 'description']
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
  })

  describe('class methods', () => {
    describe('getGoalSnippets(goalId) ~> Snippets', () => {
      it('returns all the snippets for one goal', (done) => {
        const titles = ['Overview', 'Where to go'];
        Goal.findOne({where: {name: 'Test Goal'}})
          .then(goal => Snippet.getGoalSnippets(goal.id))
          .then(snippets => {
            expect(snippets.map(snip => snip.title)).to.have.members(titles);
            done();
          })
          .catch(done);
      })
    })
  })
})

