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

    constructor(private route: ActivatedRoute, private apiService: ApiService, private authService: AuthService, private cd: ChangeDetectorRef) { }


    ngOnInit() {
      this.communityId = this.route.snapshot.params['communityId'];
      if (this.communityId) {
          this.loadChatMessages();
      }
      this.fetchCurrentUserDetails();
    }

    loadChatMessages() {
        if (!this.communityId) return; // Guard clause if communityId is undefined
        this.apiService.getChatMessagesByCommunity(this.communityId).subscribe({
            next: (messages) => {
                console.log(messages);
                this.messages = messages;
                this.cd.detectChanges(); // Manually trigger change detection
            },
            error: (error) => console.error('Error loading chat messages:', error)
        });
    }

    fetchCurrentUserDetails() {
        this.apiService.getCurrentUserDetails().subscribe({
            next: (user) => {
                console.log('Fetched user details:', user); // Log the fetched user details
                this.currentUserId = user.UserID; // Adjust according to your User interface
                this.cd.detectChanges(); // Update the view if needed
            },
            error: (error) => {
                console.error('Error fetching current user details:', error);
            }
        });
    }
    
    sendMessage() {
        console.log('Sending message as user ID:', this.currentUserId); // Confirms ID is set
        // Hypothetical conditional check that might be failing incorrectly
        if (!this.communityId || !this.newMessageText.trim() || !this.currentUserId) {
            console.error('User ID not found'); // This might not be the actual issue
            return;
        }
        this.apiService.postChatMessage(this.communityId, this.currentUserId, this.newMessageText).subscribe({
            next: () => {
                this.newMessageText = '';
                this.loadChatMessages();
                this.cd.detectChanges();
            },
            error: (error) => console.error('Error sending message:', error)
        });
    }
}    