import { UserProfile } from "../types/user.profile";

export const asPlainObject = (
  profile: gapi.auth2.BasicProfile
): UserProfile => ({
  id: profile.getId(),
  email: profile.getEmail(),
  familyName: profile.getFamilyName(),
  givenName: profile.getGivenName(),
  name: profile.getName(),
  imageUrl: profile.getImageUrl(),
});
