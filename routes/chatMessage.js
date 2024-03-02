const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
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
        const limit = parseInt(req.query.limit) || 10; // Default limit
        const offset = parseInt(req.query.offset) || 0; // Default offset

        let messages = await ChatMessage.findAll({
            where: { CommunityID: req.params.id, ParentMessageID: null }, // Assuming ParentMessageID: null means it's a top-level message
            limit: limit,
            offset: offset,
            include: [
                {
                    model: User,
                    as: 'Sender',
                    attributes: ['UserName', 'UserID']
                }
            ],
            order: [['ChatMessageDate', 'DESC'], ['ChatMessageTime', 'DESC']]
        });

        // Manually append ReplyCount to each message - note this is not efficient for large datasets
        for (let message of messages) {
            const replyCount = await ChatMessage.count({
                where: { ParentMessageID: message.ChatMessageID }
            });
            message.dataValues.ReplyCount = replyCount; // Append the reply count to each message
        }

        messages = messages.map(message => {
            if (message.IsAnonymous) {
                message.Sender = { UserName: 'Anonymous', UserID: null };
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
router.get('/replies/:id', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default limit
        const offset = parseInt(req.query.offset) || 0; // Default offset

        let replies = await ChatMessage.findAll({
            where: { ParentMessageID: req.params.id },
            limit: limit,
            offset: offset,
            include: [
                {
                    model: User,
                    as: 'Sender',
                    attributes: ['UserName', 'UserID']
                }
            ],
            order: [['ChatMessageDate', 'DESC'], ['ChatMessageTime', 'DESC']]
        });

        replies = replies.map(reply => {
            if (reply.IsAnonymous) {
                reply.Sender = { UserName: 'Anonymous', UserID: null };
            }
            return reply;
        });

        res.json(replies);
    } catch (error) {
        console.error('Error fetching chat message replies:', error);
        res.status(500).send('Internal server error');
    }
});

// Search for chat messages within a community by text
router.get('/community/:id/search', async (req, res) => {
    try {
        const { searchTerm } = req.query; // Get the search term from query parameters
        const communityId = req.params.id; // Get the community ID from the URL parameters

        if (!searchTerm) {
            return res.status(400).send('Search term is required');
        }

        const messages = await ChatMessage.findAll({
            where: {
                CommunityID: communityId,
                ChatMessageText: {
                    [Op.like]: `%${searchTerm}%` // Use the Op.like operator for partial text search
                }
            },
            include: [
                {
                    model: User,
                    as: 'Sender',
                    attributes: ['UserName', 'UserID']
                }
            ],
            order: [['ChatMessageDate', 'DESC'], ['ChatMessageTime', 'DESC']]
        });

        res.json(messages);
    } catch (error) {
        console.error('Error searching for chat messages:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
