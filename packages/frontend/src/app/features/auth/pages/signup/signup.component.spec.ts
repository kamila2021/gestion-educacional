import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { SignupComponent } from './signup.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['signup', 'isAuthenticated']);
    authSpy.isAuthenticated.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [SignupComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create and initialize form fields', () => {
    expect(component).toBeTruthy();
    expect(component.signupForm.controls['email']).toBeDefined();
    expect(component.signupForm.controls['password']).toBeDefined();
    expect(component.signupForm.controls['confirmPassword']).toBeDefined();
    expect(component.signupForm.controls['firstName']).toBeDefined();
    expect(component.signupForm.controls['lastName']).toBeDefined();
    expect(component.signupForm.controls['role']).toBeDefined();
  });

  it('should fail if passwords do not match', () => {
    component.signupForm.controls['email'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['confirmPassword'].setValue('different');
    component.signupForm.controls['firstName'].setValue('Juan');
    component.signupForm.controls['lastName'].setValue('Pérez');
    
    expect(component.signupForm.errors?.['passwordMismatch']).toBeTrue();
    expect(component.signupForm.valid).toBeFalse();
  });

  it('should test password strength label correctly', () => {
    component.signupForm.controls['password'].setValue('123');
    expect(component.getPasswordStrength().label).toBe('Débil');

    component.signupForm.controls['password'].setValue('Password123!');
    expect(component.getPasswordStrength().label).toBe('Fuerte');
  });

  it('should sign up successfully and redirect to dashboard', () => {
    authServiceSpy.signup.and.returnValue(of({ token: 'tok', user: {} }));

    component.signupForm.controls['email'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['confirmPassword'].setValue('password123');
    component.signupForm.controls['firstName'].setValue('Juan');
    component.signupForm.controls['lastName'].setValue('Pérez');
    component.signupForm.controls['role'].setValue('admin');

    component.onSubmit();

    expect(authServiceSpy.signup).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Juan',
      lastName: 'Pérez',
      role: 'admin'
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on failed signup', () => {
    const errorResponse = { error: { error: 'Email already exists' } };
    authServiceSpy.signup.and.returnValue(throwError(() => errorResponse));

    component.signupForm.controls['email'].setValue('test@example.com');
    component.signupForm.controls['password'].setValue('password123');
    component.signupForm.controls['confirmPassword'].setValue('password123');
    component.signupForm.controls['firstName'].setValue('Juan');
    component.signupForm.controls['lastName'].setValue('Pérez');

    component.onSubmit();

    expect(component.error).toBe('Email already exists');
    expect(component.loading).toBeFalse();
  });
});
