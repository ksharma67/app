// models/index.js
const User = require('./User.js');
const Community = require('./Community.js');
const CommunityUser = require('./CommunityUser.js');
const ChatMessage = require('./ChatMessage.js');

// User to CommunityUser
User.hasMany(CommunityUser, { foreignKey: 'CommunityUserUserID' });
CommunityUser.belongsTo(User, { foreignKey: 'CommunityUserUserID' });

// Community to CommunityUser
Community.hasMany(CommunityUser, { foreignKey: 'CommunityUserCommunityID' });
CommunityUser.belongsTo(Community, { foreignKey: 'CommunityUserCommunityID' });

// User to ChatMessage
User.hasMany(ChatMessage, { foreignKey: 'ChatMessageUserID', as: 'Messages' }); // Example alias
ChatMessage.belongsTo(User, { foreignKey: 'ChatMessageUserID', as: 'Sender' }); // Matching alias for the reverse association

// Community to ChatMessage
Community.hasMany(ChatMessage, { foreignKey: 'CommunityID' });
ChatMessage.belongsTo(Community, { foreignKey: 'CommunityID' });

// ChatMessage self-referencing for replies
ChatMessage.hasMany(ChatMessage, { foreignKey: 'ParentMessageID', as: 'Replies' }); // Association for a message to have replies
ChatMessage.belongsTo(ChatMessage, { foreignKey: 'ParentMessageID', as: 'ParentMessage' }); // Association for a reply to reference its parent message

// Import other models here
module.exports = {
    User,
    Community,
    CommunityUser,
    ChatMessage
    // Export other models here
};
