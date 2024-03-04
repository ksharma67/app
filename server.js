// Initialize the server and connect to the database
const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path'); 
const sequelize = require('./database/database.js');
const dbConfig = require('./database/config.js');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

// Ensure the 'dotenv' package is loaded at the beginning of your application
require('dotenv').config();

// Print the database host  
console.log(`Database Host: ${process.env.DB_HOST}`);
console.log(`Database User: ${process.env.DB_USER}`);
console.log(`Database Password: ${process.env.DB_PASSWORD}`);
console.log(`Database Name: ${process.env.DB_NAME}`);

// Function to read the SQL files
function readSqlFiles(dirPath) {
    const files = fs.readdirSync(dirPath);
    return files.filter(file => path.extname(file) === '.sql').map(file => {
        const filePath = path.join(dirPath, file);
        return fs.readFileSync(filePath, { encoding: 'utf-8' });
    });
}

// Function to disable caching
function noCache(req, res, next) {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    next();
}

// Function to execute SQL queries from the files
async function runSqlFiles(dirPath) {
    try {
        const sqlFiles = readSqlFiles(dirPath);
        for (let fileContent of sqlFiles) {
            const queries = fileContent.split(';');
            for (let query of queries) {
                query = query.trim();
                if (query) {
                    await sequelize.query(query);
                }
            }
        }
    } catch (err) {
        console.error('Error executing SQL files:', err);
    }
}

// Function to disable foreign key checks
async function disableForeignKeyChecks() {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
}

// Function to re-enable foreign key checks
async function enableForeignKeyChecks() {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
}

// Function to check if the database is ready and recreate tables
async function checkDatabaseConnection() {
    let retries = 5;
    while (retries) {
        try {
            await sequelize.authenticate();
            console.log('Connection to DB successful!');

            // Disable foreign key checks
            await disableForeignKeyChecks();

            // Drop and recreate the tables using Sequelize sync
            await sequelize.sync({ force: true });
            console.log('Tables dropped and recreated successfully!');

            // Re-enable foreign key checks
            await enableForeignKeyChecks();

            return;
        } catch (err) {
            console.error('Database operation failed, retrying...', err);
            retries -= 1;
            await new Promise(res => setTimeout(res, 5000)); // wait for 5 seconds before retry
        }
    }
    throw new Error('Could not connect to the database');
}

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

// Routes
const communityRoutes = require('./routes/community.js');
const userRoutes = require('./routes/user.js');
const chatMessageRoutes = require('./routes/chatMessage.js');
const communityUserRoutes = require('./routes/communityUser.js');

// Middleware
app.use(express.json());
app.use(morgan('combined'));


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong' });
});

// Routes
app.use('/api/community', communityRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chatMessage', chatMessageRoutes);
app.use('/api/communityUser', communityUserRoutes);

// Start the server with database initialization
const PORT = process.env.PORT || 3000;
const sqlDir = path.join(__dirname, './database'); // Adjust this path as necessary

// Start the server with database initialization
checkDatabaseConnection()
    .then(() => runSqlFiles(sqlDir))
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch(err => {
        console.error('Failed to start the server:', err);
    });

// Print the database host
console.log('Database host:', process.env.DB_HOST || 'default-host');

// Print the JWT secret
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (token == null) return res.sendStatus(401); // if there's no token
    console.log('JWT SECRET:', JWT_SECRET);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // if the token is invalid
        req.user = user;
        next(); // proceed to the next middleware/function
    });
};