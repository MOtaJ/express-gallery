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
          let hash = hashPassword(password)
          this.setDataValue('password', hash)
        }
      },
      classMethods: {
        hashPassword: hashPassword

      }
    });
  return user;
};

function hashPassword (password) {
  let salt = bcrypt.genSaltSync(saltRounds);
  let hash = bcrypt.hashSync(password, salt)
  return hash;
}