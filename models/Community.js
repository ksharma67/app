const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

class Community extends Model {}

Community.init({
    CommunityID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CommunityName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    CommunityImage: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Community',
    tableName: 'Community',
    timestamps: false
});

module.exports =  Community;
