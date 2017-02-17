"use strict";

module.exports = function (sequelize, DataTypes) {
  let photo = sequelize.define("photo", {
    author: {
      type: DataTypes.STRING,
    },
    link: {
      type: DataTypes.STRING(1234),
    },
    description: {
      type: DataTypes.STRING,
    }
  });
  return photo;
};