"use strict";

module.exports = function (sequelize, DataTypes) {
  let photo = sequelize.define("Photo", {
    author: {
      type: DataTypes.STRING,
    },
    link: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
  });
  return photo;
};