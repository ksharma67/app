const dbConfig = {
    dialect: process.env.DB_DIALECT || 'mysql', // Specifies the database dialect to be used
    host: process.env.DB_HOST || 'localhost', // Use 'localhost' for local development
    username: process.env.DB_USER || 'root', // Default to 'root' if DB_USER is not set
    password: process.env.DB_PASSWORD || 'password', // Default password, ensure consistency with actual use
    database: process.env.DB_NAME || 'app', // Default to 'app', ensure the database exists
    charset: 'utf8', // Ensures support for a wide range of characters
    // Optional: Consider additional Sequelize options for fine-tuning
    // e.g., pool configuration for connection pooling, logging for SQL query visibility
    options: {
        trustServerCertificate: true, // This option might not be needed for local development depending on your setup
    }
};

module.exports = dbConfig;
