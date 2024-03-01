import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Community } from 'src/app/common/app-interfaces';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  communities: Community[] = []; // Use the Community interface to type-check

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.loadCommunities();
  }

  loadCommunities() {
    this.apiService.getAllCommunities().subscribe({
      next: (communities: Community[]) => { // Use the Community interface to type-check
        this.communities = communities;
        console.log(communities);
        // Now you can use this.communities in your component's template to display community data
      },
      error: (error) => console.error(error)
    });
  }

  openChat(communityId: number) {
    // Navigate to the chat component, passing the community ID
    this.router.navigate(['/community-chat', { communityId: communityId }]);
  }

  // Implement other methods to interact with the API here (e.g., getCommunityById, createCommunity, deleteCommunity)
}