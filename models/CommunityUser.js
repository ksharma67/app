const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

class CommunityUser extends Model {}

CommunityUser.init({
    CommunityUserID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CommunityUserCommunityID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    CommunityUserUserID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'CommunityUser',
    tableName: 'CommunityUser',
    timestamps: false
});

module.exports = CommunityUser;