module {
  // OAuth 2.0 PKCE per-user session state (stored while awaiting callback)
  public type PkceSession = {
    codeVerifier : Text;
    state : Text; // CSRF protection
    redirectUri : Text;
  };

  // Per-user X OAuth tokens
  public type XAuth = {
    access_token : Text;
    refresh_token : Text;
    expires_at : Int; // nanoseconds absolute (Time.now()-relative)
    scope : [Text];
  };
};
