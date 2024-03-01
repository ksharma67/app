export interface Community {
    CommunityID: number;
    CommunityName: string;
    CommunityImage: string;
  }

  export interface User {
    UserEmail: string;
    UserID: number;
    UserName: string;
    UserImage: string;
    Token?: string;
  }

  export interface CommunityUser {
    CommunityUserID: number;
    CommunityUserCommunityID: number;
    CommunityUserUserID: number;
  }

  export interface ChatMessage {
    ChatMessageID: number;
    ChatMessageText: string;
    ChatMessageDate: Date;
    ChatMessageTime: string;
    ChatMessageUserID: number;
    user?: { UserName: string; }; // Adjust based on the actual structure
}

