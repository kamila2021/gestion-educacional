import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { TwoFactorComponent } from './two-factor.component';
import { AuthService } from '../../../../core/services/auth.service';

describe('TwoFactorComponent', () => {
  let component: TwoFactorComponent;
  let fixture: ComponentFixture<TwoFactorComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['verify2FA', 'isAuthenticated']);
    authSpy.isAuthenticated.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [TwoFactorComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: { userId: 'uuid-123', returnUrl: '/dashboard' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TwoFactorComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create and initialize code input', () => {
    expect(component).toBeTruthy();
    expect(component.twoFactorForm.controls['code']).toBeDefined();
    expect(component.userId).toBe('uuid-123');
    expect(component.returnUrl).toBe('/dashboard');
  });

  it('should invalidate code if not 6 digits or non-numeric', () => {
    const code = component.twoFactorForm.controls['code'];
    
    code.setValue('12345');
    expect(code.valid).toBeFalse();

    code.setValue('1234567');
    expect(code.valid).toBeFalse();

    code.setValue('abc123');
    expect(code.valid).toBeFalse();

    code.setValue('123456');
    expect(code.valid).toBeTrue();
  });

  it('should call authService verify2FA and navigate to returnUrl on success', () => {
    authServiceSpy.verify2FA.and.returnValue(of({ token: 'tok', user: {} }));
    
    component.twoFactorForm.controls['code'].setValue('123456');
    component.onSubmit();

    expect(authServiceSpy.verify2FA).toHaveBeenCalledWith('123456', 'uuid-123');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message on invalid code submit', () => {
    const errorResponse = { error: { error: 'Invalid verification code' } };
    authServiceSpy.verify2FA.and.returnValue(throwError(() => errorResponse));

    component.twoFactorForm.controls['code'].setValue('123456');
    component.onSubmit();

    expect(component.error).toBe('Invalid verification code');
    expect(component.loading).toBeFalse();
  });
});
