import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { first } from 'rxjs/operators';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['admin', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  get f() { return this.signupForm.controls; }

  getPasswordStrength(): { score: number; label: string; colorClass: string; widthClass: string } {
    const val = this.signupForm?.get('password')?.value || '';
    if (!val) return { score: 0, label: '', colorClass: 'bg-gray-700', widthClass: 'w-0' };
    
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    
    if (score <= 2) {
      return { score, label: 'Débil', colorClass: 'bg-red-500', widthClass: 'w-1/3' };
    } else if (score <= 4) {
      return { score, label: 'Media', colorClass: 'bg-amber-500', widthClass: 'w-2/3' };
    } else {
      return { score, label: 'Fuerte', colorClass: 'bg-emerald-500', widthClass: 'w-full' };
    }
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.signupForm.invalid) {
      return;
    }

    this.loading = true;
    const { confirmPassword, ...signupData } = this.signupForm.value;
    
    this.authService.signup(signupData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || 'Ocurrió un error al registrarse. Por favor, intenta nuevamente.';
        }
      });
  }
}

