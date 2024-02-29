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
    // Consider adding more fields as needed, such as:
    // UserPassword: string; (Note: Typically not stored or managed on the client side)
    // Token?: string; // Optional for storing authentication tokens
  }