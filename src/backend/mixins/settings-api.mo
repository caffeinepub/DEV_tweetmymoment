import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import SettingsLib "../lib/settings";

mixin (
  accessControlState : AccessControl.AccessControlState,
  xClientId : SettingsLib.ClientIdState,
) {
  // Returns whether the admin has configured an X Client ID
  public query func isXClientIdConfigured() : async Bool {
    SettingsLib.isConfigured(xClientId);
  };

  // Admin-only: sets the X Developer App Client ID
  public shared ({ caller }) func setXClientId(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can set the X Client ID");
    };
    SettingsLib.setClientId(xClientId, id);
  };
};
