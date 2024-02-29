const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

// Middleware to authenticate and extract user ID from token
const authenticate = (req, res, next) => {
    // Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('Access Denied: No token provided.');
    }

    // Extract token from Authorization header
    const token = authHeader.split(' ')[1]; // Assumes Bearer token format

    try {
        // Verify and decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id; // Attach user ID to request object
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).send('Token expired');
        } else if (err instanceof jwt.JsonWebTokenError) {
            return res.status(401).send('Invalid token');
        } else {
            console.error('Token verification error:', err);
            return res.status(500).send('Internal Server Error');
        }
    }
};

// GET user details
router.get('/me', authenticate, async (req, res) => {
    try {
        // Ensure req.userId contains the numeric ID, not the string 'me'
        console.log('Extracted UserID:', req.userId);
        const user = await User.findByPk(req.userId); // Use extracted user ID
        if (!user) {
            return res.status(404).send('User not found');
        }
        const { UserPassword, ...userWithoutPassword } = user.get({ plain: true });
        res.json(userWithoutPassword);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

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
    console.log(req.userId);
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { UserEmail: email } });
        
        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.UserPassword);
        
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.UserID }, // Ensure this matches your database schema
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token }); // Send the token to the client
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
            UserImage: UserImage || 'default/path/to/image.jpg'
        });

        // Generate JWT Token for the new user
        const token = jwt.sign(
            { id: newUser.UserID }, // Make sure you use the correct property for the user ID
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respond with the token (and potentially other user info excluding the password)
        res.json({
            token,
            user: {
                UserID: newUser.UserID,
                UserName: newUser.UserName,
                UserEmail: newUser.UserEmail,
                UserImage: newUser.UserImage
            }
        });
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