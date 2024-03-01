const express = require('express');
const router = express.Router();
const { ChatMessage, User } = require('../models');

// Post a new chat message
router.post('/', async (req, res) => {
    try {
        // Include ParentMessageID in the creation, which might be undefined if not provided
        const message = await ChatMessage.create({
            ChatMessageText: req.body.ChatMessageText,
            ChatMessageDate: new Date(),
            ChatMessageTime: new Date(),
            ChatMessageUserID: req.body.ChatMessageUserID,
            CommunityID: req.body.CommunityID,
            IsAnonymous: req.body.IsAnonymous,
            ParentMessageID: req.body.ParentMessageID || null // Include this for replies
        });
        res.status(201).json(message);
    } catch (error) {
        console.error('Error posting chat message:', error);
        res.status(500).send('Internal server error');
    }
});

// Get all chat messages for a community, including user details
router.get('/community/:id', async (req, res) => {
    try {
        let messages = await ChatMessage.findAll({
            where: { CommunityID: req.params.id },
            include: [
                {
                    model: User,
                    as: 'Sender', // Matching the alias in the model association
                    attributes: ['UserName', 'UserID'] // Include UserID always, UserName conditionally
                },
                {
                    model: ChatMessage,
                    as: 'Replies',
                    include: [{ // Optionally include sender details for replies as well
                        model: User,
                        as: 'Sender',
                        attributes: ['UserName', 'UserID']
                    }]
                }
            ]
        });

        // Optionally process messages to anonymize based on IsAnonymous flag
        // Note: This simple example doesn't alter the structure of replies
        messages = messages.map(message => {
            if (message.IsAnonymous) {
                message.Sender = { UserName: 'Anonymous', UserID: null }; // Adjust for anonymity
            }
            return message;
        });

        res.json(messages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).send('Internal server error');
    }
});

// Get replies for a specific chat message
router.get('/replies/:messageId', async (req, res) => {
    try {
        const messageId = req.params.messageId;
        let replies = await ChatMessage.findAll({
            where: { ParentMessageID: messageId },
            include: [{
                model: User,
                as: 'Sender',
                attributes: ['UserName', 'UserID']
            }]
        });

        res.json(replies);
    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
