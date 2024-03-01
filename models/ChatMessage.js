const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

class ChatMessage extends Model {}

ChatMessage.init({
    ChatMessageID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ChatMessageText: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    ChatMessageDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    ChatMessageTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    ChatMessageUserID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'ChatMessage',
    tableName: 'ChatMessage',
    timestamps: false
});

module.exports = ChatMessage;