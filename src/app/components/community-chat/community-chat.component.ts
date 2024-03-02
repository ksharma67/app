import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChatMessage, User } from '../../common/app-interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

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
    selectedMessage: any = null; // Holds the currently selected message
    searchTerm: string = ''; // Search term for filtering messages

    // Pagination properties
    pageSize: number = 10; // Number of messages per page
    currentPage: number = 0; // Current page index (0-based)
    hasMoreMessages: boolean = true; // Flag to indicate if there are more messages to load
    replyPagination: { [messageId: number]: { currentPage: number, pageSize: number, hasMoreReplies: boolean } } = {};

    constructor(private route: ActivatedRoute, private apiService: ApiService, private authService: AuthService, private cd: ChangeDetectorRef) { }


    ngOnInit() {
      this.communityId = this.route.snapshot.params['communityId'];
      if (this.communityId) {
          this.loadChatMessages();
      }
      this.fetchCurrentUserDetails();
    }

    loadChatMessages(loadMore: boolean = false) {
        if (!this.communityId) return;

        if (loadMore) {
            this.currentPage++; // Load the next page of messages
        } else {
            this.currentPage = 0; // Only reset to the first page if not loading more, but keep old messages
        }

        const offset = this.currentPage * this.pageSize;

        this.apiService.getChatMessagesByCommunity(this.communityId, this.pageSize, offset).subscribe({
        next: (messages) => {
            if (messages.length < this.pageSize) {
                this.hasMoreMessages = false; // No more messages to load
            } else {
                this.hasMoreMessages = true;
            }
            // Always append new messages without clearing existing ones
            if (!loadMore && this.currentPage === 0) {
                // For the initial load or refresh, prepend new messages to ensure they appear at the top
                this.messages = [...messages, ...this.messages];
            } else {
                // For loading more, append at the end
                this.messages = [...this.messages, ...messages];
            }
            this.cd.detectChanges();
            console.log('Loaded chat messages:', messages);
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
    
                // Load the new messages after sending
                this.apiService.getChatMessagesByCommunity(this.communityId!, this.pageSize, 0).subscribe({
                    next: (messages) => {
                        if (messages.length > 0) {
                            // Append new messages to the existing array
                            this.messages = [...this.messages, ...messages];
    
                            // Sort messages based on ChatMessageDate in descending order
                            this.messages.sort((a, b) => new Date(b.ChatMessageDate).getTime() - new Date(a.ChatMessageDate).getTime());
    
                            this.cd.detectChanges();
                        }
                    },
                    error: (error) => console.error('Error loading new messages after sending:', error)
                });
            },
            error: (error) => console.error('Error sending message:', error)
        });
    }
    
    deselectMessage() {
        this.selectedMessage = null;
        this.replyingTo = null; // Also reset replyingTo if you want to cancel any reply action
        // You might also want to reset any other related state here, such as clearing reply text
        this.replyText = '';
      }

      // Method to search messages within the community
      searchMessages(searchTerm: string) {
        if (!this.communityId) return;
    
        this.apiService.searchChatMessages(this.communityId, searchTerm)
            .subscribe({
                next: (messages) => {
                    this.messages = messages;
                    this.cd.detectChanges();
                    console.log('Search results:', messages);
                },
                error: (error) => console.error('Error searching messages:', error)
            });
    }
    

    // Method to load replies for a specific message, with pagination support
    loadReplies(messageId: number, loadMore: boolean = false) {
        if (!this.replyPagination[messageId]) {
            this.replyPagination[messageId] = { currentPage: 0, pageSize: 10, hasMoreReplies: true };
        }
    
        const paginationInfo = this.replyPagination[messageId];
        if (loadMore) {
            paginationInfo.currentPage++;
        }
    
        const offset = paginationInfo.currentPage * paginationInfo.pageSize;
        console.log('Loading replies for message:', messageId, 'with offset:', offset);
        // Proceed to load replies only if needed
        if (loadMore || !this.selectedMessage.Replies) {
            this.apiService.getRepliesByMessageId(messageId, paginationInfo.pageSize, offset).subscribe({
                next: (replies) => {
                    // Logic to append or set replies...
                    console.log('Loaded replies:', replies);
                    this.cd.detectChanges();
                    const messageIndex = this.messages.findIndex(m => m.ChatMessageID === messageId);
                    if (messageIndex !== -1) {
                    this.messages[messageIndex].Replies = replies;
                    this.cd.detectChanges(); // Since you're using ChangeDetectionStrategy.OnPush
                    }
                    if (replies.length < paginationInfo.pageSize) {
                        paginationInfo.hasMoreReplies = false; // No more replies to load
                    } else {
                        paginationInfo.hasMoreReplies = true;
                    }
                },
                error: (error) => console.error('Error loading replies:', error)
            });
        }
    }    

    selectMessage(message: any) {
        // Check if the clicked message is already selected
        console.log('Selected message:', message);
        if (this.selectedMessage?.ChatMessageID === message.ChatMessageID) {
            // If replies are loaded for the selected message, deselect it
            if (this.selectedMessage.Replies) {
                this.selectedMessage = null; // Deselect or close replies
            } else {
                // If replies are not loaded, load them
                this.loadReplies(message.ChatMessageID);
                console.log('Loading replies for message:', message.ChatMessageID);
            }
        } else {
            // If a different message is clicked, load its replies
            this.selectedMessage = { ...message };
            if (!message.Replies) {
                // Load replies for the selected message
                this.loadReplies(message.ChatMessageID);
                console.log('Loading replies for message:', message.ChatMessageID);
            }
        }
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