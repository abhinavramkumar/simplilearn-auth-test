const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // static associate(models) {
    //   // define association here
    // }
  };
  User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    username: DataTypes.STRING,
    role: DataTypes.ENUM('ADMIN', 'VISITOR')
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};