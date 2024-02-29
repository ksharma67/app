const Sequelize = require('sequelize');
const dbConfig = require('./config');  // Adjust the path as necessary

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    define: {
        charset: dbConfig.charset,
        timestamps: false
        // Define other model-wide settings here
    },
    // Other Sequelize options as needed
});

// Test the database connection
sequelize.authenticate()
    .then(() => console.log('Database connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
