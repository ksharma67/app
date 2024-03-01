const express = require('express');
const router = express.Router();
const { ChatMessage, User } = require('../models');

// Post a new chat message
router.post('/', async (req, res) => {
    try {
        const message = await ChatMessage.create({
            ChatMessageText: req.body.ChatMessageText,
            ChatMessageDate: new Date(), // Assuming you handle the date on the server-side
            ChatMessageTime: new Date(), // This could be adjusted based on your needs
            ChatMessageUserID: req.body.ChatMessageUserID,
            CommunityID: req.body.CommunityID
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
        const messages = await ChatMessage.findAll({
            where: { CommunityID: req.params.id },
            include: [{
                model: User,
                as: 'Sender', // This alias must match the one defined in the association
                attributes: ['UserName']
            }]
        });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
