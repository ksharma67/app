import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ChatMessage, User } from '../../common/app-interfaces';
import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-community-chat',
    templateUrl: './community-chat.component.html',
    styleUrls: ['./community-chat.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CommunityChatComponent implements OnInit {
    communityId?: number;
    messages: any[] = [];
    newMessageText: string = '';
    currentUserId?: number;
    isAnonymous: boolean = false; // Flag to track anonymous posting
    isAnonymousReply: boolean = false; // Flag to track anonymous replying
    replyingTo: number | null = null; // Added for reply functionality
    replyText: string = ''; // Text for the reply message


    constructor(private route: ActivatedRoute, private apiService: ApiService, private authService: AuthService, private cd: ChangeDetectorRef) { }


    ngOnInit() {
      this.communityId = this.route.snapshot.params['communityId'];
      if (this.communityId) {
          this.loadChatMessages();
      }
      this.fetchCurrentUserDetails();
    }

    loadChatMessages() {
        if (!this.communityId) return;
        this.apiService.getChatMessagesByCommunity(this.communityId).subscribe({
            next: (messages) => {
                this.messages = messages;
                console.log('Chat messages:', this.messages);
                this.cd.detectChanges();
            },
            error: (error) => console.error('Error loading chat messages:', error)
        });
    }

    fetchCurrentUserDetails() {
        this.apiService.getCurrentUserDetails().subscribe({
            next: (user) => {
                this.currentUserId = user.UserID;
                this.cd.detectChanges();
            },
            error: (error) => console.error('Error fetching current user details:', error)
        });
    }
    
    sendMessage() {
        // Determine whether it's a new message or a reply, and set the text accordingly
        const text = this.replyingTo ? this.replyText : this.newMessageText;
        
        if (!this.communityId || !text.trim() || this.currentUserId === undefined) {
            console.error('Required information missing. Cannot send message.');
            return;
        }
    
        // Adjust the API call to include `undefined` instead of `null` for non-reply messages
        this.apiService.postChatMessage(this.communityId, this.currentUserId, text, this.isAnonymous, this.replyingTo || undefined).subscribe({
            next: () => {
                // Clear the text fields and reset the replyingTo state
                this.newMessageText = '';
                this.replyText = '';
                this.replyingTo = null;
                this.isAnonymous = false;
                this.loadChatMessages();
                this.cd.detectChanges();
            },
            error: (error) => console.error('Error sending message:', error)
        });
    }    
    
    startReplyingTo(messageId: number) {
        this.replyingTo = messageId;
        console.log('Replying to message:', messageId);
        // Optionally, focus on the input field where the reply text is entered
        // This can depend on your HTML structure and might require ViewChild or a direct DOM manipulation
    }

    cancelReply() {
        this.replyingTo = null;
        this.replyText = '';
    }
}