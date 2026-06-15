import { tenantMiddleware } from './tenant.middleware';
import { AuthRequest } from './jwt.middleware';
import { Response } from 'express';
import { AppError } from '../utils/errors';

describe('TenantMiddleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    nextFunction = jest.fn();
  });

  it('should throw 401 error if req.user is missing', () => {
    expect(() => {
      tenantMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
    }).toThrow(new AppError(401, 'User authentication required'));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should throw 403 error if req.user.institutionId is missing', () => {
    mockRequest.user = {
      id: 'uuid-1',
      email: 'test@example.com',
      role: 'admin',
      institutionId: null
    };

    expect(() => {
      tenantMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
    }).toThrow(new AppError(403, 'Access denied: No institution associated with this user'));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should call next() if req.user.institutionId is present', () => {
    mockRequest.user = {
      id: 'uuid-1',
      email: 'test@example.com',
      role: 'admin',
      institutionId: 'institution-uuid'
    };

    tenantMiddleware(mockRequest as AuthRequest, mockResponse as Response, nextFunction);
    
    expect(nextFunction).toHaveBeenCalled();
  });
});
