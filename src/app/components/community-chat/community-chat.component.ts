import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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

    // Map to store replies by message ID
    private repliesMap = new Map<number, ChatMessage[]>();

    // Pagination properties
    pageSize: number = 10; // Number of messages per page
    currentPage: number = 0; // Current page index (0-based)
    hasMoreMessages: boolean = true; // Flag to indicate if there are more messages to load
    replyPagination: { [messageId: number]: { currentPage: number, pageSize: number, hasMoreReplies: boolean } } = {};
    // Reference to the input field for replying to a message
    @ViewChild('replyInput') replyInput!: ElementRef;


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
        
            // Append incoming messages to the existing map
            if (loadMore) {
                this.currentPage++;
            } else {
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
    
        sendMessage(replyingToId?: number) {
            this.replyingTo = replyingToId ?? null;
            console.log(`Sending message. Community ID: ${this.communityId}, Current User ID: ${this.currentUserId}, Replying To: ${this.replyingTo}, Reply Text: "${this.replyText}", New Message Text: "${this.newMessageText}"`);
            const text = this.replyingTo ? this.replyText : this.newMessageText;
            if (!this.communityId || !text.trim() || this.currentUserId === undefined) {
                console.error('Invalid input data. Message not sent.');
                return;
            }
            console.log('Sending message:', text);
            this.apiService.postChatMessage(this.communityId, this.currentUserId, text, this.isAnonymous, this.replyingTo ?? undefined).subscribe({
                next: (newMessage) => {
                    if (this.replyingTo) {
                        // Update replies if replying to a message
                        let replies = this.repliesMap.get(this.replyingTo) || [];
                        replies = [...replies, newMessage];
                        this.repliesMap.set(this.replyingTo, replies);
        
                        // Update selected message replies if it's currently being viewed
                        if (this.selectedMessage && this.selectedMessage.ChatMessageID === this.replyingTo) {
                            this.selectedMessage.Replies = replies;
                        }
                    } else {
                        // Add new message to the messages map and array
                        this.messagesMap.set(newMessage.ChatMessageID, newMessage);
                        this.messages = Array.from(this.messagesMap.values()).sort((a, b) => new Date(b.ChatMessageDate).getTime() - new Date(a.ChatMessageDate).getTime());
                    }
        
                    // Clear input fields and reset flags
                    this.newMessageText = '';
                    this.replyText = '';
                    this.replyingTo = null;
                    this.isAnonymous = false;
        
                    // Trigger change detection manually
                    this.cd.detectChanges();
                    console.log('Message sent:', newMessage);
                },
                error: (error) => console.error('Error sending message:', error)
            });
            this.cd.detectChanges();
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
                // Check if replies are already loaded, update them in the map
            const existingReplies = this.repliesMap.get(messageId) || [];
            this.repliesMap.set(messageId, loadMore ? existingReplies.concat(replies) : replies);
            
            // If this message is currently selected, update the UI to show these replies
            if (this.selectedMessage?.ChatMessageID === messageId) {
                this.selectedMessage.Replies = this.repliesMap.get(messageId);
                this.cd.detectChanges();
            }
        },
        error: (error) => console.error('Error loading replies:', error)
        });
    }    

    selectMessage(message: ChatMessage) {
        this.selectedMessage = message;
        this.isMessageSelected = true;
    
        // Directly check the repliesMap instead of the selectedMessage's Replies property
        if (!this.repliesMap.has(message.ChatMessageID)) {
            this.loadReplies(message.ChatMessageID);
        } else {
            // If replies are already loaded, directly assign them to the selected message for UI update
            this.selectedMessage.Replies = this.repliesMap.get(message.ChatMessageID);
        }
    
        this.cd.detectChanges();
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
        this.cd.detectChanges();
    }
    
    startReplyingTo(messageId: number) {
        // Set the replyingTo state
        console.log(`Starting to reply to messageId: ${messageId}`);
        this.replyingTo = messageId;
    
        // Check if the selected message is already set correctly
        if (!this.selectedMessage || this.selectedMessage.ChatMessageID !== messageId) {
            this.selectedMessage = this.messages.find(message => message.ChatMessageID === messageId) || null;
            this.isMessageSelected = !!this.selectedMessage;
        }
    
        // Ensure UI updates with these changes
        this.cd.detectChanges();
    
        // Attempt to focus the reply input after Angular has completed the current change detection cycle
        setTimeout(() => {
            const replyInput = document.querySelector('#replyInput' + messageId) as HTMLInputElement;
            if (replyInput) {
                replyInput.focus();
            }
        }, 0);
    }    

    cancelReply() {
        this.replyingTo = null;
        this.replyText = '';
    }
}