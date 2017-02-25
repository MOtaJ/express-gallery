const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('./../models');
const { User } = db;
const { Photo } = db;
const bcrypt = require('bcrypt');
const saltRounds = 10;
/*console.log("photos", Photo.findAll);*/
router.use(bodyParser.urlencoded({extended : true}))
router.use(bodyParser.json());

function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log('NOPE')
    res.redirect('/login')
  }
}

router.get('/', (req, res) => {
  Photo.findAll({order: "id"})
  .then(function(photos) {
    res.render('index', {photos : photos});
  });
});

router.get('/users', (req, res) => {
  User.findAll()
  .then(function(users) {
    res.render('index', {users : users});
  })
})

router.get('/newUser', (req, res) => {
  res.render('create_user');
});

router.get('/new', (req, res) => {
  res.render('new');
});

router.get('/login', (req, res) => {
  console.log("here")
  res.render('login');
});

router.post('/new', (req, res) => {
  Photo.create({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  })
  .then(function() {
    res.redirect(303, '/gallery');
  })
});

router.get('/:id', (req, res) => {
  Photo.findById(`${req.params.id}`)
  .then(function(photos) {
    res.render('index', {photos : photos});
  });
});

router.post('/newUser', (req, res) => {
  req.body.username;
  req.body.password;

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
    console.log('hash', hash)
      User.create({
        username: req.body.username,
        password: hash
      }).then( _ => {
        res.redirect('/gallery');
      })
    })
  })
})

/*router.post('/create_user', (req, res) => {
  console.log(req.body);
  User.create({
    username: req.body.username,
    password: req.body.password
  })
  .then( function() {
    res.redirect(303, '/gallery');
  })
})*/

router.post('/login', passport.authenticate('local', {
  successRedirect: '/gallery',
  failureRedirect: '/gallery/login'
}));

router.put('/edit/:id', (req, res) => {
  Photo.update({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  },
  {where: {id: `${req.params.id}`}})
  .then(function() {
    res.redirect(303, `/gallery/${req.params.id}`);
  });
});

router.delete('/delete/:id', (req, res) => {
  Photo.destroy({where: {id: `${req.params.id}`}})
  .then(function() {
    res.redirect(303, '/gallery');
  })
})

router.get('/secret', isAuthenticated, (req, res) => {
  res.render('secret')
})

module.exports = router;