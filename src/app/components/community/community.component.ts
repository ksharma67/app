import { Component, OnInit } from '@angular/core';
import { Community } from 'src/app/common/app-interfaces';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  communities: Community[] = []; // Use the Community interface to type-check

  constructor(private apiService: ApiService) { }

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

  // Implement other methods to interact with the API here (e.g., getCommunityById, createCommunity, deleteCommunity)
}