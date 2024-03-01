const express = require('express');
const router = express.Router();
const { CommunityUser, Community, User } = require('../models');

// Add a user to a community
router.post('/', async (req, res) => {
    try {
        const communityUser = await CommunityUser.create({
            CommunityUserCommunityID: req.body.CommunityUserCommunityID,
            CommunityUserUserID: req.body.CommunityUserUserID
        });
        res.status(201).json(communityUser);
    } catch (error) {
        console.error('Error adding user to community:', error);
        res.status(500).send('Internal server error');
    }
});

// Get all users in a community
router.get('/community/:id', async (req, res) => {
    try {
        const users = await CommunityUser.findAll({
            where: { CommunityUserCommunityID: req.params.id },
            include: [{ model: User, attributes: ['UserName', 'UserEmail'] }]
        });
        res.json(users);
    } catch (error) {
        console.error('Error fetching users in community:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
