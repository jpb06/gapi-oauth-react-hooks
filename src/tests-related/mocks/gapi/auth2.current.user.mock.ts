import { vi } from 'vitest';

export interface MockUser {
  id: string;
  email: string;
  name: string;
  familyName: string;
  givenName: string;
  imageUrl: string;
}
export const mockGapiCurrentUser = (
  user?: MockUser,
  authResponse?: gapi.auth2.AuthResponse,
): gapi.auth2.CurrentUser => {
  if (!user) {
    return undefined as unknown as gapi.auth2.CurrentUser;
  }

  return {
    get: vi.fn().mockImplementation(() => ({
      getBasicProfile: vi.fn().mockReturnValue({
        getId: vi.fn().mockReturnValue(user.id),
        getEmail: vi.fn().mockReturnValue(user.email),
        getName: vi.fn().mockReturnValue(user.name),
        getFamilyName: vi.fn().mockReturnValue(user.familyName),
        getGivenName: vi.fn().mockReturnValue(user.givenName),
        getImageUrl: vi.fn().mockReturnValue(user.imageUrl),
      }),
      getAuthResponse: vi.fn().mockReturnValue(authResponse),
    })),
    listen: vi.fn(),
  };
};
