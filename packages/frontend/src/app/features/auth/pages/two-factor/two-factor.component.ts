import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.component.html'
})
export class TwoFactorComponent implements OnInit {
  twoFactorForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  userId?: string;
  returnUrl!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.twoFactorForm = this.formBuilder.group({
      code: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]+$')
      ]]
    });

    this.userId = this.route.snapshot.queryParams['userId'];
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() { return this.twoFactorForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.error = '';

    if (this.twoFactorForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.verify2FA(this.f['code'].value, this.userId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.error || 'Código incorrecto o expirado. Inténtalo nuevamente.';
        }
      });
  }
}
