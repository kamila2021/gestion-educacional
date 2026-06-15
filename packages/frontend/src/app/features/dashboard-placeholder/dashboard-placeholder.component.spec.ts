import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardPlaceholderComponent } from './dashboard-placeholder.component';
import { AuthService } from '../../core/services/auth.service';

describe('DashboardPlaceholderComponent', () => {
  let component: DashboardPlaceholderComponent;
  let fixture: ComponentFixture<DashboardPlaceholderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['logout', 'isAuthenticated']);
    
    Object.defineProperty(authSpy, 'currentUserValue', {
      get: () => ({
        id: '1',
        email: 'test@example.com',
        firstName: 'Juan',
        lastName: 'Pérez',
        role: 'admin',
        twoFactorEnabled: true
      })
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DashboardPlaceholderComponent],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPlaceholderComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create and load user', () => {
    expect(component).toBeTruthy();
    expect(component.user).toBeDefined();
    expect(component.user.firstName).toBe('Juan');
  });

  it('should call authService logout on logout()', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });
});
