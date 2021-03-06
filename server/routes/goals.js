const db = require('../db');
const Goal = db.model('goal');
const User = db.model('user');
const Snippet = db.model('snippet');
const Bucket = db.model('bucket');
const Picture = db.model('picture');
const Story = db.model('story');
const router = require('express').Router();

// --------------------> '/goals/' <-----------------------

// Retrieve all goals
router.get('/', (req, res, next) => {
  // Allow queries on category
  const where = {};
  if (req.query.category) where.category_id = Number(req.query.category)

  // Find all goals and their associated 'likes'
  Goal.findAll({
    where,
    include: [{ model: User, attributes: ['id'] }]
  })
  .then(goals => {
    // Calculate the likes and remove associated users
    goals.forEach(goal => {
      // Check if the logged in user has liked this goal
      goal.dataValues.liked =
        goal.users.find(user => user.id === req.session.userId) !== undefined ? true : false;

      goal.dataValues.likes = goal.users.length;
      delete goal.dataValues.users;
    })
    res.send(goals)
  })
  .catch(next);
});

// -------------------> '/goals/:goalId' <---------------------

// Retrieve a single goal
router.get('/:goalId', (req, res, next) => {
  Goal.findOne({
    where: { id: req.params.goalId },
    include: [{ model: User, attributes: ['id'] },
              { model: Snippet, attributes: ['id', 'title', 'description'] },
              { model: Bucket, attributes: ['id', 'status'], include: [
                { model: Picture, attributes: ['id', 'picture_url'] },
                { model: Story, attributes: ['id', 'title', 'comment', 'rating'], include: [
                  { model: User, attributes: ['id', 'first_name', 'last_name', 'profile_pic_url'] }
                ]}
              ]}]
  })
  .then(goal => {
    // Calculate the added and completed buckets
    goal.dataValues.added = goal.buckets
      .filter(bucket => bucket.status === 'in_progress').length;
    goal.dataValues.completed = goal.buckets
      .filter(bucket => bucket.status === 'completed').length;
    // Calculate the likes, remove associated users, and
    goal.dataValues.likes = goal.users.length;

    // Check if the logged in user has liked this goal
    goal.dataValues.liked =
      goal.users.find(user => user.id === req.session.userId) !== undefined ? true : false;

    // Map pictures back to flat array
    goal.dataValues.pictures = goal.buckets
      .map(bucket => bucket.pictures)
      .reduce((pics, curPics) => [...pics, ...curPics], []);

    // Map stories back to flat array
    goal.dataValues.stories = goal.buckets
      .map(bucket => bucket.stories)
      .reduce((allStories, curStories) => [...allStories, ...curStories], []);

    // Remove values front end does not need
    delete goal.dataValues.buckets;
    delete goal.dataValues.users;
    return res.send(goal)
  })
  .catch(next);
});

// Get the goal from the DB and place on req object
// router.param('goalId', (req, res, next, theGoalId) => {
//   Goal.findById(theGoalId)
//     .then(goal => {
//       req.goal = goal;
//       return next();
//     })
//     .catch(next);
// });

// -----------------> '/goals/:goalId/like' <-------------------

// Like a goal
router.post('/:goalId/like', (req, res, next) => {
  if (!req.session.userId) {
    let error = new Error('You must be logged in to like a goal');
    error.status = 401;
    return next(error)
  }

  return User.findById(req.session.userId)
  .then(user => user.addGoal(req.params.goalId))
  .then(() => res.sendStatus(201))
  .catch(next);
});

// Unlike a goal
router.delete('/:goalId/like', (req, res, next) => {
  if (!req.session.userId) {
    let error = new Error('You must be logged in to unlike a goal');
    error.status = 401;
    return next(error)
  }

  return User.findById(req.session.userId)
  .then(user => user.removeGoal(req.params.goalId))
  .then(() => res.sendStatus(204))
  .catch(next);
});

module.exports = router;
