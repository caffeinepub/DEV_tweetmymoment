import Types "../types/settings";
import Runtime "mo:core/Runtime";

module {
  public type ClientIdState = Types.ClientIdState;

  // Returns whether a Client ID has been configured
  public func isConfigured(state : ClientIdState) : Bool {
    state.value != null;
  };

  // Sets the Client ID; validates non-empty
  public func setClientId(state : ClientIdState, id : Text) {
    if (id.isEmpty()) {
      Runtime.trap("Client ID must not be empty");
    };
    state.value := ?id;
  };

  // Retrieves the current Client ID value (internal use only)
  public func getClientId(state : ClientIdState) : ?Text {
    state.value;
  };
};
