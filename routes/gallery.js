const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('./../models');
const { User } = db;
const { Photo } = db;
/*console.log("photos", Photo.findAll);*/
router.use(bodyParser.urlencoded({extended : true}))
router.use(bodyParser.json());

let username;
let loggedIn = false;

function isAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
    username = req.user.username;
    next();
  } else {
    console.log('NOPE')
    res.redirect('login')
  }
}

router.get('/', (req, res) => {
  if(req.user) {
    username = req.user.username,
    loggedIn = true;
  }
  Photo.findAll({order: "id"})
  .then(function(photos) {
    res.render('index', {photos : photos, username : username, loggedIn : loggedIn});
  });
});

/*router.get('/users', isAuthenticated, (req, res) => {
  User.findAll()
  .then(function(users) {
    res.render('index', {users : users});
  })
})*/

router.get('/newUser', (req, res) => {
  res.render('create_user', {loggedIn : false});
});

router.get('/new', (req, res) => {
  res.render('new');
});

router.get('/login', (req, res) => {
  console.log("here")
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/gallery',
  failureRedirect: '/gallery/login'
}));

router.get('/logout', isAuthenticated, (req, res) => {
  loggedIn = false;
  req.logout();

  res.redirect(303, '/gallery')
});


router.post('/new', isAuthenticated, (req, res) => {
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
  .then(function(photos) {console.log(loggedIn);
    res.render('photo', {photos : photos, loggedIn : loggedIn, username : username});
  });
});

router.get('/:id/edit', (req, res) => {
  Photo.findById(`${req.params.id}`)
  .then(function(photos) {
    res.render('edit', {photos : photos, loggedIn : loggedIn, username : username});
  });
});

router.post('/newUser', (req, res) => {
  req.body.username;
  req.body.password;
      return User.create({
        username: req.body.username,
        password: req.body.password
      }).then( _ => {
        res.redirect('/gallery/login');
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

router.put('/:id', isAuthenticated, (req, res) => {
  Photo.update({
    author: req.body.author,
    link: req.body.link,
    description: req.body.description
  },
  {where: {id: `${req.params.id}`}})
  .then(function(photos) {
    res.redirect('/gallery/' + req.params.id);
  });
});

router.delete('/:id', (req, res) => {
  Photo.destroy({where: {id: `${req.params.id}`}})
  .then(function() {
    res.redirect(303, '/gallery');
  })
})

router.get('/secret', isAuthenticated, (req, res) => {
  res.render('secret')
})

module.exports = router;