import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { InstitutionService } from '../../../../core/services/institution.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  user: any;
  institutions: any[] = [];
  institutionForm!: FormGroup;
  inviteForm!: FormGroup;
  
  showInviteModal = false;
  selectedInstitution: any = null;

  successMessage: string | null = null;
  errorMessage: string | null = null;
  generatedLink: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private institutionService: InstitutionService
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;
    this.initForms();
    this.loadInstitutions();
  }

  private initForms() {
    this.institutionForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.inviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loadInstitutions() {
    this.institutionService.getInstitutions().subscribe({
      next: (data) => {
        this.institutions = data;
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar las instituciones.';
        console.error(err);
      }
    });
  }

  onSubmitInstitution() {
    if (this.institutionForm.invalid) return;

    this.successMessage = null;
    this.errorMessage = null;
    const { name } = this.institutionForm.value;

    this.institutionService.createInstitution(name).subscribe({
      next: (res) => {
        this.successMessage = `Institución "${res.name}" creada con éxito.`;
        this.institutionForm.reset();
        this.loadInstitutions();

        if (!this.user.institutionId) {
          this.authService.refreshToken().subscribe({
            next: () => {
              this.user = this.authService.currentUserValue;
            }
          });
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al crear la institución.';
      }
    });
  }

  openInviteModal(institution: any) {
    this.selectedInstitution = institution;
    this.inviteForm.reset();
    this.successMessage = null;
    this.errorMessage = null;
    this.generatedLink = null;
    this.showInviteModal = true;
  }

  closeInviteModal() {
    this.showInviteModal = false;
    this.selectedInstitution = null;
    this.inviteForm.reset();
    this.generatedLink = null;
    this.successMessage = null;
    this.errorMessage = null;
  }

  onSubmitInvitation() {
    if (this.inviteForm.invalid || !this.selectedInstitution) return;

    this.successMessage = null;
    this.errorMessage = null;
    this.generatedLink = null;
    const { email } = this.inviteForm.value;

    this.institutionService.inviteProfessor(this.selectedInstitution.id, email).subscribe({
      next: (res) => {
        this.successMessage = `Invitación enviada con éxito a ${email}.`;
        this.generatedLink = res.invitationLink;
        this.inviteForm.reset();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al enviar la invitación.';
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
