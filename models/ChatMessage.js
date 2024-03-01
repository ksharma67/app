const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');

class ChatMessage extends Model {}

ChatMessage.init({
    ChatMessageID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CommunityID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Community', 
            key: 'CommunityID',
        }
    },
    ChatMessageUserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'User', 
            key: 'UserID',
        }
    },
    ChatMessageText: {
        type: DataTypes.TEXT, 
        allowNull: false
    },
    ChatMessageDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW // Use Sequelize's NOW for default value
    },
    ChatMessageTime: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: DataTypes.NOW // Assuming you want to capture the time separately
    },
    IsAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    ParentMessageID: { 
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: {
            model: 'ChatMessage', 
            key: 'ChatMessageID',
        }
    }
}, {
    sequelize,
    modelName: 'ChatMessage',
    tableName: 'ChatMessage',
    timestamps: false
});

module.exports = ChatMessage;
