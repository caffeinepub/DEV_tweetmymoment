import EventTypes "../types/events";
import Runtime "mo:core/Runtime";

module {
  public type EventKind = EventTypes.EventKind;
  public type PostRequest = EventTypes.PostRequest;

  // Composes the tweet body text for a given event.
  // Returns the pre-composed message or uses customText for #Other.
  // Posts the tweet using the text already composed and previewed on the frontend.
  // req.customText carries the exact preview text for all event kinds.
  public func composeTweet(req : PostRequest) : Text {
    switch (req.customText) {
      case (?text) text;
      case null Runtime.trap("customText is required — frontend must supply the previewed tweet text");
    };
  };
};
