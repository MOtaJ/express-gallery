const express = require('express');
let app = express();
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const CONFIG = require('./config/config.json');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const PORT = process.env.PORT || 4000;
const db = require('./models');
const { Photo } = db;
const { User } = db;
const gallery = require('./routes/gallery.js');

/*const Sequelize = require('sequelize');
const sequelize = new Sequelize('express_gallery', 'markota', null, { username: 'markota',
  password: null,
  database: 'express_gallery',
  host: '127.0.0.1',
  dialect: 'postgres' });

let User = sequelize.define('User', {
  username: Sequelize.STRING,
  birthday: Sequelize.DATE
});

sequelize.sync().then(function() {
  return User.create({
    username: 'janedoe',
    birthday: new Date(1980, 6, 20)
  });
}).then(function(jane) {
  console.log(jane.get({
    plain: true
  }));
});*/
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());
app.use(session({
  store: new RedisStore(),
  secret: CONFIG.SESSION_SECRET,
  resave: false
}))

app.use(passport.initialize());
app.use(passport.session());

/*app.use(session({secret: "Something"}));*/

/*const authenticate = (username, password) => {
  // get user data from the DB
  const { USERNAME } = CONFIG; //destructuring
  const { PASSWORD } = CONFIG;

  // check if the user is authenticated or not
  return ( username === USERNAME && password === PASSWORD );
};*/

passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log('username, password: ', username, password);
    // check if the user is authenticated or not
    User.findOne({
      where: {
        username : username
      }
    })
    .then(function(user){
      if (user === null){
        console.log('no user inputted')
        return done(null, false, {message: 'no user found'})
      } else { //"password" was password given in the form.  "user.password" is the password found in the database"

        bcrypt.compare(password, user.password).then(res => {
        if (res) {
          return done(null, user)
        } else {
          return done(null, false, {message: 'incorrect password'})
        }
      });
     }
    }).catch(err => {
      console.log(err)
    })
  }
))

passport.serializeUser(function(user, done) {
  return done(null, {
    id: user.id,
    username: user.username
  });
});

passport.deserializeUser(function(user, done) {
  User.findOne({
    where: {
      id: user.id,
    }
  })
  .then(function(user){
    return done(null, user)
  });

});

const hbs = handlebars.create(
  {
    extname: '.hbs',
    defaultLayout: 'app'
  }
);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use('/gallery', gallery);


app.listen(PORT, () => {
  db.sequelize.sync();
});