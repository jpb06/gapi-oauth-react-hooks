import { GapiConfig } from "../logic/gapi.config.logic";

describe("GapiConfig logic", () => {
  it("should setup properties", () => {
    const clientId = "Yolo";
    const scope = "profile";
    const redirectUrl = "http://localhost:3000";
    GapiConfig.setup(clientId, scope, redirectUrl);

    expect(GapiConfig.ClientId).toBe(clientId);
    expect(GapiConfig.Scope).toBe(scope);
    expect(GapiConfig.RedirectUri).toBe(redirectUrl);
  });
});
