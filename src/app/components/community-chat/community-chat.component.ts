import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { ChatMessage } from '../../common/app-interfaces';

@Component({
    selector: 'app-community-chat',
    templateUrl: './community-chat.component.html',
    styleUrls: ['./community-chat.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CommunityChatComponent implements OnInit {
    communityId?: number;
    messages: ChatMessage[] = [];
    selectedMessage: ChatMessage | null = null;
    newMessageText: string = '';
    currentUserId?: number;
    isAnonymous: boolean = false; // Flag to track anonymous posting
    isAnonymousReply: boolean = false; // Flag to track anonymous replying
    replyingTo: number | null = null; // Added for reply functionality
    replyText: string = ''; // Text for the reply message
    searchTerm: string = ''; // Search term for filtering messages

    // Flag to track whether a message is selected
    isMessageSelected: boolean = false;

    // Map to store private messages by message ID
    private messagesMap = new Map<number, any>();

    // Pagination properties
    pageSize: number = 10; // Number of messages per page
    currentPage: number = 0; // Current page index (0-based)
    hasMoreMessages: boolean = true; // Flag to indicate if there are more messages to load
    replyPagination: { [messageId: number]: { currentPage: number, pageSize: number, hasMoreReplies: boolean } } = {};

    constructor(
        private route: ActivatedRoute, 
        private apiService: ApiService, 
        private authService: AuthService, 
        private cd: ChangeDetectorRef) { }


        ngOnInit() {
            this.route.params.subscribe(params => {
                this.communityId = params['communityId'];
                if (this.communityId) {
                    this.loadChatMessages();
                }
                this.fetchCurrentUserDetails();
            });
          }

          loadChatMessages(loadMore: boolean = false) {
            if (!this.communityId) return;
    
            // Clear messages map before loading new messages
            if (!loadMore) {
                this.messagesMap.clear();
                this.currentPage = 0;
            }
        
            const offset = this.currentPage * this.pageSize;
        
            this.apiService.getChatMessagesByCommunity(this.communityId, this.pageSize, offset).subscribe({
                next: (messages) => {
                    if (messages.length < this.pageSize) {
                        this.hasMoreMessages = false;
                    } else {
                        this.hasMoreMessages = true;
                    }
        
                    messages.forEach(message => {
                        this.messagesMap.set(message.ChatMessageID, message);
                    });
                    
                    this.messages = Array.from(this.messagesMap.values());
                    this.messages.sort((a, b) => new Date(b.ChatMessageDate).getTime() - new Date(a.ChatMessageDate).getTime());
                    
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
        const text = this.replyingTo ? this.replyText : this.newMessageText;
        
        if (!this.communityId || !text.trim() || this.currentUserId === undefined) {
            console.error('Required information missing. Cannot send message.');
            return;
        }
    
        this.apiService.postChatMessage(this.communityId, this.currentUserId, text, this.isAnonymous, this.replyingTo || undefined).subscribe({
            next: () => {
                // Clear the text fields and reset the replyingTo state
                this.newMessageText = '';
                this.replyText = '';
                this.replyingTo = null;
                this.isAnonymous = false;
    
                // Ideally, instead of reloading all messages, you'd only fetch or update the UI with the newly sent message
                // For now, we'll simulate fetching new messages as an example
                this.apiService.getChatMessagesByCommunity(this.communityId!, this.pageSize, 0).subscribe({
                    next: (messages) => {
                        messages.forEach(message => {
                            this.messagesMap.set(message.ChatMessageID, message);
                        });
    
                        this.messages = Array.from(this.messagesMap.values());
                        this.messages.sort((a, b) => new Date(b.ChatMessageDate).getTime() - new Date(a.ChatMessageDate).getTime());
    
                        this.cd.detectChanges();
                    },
                    error: (error) => console.error('Error loading new messages after sending:', error)
                });
            },
            error: (error) => console.error('Error sending message:', error)
        });
    }    
    
    deselectMessage() {
        // Reset selected message and related state
        this.selectedMessage = null;
        this.isMessageSelected = false;
        this.replyingTo = null;
        this.replyText = '';
        // Reload all messages
        this.loadChatMessages();
    }
    

      // Method to search messages within the community
      searchMessages(searchTerm: string) {
        if (!this.communityId) return;
    
        this.apiService.searchChatMessages(this.communityId, searchTerm)
            .subscribe({
                next: (messages) => {
                    this.messages = messages;
                    this.cd.detectChanges(); // Manually trigger change detection
                    console.log('Search results:', messages);
                },
                error: (error) => console.error('Error searching messages:', error)
            });
    }

    clearSearch() {
        this.searchTerm = ''; // Clear the search term
        this.loadChatMessages(); // Optionally reload messages or reset to a default view
        this.cd.detectChanges(); // Trigger change detection to update the view
    }    

    // Method to load replies for a specific message, with pagination support
    loadReplies(messageId: number, loadMore: boolean = false) {
        // Check if pagination info is available for the message ID
        const timestamp = new Date().getTime();
        if (!this.replyPagination[messageId]) {
            this.replyPagination[messageId] = { currentPage: 0, pageSize: 10, hasMoreReplies: true };
        }
    
        // Increment current page if loading more
        if (loadMore) {
            this.replyPagination[messageId].currentPage++;
        }
    
        // Calculate offset based on current page and page size
        const offset = this.replyPagination[messageId].currentPage * this.replyPagination[messageId].pageSize;
    
        // Call API to fetch replies
        this.apiService.getRepliesByMessageId(messageId, this.replyPagination[messageId].pageSize, offset).subscribe({
            next: (replies) => {
                let parentMessage = this.messagesMap.get(messageId);
                console.log('Parent Message:', parentMessage);
                if (parentMessage) {
                    // Ensure the Replies array exists in the parent message
                    if (!parentMessage.Replies) {
                        parentMessage.Replies = [];
                    }
                    // Concatenate the loaded replies with existing replies
                    parentMessage.Replies = parentMessage.Replies.concat(replies);
                    console.log('Parent Message with Replies:', parentMessage);
                    // Update the messages map and trigger change detection
                    this.messagesMap.set(messageId, parentMessage);
                    this.cd.detectChanges();
                }            
                console.log('Replies:', replies);
            },
            error: (error) => {
                console.error('Error loading replies:', error);
            }
        });
    }    

    selectMessage(message: ChatMessage) {
        // If the same message is clicked again, toggle selection
        if (this.selectedMessage?.ChatMessageID === message.ChatMessageID) {
            // Toggle the selection state
            this.isMessageSelected = !this.isMessageSelected;
    
            // If deselected, show all messages
            if (!this.isMessageSelected) {
                this.selectedMessage = null;
                this.messages = Array.from(this.messagesMap.values());
            }
        } else {
            // Select a new message and focus on it and its replies
            this.selectedMessage = this.messagesMap.get(message.ChatMessageID);
            this.isMessageSelected = true;
    
            // Check if replies are already loaded for the message
            if (!this.selectedMessage?.Replies) {
                // If no replies loaded, initiate loading
                if (!this.replyPagination[this.selectedMessage!.ChatMessageID]?.hasMoreReplies) {
                    // Load replies only if there are more replies to load
                    this.loadReplies(this.selectedMessage!.ChatMessageID);
                    console.log('Loading replies for message:', this.selectedMessage!.ChatMessageID);
                }
            } else {
                // Replies are already loaded, so directly update the messages array
                this.updateMessagesWithReplies(this.selectedMessage, () => {
                    // Trigger change detection to update the view
                    this.cd.detectChanges();
                });
            }
        }
    }    

    updateMessagesWithReplies(selectedMessage: ChatMessage, callback: () => void) {
        // Sort replies if necessary
        if (Array.isArray(selectedMessage.Replies)) {
            selectedMessage.Replies.sort((a, b) => new Date(a.ChatMessageDate).getTime() - new Date(b.ChatMessageDate).getTime());
        }
        // Set messages array to include the selected message and its replies
        this.messages = [selectedMessage, ...(Array.isArray(selectedMessage.Replies) ? selectedMessage.Replies : [])];
        console.log('Updated messages with replies:', this.messages);
    
        // Call the callback function if provided
        if (callback) {
            callback();
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