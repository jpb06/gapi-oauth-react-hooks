export class GapiConfig {
  static ClientId?: string;
  static Scope?: string;
  static RedirectUri?: string;

  static setup(clientId?: string, scope?: string, redirectUri?: string) {
    this.ClientId = clientId;
    this.Scope = scope;
    this.RedirectUri = redirectUri;
  }
}
