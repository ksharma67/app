const express = require('express');
const router = express.Router();
const { Community } = require('../models');

// GET all Communities
router.get('/', async (req, res) => {
    try {
        const communities = await Community.findAll(); // Changed variable name to communities
        res.json(communities);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// GET a single Community
router.get('/:id', async (req, res) => {
    try {
        const community = await Community.findByPk(req.params.id); // Changed variable name to community
        if (community) {
            res.json(community);
        } else {
            res.status(404).send('Community not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// POST a new Community
router.post('/', async (req, res) => {
    try {
        const newCommunity = await Community.create(req.body); // This is fine as it's a new community being created
        res.json(newCommunity);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// DELETE a Community
router.delete('/:id', async (req, res) => {
    try {
        const community = await Community.findByPk(req.params.id); // Changed variable name to community
        if (community) {
            await community.destroy();
            res.json(community);
        } else {
            res.status(404).send('Community not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
