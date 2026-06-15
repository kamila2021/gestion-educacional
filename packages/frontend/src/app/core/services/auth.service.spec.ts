import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and set session', () => {
    const mockResponse = {
      token: 'jwt-token',
      refreshToken: 'refresh-token',
      user: { id: '1', email: 'test@example.com', role: 'admin' }
    };

    service.login('test@example.com', 'password').subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('jwt-token');
      expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
      expect(service.currentUserValue).toEqual(mockResponse.user);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should signup and set session', () => {
    const mockResponse = {
      token: 'jwt-token',
      refreshToken: 'refresh-token',
      user: { id: '1', email: 'test@example.com', role: 'admin' }
    };

    const signupData = { email: 'test@example.com', password: 'password', firstName: 'Juan', lastName: 'Pérez' };

    service.signup(signupData).subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('jwt-token');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/auth/signup');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should verify 2FA and set session', () => {
    const mockResponse = {
      token: 'jwt-token',
      refreshToken: 'refresh-token',
      user: { id: '1', email: 'test@example.com', role: 'admin' }
    };

    service.verify2FA('123456', 'user-id').subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(localStorage.getItem('token')).toBe('jwt-token');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/v1/auth/2fa/verify');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ code: '123456', userId: 'user-id' });
    req.flush(mockResponse);
  });

  it('should clear session on logout', () => {
    localStorage.setItem('token', 'jwt-token');
    localStorage.setItem('refreshToken', 'refresh-token');
    localStorage.setItem('user', JSON.stringify({ id: '1' }));

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
    expect(service.currentUserValue).toBeNull();

    const req = httpMock.expectOne('http://localhost:3000/api/v1/auth/logout');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
