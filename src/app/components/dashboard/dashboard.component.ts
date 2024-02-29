import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
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

    constructor(
        private apiService: ApiService,
        private changeDetectorRef: ChangeDetectorRef // Still needed for manual change detection
    ) { }

    ngOnInit(): void {
        this.fetchCurrentUserDetails();
    }

    private fetchCurrentUserDetails(): void {
        this.apiService.getCurrentUserDetails().subscribe({
            next: (user) => {
                this.user = user;
                this.userLoaded = true; // Indicate that user details have been loaded
                console.log('User details:', this.user);
                this.changeDetectorRef.detectChanges(); // Manually trigger change detection
            },
            error: (error) => {
                console.error('Error fetching current user details:', error);
                // Optionally, handle user feedback or redirection if needed
            }
        });
    }
}
