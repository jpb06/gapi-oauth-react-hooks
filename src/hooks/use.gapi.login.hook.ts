import { GapiState } from "../";
import { gapiGetAuth2Instance } from "../indirection/gapi.lib.indirection";
import { useGapiLoading } from "./use.gapi.loading.hook";

interface UseGapiLoginProps {
  state: GapiState;
  signedUser?: gapi.auth2.BasicProfile;
  handleGoogleSignIn: () => Promise<void>;
  handleGoogleSignout: () => Promise<void>;
}

export const useGapiLogin = (): UseGapiLoginProps => {
  const { state, signedUser, setSignedUser, setState } = useGapiLoading();

  const handleGoogleSignIn = async () => {
    if (state !== "NotSignedIn")
      throw new Error("gapi is not ready for sign in");

    try {
      const authInstance = gapiGetAuth2Instance();
      const user = await authInstance.signIn({ prompt: "consent" });

      setSignedUser(user.getBasicProfile());
      setState("SignedIn");
    } catch (err) {
      // console.error("gapi login error:", err);
      setState("Errored");
    }
  };

  const handleGoogleSignout = async () => {
    if (state !== "SignedIn") return;

    const authInstance = gapiGetAuth2Instance();
    await authInstance.signOut();
    await authInstance.disconnect();
  };

  return {
    state,
    signedUser,
    handleGoogleSignIn,
    handleGoogleSignout,
  };
};
