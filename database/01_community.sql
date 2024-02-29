-- Creating a table named Community
CREATE TABLE IF NOT EXISTS Community (
    CommunityID INT AUTO_INCREMENT PRIMARY KEY,
    CommunityName VARCHAR(100) NOT NULL,
    CommunityImage VARCHAR(100) NOT NULL
);

-- Inserting values into Community table
INSERT IGNORE INTO Community (CommunityName, CommunityImage) VALUES ('Pregnancy Community', '/assets/images/pregnancy_icon.png');
INSERT IGNORE INTO Community (CommunityName, CommunityImage) VALUES ('Motherhood Community', '/assets/images/motherhood_icon.png');
INSERT IGNORE INTO Community (CommunityName, CommunityImage) VALUES ('Menopause Community', '/assets/images/menopause_icon.png');
-- Add more entries as needed
