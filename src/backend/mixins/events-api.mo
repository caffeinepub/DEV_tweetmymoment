import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import { type Config; defaultConfig } "mo:x-client/Config";
import TweetsApi "mo:x-client/Apis/TweetsApi";
import TweetCreateRequest "mo:x-client/Models/TweetCreateRequest";
import EventTypes "../types/events";
import EventsLib "../lib/events";
import AuthLib "../lib/auth";
import SettingsLib "../lib/settings";

mixin (
  xClientId : SettingsLib.ClientIdState,
  xAuthByUser : Map.Map<Principal, AuthLib.XAuth>,
) {
  // Required transform callback for x-client HTTP outcalls.
  public query func xPostTransform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Posts a tweet for a special event on behalf of the caller.
  // Returns the tweet ID on success.
  public shared ({ caller }) func postEventTweet(req : EventTypes.PostRequest) : async Text {
    if (caller.isAnonymous()) {
      Runtime.trap("Sign in to post");
    };
    let ?clientId = SettingsLib.getClientId(xClientId) else {
      Runtime.trap("X is not configured (admin must set the Client ID)");
    };
    let ?auth = xAuthByUser.get(caller) else {
      Runtime.trap("Connect your X account first");
    };
    let fresh = await* AuthLib.ensureFreshToken(clientId, auth, xPostTransform);
    if (fresh.access_token != auth.access_token) {
      xAuthByUser.add(caller, fresh);
    };
    let body = EventsLib.composeTweet(req);
    let config : Config = {
      defaultConfig with
      auth = ?(#bearer(fresh.access_token));
      is_replicated = ?false;
    };
    let tweetReq = { TweetCreateRequest.JSON.init({}) with text_ = ?body };
    let resp = await* TweetsApi.createPosts(config, tweetReq);
    switch (resp.data) {
      case (?d) d.id;
      case null Runtime.trap("Tweet posted but no ID returned");
    };
  };
};
