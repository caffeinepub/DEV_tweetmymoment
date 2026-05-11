import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinSettings "mixins/settings-api";
import MixinAuth "mixins/auth-api";
import MixinEvents "mixins/events-api";
import AuthLib "lib/auth";
import SettingsLib "lib/settings";

actor {
  // Authorization — first caller auto-assigned #admin role
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Admin-set X Developer App Client ID
  let xClientId : SettingsLib.ClientIdState = { var value = null };
  include MixinSettings(accessControlState, xClientId);

  // Per-user PKCE sessions (transient: only live during the OAuth handshake)
  let pkceSessionsByUser : Map.Map<Principal, AuthLib.PkceSession> = Map.empty();

  // Per-user X OAuth tokens (persistent: survive across calls)
  let xAuthByUser : Map.Map<Principal, AuthLib.XAuth> = Map.empty();
  include MixinAuth(xClientId, pkceSessionsByUser, xAuthByUser);

  include MixinEvents(xClientId, xAuthByUser);
};

