const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// GET all Users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll(); // Changed variable name to users
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// GET a single User
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id); // Changed variable name to user
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// GET user details by ID
router.get('/:id/details', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// POST a new User
router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body); // This is fine as it's a new user being created
        res.json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// POST login a User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { UserEmail: email } });
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Verify password using bcrypt
        const isMatch = await bcrypt.compare(password, user.UserPassword);
        
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Here, instead of sending the user object directly,
        // you'd typically generate a token (e.g., JWT) and send that back
        // For simplicity, this example just sends the user's info minus the password
        const { UserPassword, ...userWithoutPassword } = user.dataValues;
        
        res.json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// POST signup a new User
router.post('/signup', async (req, res) => {
    try {
        const { UserName, UserEmail, UserPassword, UserImage } = req.body;
        // Check for existing user
        console.log("Request body:", req.body);
        console.log("Extracted UserEmail:", req.body.UserEmail);
        const existingUser = await User.findOne({ where: { UserEmail } });
        if (existingUser) {
            return res.status(409).send('Email already in use');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(UserPassword, 10);

        // Create user
        const newUser = await User.create({
            UserName,
            UserEmail,
            UserPassword: hashedPassword,
            UserImage: UserImage || 'default/path/to/image.jpg' // Provide a default image path if none is provided
        });

        // Exclude password from the response, renaming UserPassword to avoid conflict
        const userWithoutPassword = newUser.get({ plain: true });
        delete userWithoutPassword.UserPassword;
        
        res.json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


// UPDATE a User
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id); // Changed variable name to user
        if (user) {
            await user.update(req.body);
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// DELETE a User
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id); // Changed variable name to user
        if (user) {
            await user.destroy();
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;