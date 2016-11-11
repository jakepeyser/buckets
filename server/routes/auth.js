const db = require('../db');
const User = db.model('user');
const router = require('express').Router();

// --------------------> '/auth/' <-----------------------

// Sign up and create a new user
router.post('/signup', (req, res, next) => {
  User.create({
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    email: req.body.email,
    password: req.body.password
  })
    .then(user => {
      req.session.userId = user.id;
      res.status(201).send(user)
    })
    .catch(next);
});

// Login to an existing account
router.post('/login', (req, res, next) => {
  User.findOne({
    where: { email: req.body.email }
  })
    .then(user => {
      // Check if input email not found
      if (!user) {
        let error = new Error('User not found');
        error.status = 401;
        return next(error);
      }

      // Check if input password matches
      return user.authenticate(req.body.password)
        .then(valid => {
          if (!valid) {
            let error = new Error('Incorrect password');
            error.status = 401;
            return next(error)
          }

          req.session.userId = user.id;
          res.send(user);
        })
    })
    .catch(next);
});

// Logout of your current session
router.delete('/logout', (req, res, next) => {
  req.session.destroy();
  res.sendStatus(204);
});

// Reestablish account on front end
router.get('/me', (req, res, next) => {
  User.findById(req.session.userId)
  .then(user => res.send(user))
  .catch(next);
});

module.exports = router;
