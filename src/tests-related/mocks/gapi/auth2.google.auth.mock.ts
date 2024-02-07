import { mockGapiCurrentUser, MockUser } from './auth2.current.user.mock';
import { vi, Mock } from 'vitest';

export const mockGoogleAuth = (
  isSignedIn: boolean,
  user?: MockUser,
  authResponse?: gapi.auth2.AuthResponse,
  thenFn: (_: Mock, __: Mock) => void = vi.fn(),
  signOutMockFn = vi.fn(),
  disconnectMockFn = vi.fn(),
): gapi.auth2.GoogleAuth => ({
  signIn: vi
    .fn()
    .mockReturnValue(mockGapiCurrentUser(user, authResponse)?.get()),
  signOut: signOutMockFn,
  disconnect: disconnectMockFn,
  grantOfflineAccess: vi.fn(),
  attachClickHandler: vi.fn(),
  then: thenFn,
  isSignedIn: {
    get: vi.fn().mockReturnValue(isSignedIn),
    listen: vi.fn(),
  },
  currentUser: mockGapiCurrentUser(user, authResponse),
});
