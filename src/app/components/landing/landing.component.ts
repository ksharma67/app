import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from 'src/app/services/navbar.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})

export class LandingComponent implements OnInit {

  constructor(private router: Router, private navbarService: NavbarService,) { }

  ngOnInit(): void {
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }

}