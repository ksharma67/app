import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingComponent } from './landing.component';
import { ApiService } from '../../services/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { expect } from 'chai';
describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let apiService: ApiService;

  beforeEach(async () => {
    // Mock ApiService
    const apiServiceMock = {
      getCategories: jasmine.createSpy('getCategories').and.returnValue(of([])),
      getRadius: jasmine.createSpy('getRadius').and.returnValue(of([])),
    };

    await TestBed.configureTestingModule({
      declarations: [ LandingComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule ],
      providers: [ { provide: ApiService, useValue: apiServiceMock } ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).to.be.ok;
  });

  // Add more tests here
});
