import { Injectable } from '@angular/core';
import { ChatMessage } from '../common/app-interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReplyCacheService {
  private cachedReplies: { [messageId: number]: ChatMessage[] } = {};

  constructor() {}

  cacheReplies(messageId: number, replies: ChatMessage[]) {
    this.cachedReplies[messageId] = replies;
  }

  getCachedReplies(messageId: number): ChatMessage[] | undefined {
    return this.cachedReplies[messageId];
  }

  clearCache() {
    this.cachedReplies = {};
  }
}
