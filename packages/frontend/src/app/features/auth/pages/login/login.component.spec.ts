import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated']);
    authSpy.isAuthenticated.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: { returnUrl: '/dashboard' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create and initialize the form', () => {
    expect(component).toBeTruthy();
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
  });

  it('should invalidate form when empty', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should validate email input format', () => {
    const email = component.loginForm.controls['email'];
    email.setValue('invalid-email');
    expect(email.errors?.['email']).toBeTruthy();

    email.setValue('valid@example.com');
    expect(email.errors).toBeNull();
  });

  it('should call authService login on valid submit', () => {
    authServiceSpy.login.and.returnValue(of({ twoFactorRequired: false }));
    
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    
    component.onSubmit();
    
    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect to 2fa page if 2fa is required', () => {
    authServiceSpy.login.and.returnValue(of({ twoFactorRequired: true, userId: 'uuid-123' }));
    
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    
    component.onSubmit();
    
    expect(router.navigate).toHaveBeenCalledWith(['/auth/2fa'], {
      queryParams: { userId: 'uuid-123', returnUrl: '/dashboard' }
    });
  });

  it('should show error message on failed login', () => {
    const errorResponse = { error: { error: 'Invalid credentials' } };
    authServiceSpy.login.and.returnValue(throwError(() => errorResponse));
    
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password123');
    
    component.onSubmit();
    
    expect(component.error).toBe('Invalid credentials');
    expect(component.loading).toBeFalse();
  });
});
