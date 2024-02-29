const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

class User extends Model {}

User.init({
    UserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    UserEmail: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    UserPassword: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    UserImage: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'User',
    timestamps: false
});

module.exports = User;