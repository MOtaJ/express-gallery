"use strict";
const bcrypt = require('bcrypt');
const saltRounds = 10;


module.exports = function (sequelize, DataTypes) {
  let user = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Sorry, you need a username to log in"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Password was either incorrect or empty"
        }
      }
    }
  }, {
      setterMethods: {
        password: function (password) {
          let hash = hashPassword(password);
          this.setDataValue('password', has)
        }
      },
      classMethods: {
        hashPassword: hashPassword

      }
    });
  return user;
};

function hashPassword (password) {
  return bcrypt.compare(password, User.password).then(res => {
    if (res) {
      return done(null, user)
    } else {
      return done(null, false, {message: 'incorrect password'})
    }
  })
}