import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../common/app-interfaces';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
    user: User | null = null;
    userLoaded: boolean = false;
    userId: number | null = null; // Variable to store the user ID

    constructor(
        private apiService: ApiService,
        private route: ActivatedRoute,
        private changeDetectorRef: ChangeDetectorRef // Inject ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        // Subscribe to route parameter changes to get the user ID dynamically
        this.route.params.subscribe(params => {
            this.userId = +params['id']; // Convert the user ID to a number
            console.log('User ID:', this.userId);
            if (this.userId) {
                // Call the API to fetch user details by ID
                this.apiService.getUserById(this.userId).subscribe({
                    next: (user) => {
                        this.user = user;
                        this.userLoaded = true; // Set userLoaded flag to true when user data is loaded
                        console.log('User details:', this.user);
                        this.changeDetectorRef.detectChanges(); // Manually trigger change detection
                    },
                    error: (error) => {
                        console.error('Error fetching user details:', error);
                    }
                });
            }
        });
    }
}
