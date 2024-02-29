-- Creating a table named User
CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(100) NOT NULL,
    UserEmail VARCHAR(100) NOT NULL,
    UserPassword VARCHAR(100) NOT NULL,
    UserImage VARCHAR(100) NOT NULL
);

-- Inserting values into User table