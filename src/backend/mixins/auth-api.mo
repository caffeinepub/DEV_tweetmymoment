import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import AuthLib "../lib/auth";
import SettingsLib "../lib/settings";

mixin (
  xClientId : SettingsLib.ClientIdState,
  pkceSessionsByUser : Map.Map<Principal, AuthLib.PkceSession>,
  xAuthByUser : Map.Map<Principal, AuthLib.XAuth>,
) {
  // Required transform callback for HTTP outcalls (must live in the actor).
  public query func xTransform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Returns whether the caller has a connected X account
  public query ({ caller }) func isMyXConnected() : async Bool {
    AuthLib.isConnected(caller, xAuthByUser);
  };

  // Initiates the OAuth 2.0 PKCE flow; returns the X authorization URL
  public shared ({ caller }) func startXOAuth(redirectUri : Text) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to connect X");
    };
    let ?clientId = SettingsLib.getClientId(xClientId) else {
      Runtime.trap("X is not configured (admin must set the Client ID)");
    };
    await* AuthLib.startOAuth(clientId, redirectUri, caller, pkceSessionsByUser);
  };

  // Completes the OAuth 2.0 PKCE flow by exchanging the authorization code
  public shared ({ caller }) func completeXOAuth(code : Text, redirectUri : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to connect X");
    };
    let ?clientId = SettingsLib.getClientId(xClientId) else {
      Runtime.trap("X is not configured");
    };
    let auth = await* AuthLib.exchangeCode(clientId, code, redirectUri, caller, pkceSessionsByUser, xTransform);
    xAuthByUser.add(caller, auth);
  };

  // Disconnects the caller's X account
  public shared ({ caller }) func disconnectMyX() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to disconnect");
    };
    xAuthByUser.remove(caller);
  };
};
