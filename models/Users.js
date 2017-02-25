"use strict";

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
      classMethods: {

      }
    });
  return user;
};