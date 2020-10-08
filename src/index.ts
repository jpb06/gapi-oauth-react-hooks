import {
  GoogleAuthHookProps,
  useGoogleAuth,
} from "./hooks/use.google.auth.hook";
import { GapiConfig } from "./logic/gapi.config.logic";
import { GapiState } from "./types/gapiState";
import { UserProfile } from "./types/user.profile";

export { useGoogleAuth, GapiConfig };
export type { GoogleAuthHookProps };
export type { GapiState };
export type { UserProfile };
