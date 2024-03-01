CREATE TABLE IF NOT EXISTS ChatMessage (
    ChatMessageID INT AUTO_INCREMENT PRIMARY KEY,
    CommunityID INT,
    ChatMessageUserID INT,
    ChatMessageText TEXT NOT NULL,
    ChatMessageDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ChatMessageTime TIME,
    IsAnonymous BOOLEAN NOT NULL DEFAULT FALSE,
    ParentMessageID INT NULL,
    FOREIGN KEY (CommunityID) REFERENCES Community(CommunityID),
    FOREIGN KEY (ChatMessageUserID) REFERENCES User(UserID),
    FOREIGN KEY (ParentMessageID) REFERENCES ChatMessage(ChatMessageID)
);
