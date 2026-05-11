import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Nat8 "mo:core/Nat8";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Random "mo:core/Random";
import Sha256 "mo:sha2/Sha256";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import AuthTypes "../types/auth";
import List "mo:core/List";

module {
  public type PkceSession = AuthTypes.PkceSession;
  public type XAuth = AuthTypes.XAuth;
  public type Transform = OutCall.Transform;

  // ── PKCE helpers ───────────────────────────────────────────────────

  // Base64url-encode a Blob (RFC 4648, §5 — no padding).
  func base64url(b : Blob) : Text {
    let alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    let alphaArr = alpha.toArray();
    let bytes = b.toArray();
    let n = bytes.size();
    let out = List.empty<Char>();
    var i = 0;
    // Process 3 input bytes at a time into 4 base64 chars
    while (i + 2 < n) {
      let b0 : Nat8 = bytes[i];
      let b1 : Nat8 = bytes[i + 1];
      let b2 : Nat8 = bytes[i + 2];
      out.add(alphaArr[(b0 >> 2).toNat()]);
      out.add(alphaArr[((b0 & 0x03) << 4 | b1 >> 4).toNat()]);
      out.add(alphaArr[((b1 & 0x0F) << 2 | b2 >> 6).toNat()]);
      out.add(alphaArr[(b2 & 0x3F).toNat()]);
      i += 3;
    };
    // Handle remaining 1 or 2 bytes (no padding in base64url)
    if (i + 1 == n) {
      let b0 : Nat8 = bytes[i];
      out.add(alphaArr[(b0 >> 2).toNat()]);
      out.add(alphaArr[((b0 & 0x03) << 4).toNat()]);
    } else if (i + 2 == n) {
      let b0 : Nat8 = bytes[i];
      let b1 : Nat8 = bytes[i + 1];
      out.add(alphaArr[(b0 >> 2).toNat()]);
      out.add(alphaArr[((b0 & 0x03) << 4 | b1 >> 4).toNat()]);
      out.add(alphaArr[((b1 & 0x0F) << 2).toNat()]);
    };
    Text.fromIter(out.values());
  };

  // Percent-encode a Text value for use in form-urlencoded bodies.
  func urlEncode(s : Text) : Text {
    let hexChars = "0123456789ABCDEF".toArray();
    var r = "";
    for (c in s.toIter()) {
      if (
        (c >= 'A' and c <= 'Z') or (c >= 'a' and c <= 'z') or
        (c >= '0' and c <= '9') or c == '-' or c == '_' or c == '.' or c == '~'
      ) {
        r #= Text.fromChar(c);
      } else {
        let bytes = Text.fromChar(c).encodeUtf8();
        for (byte in bytes.values()) {
          let n = byte.toNat();
          r #= "%" # Text.fromChar(hexChars[n / 16]) # Text.fromChar(hexChars[n % 16]);
        };
      };
    };
    r;
  };

  // Extract a JSON string field value from a flat JSON object.
  // Extract a JSON string field value from a flat JSON object.
  func jsonExtractStr(json : Text, key : Text) : ?Text {
    let needle = "\"" # key # "\"";
    let parts = json.split(#text needle);
    ignore parts.next();
    let rest = switch (parts.next()) {
      case null return null;
      case (?r) r;
    };
    var started = false;
    var result = "";
    label scan for (c in rest.toIter()) {
      if (not started) {
        if (c == '\u{22}') { started := true };
      } else {
        if (c == '\u{22}') break scan;
        result #= Text.fromChar(c);
      };
    };
    if (started) ?result else null;
  };

  // Extract a JSON integer field value.
  func jsonExtractNum(json : Text, key : Text) : ?Int {
    let needle = "\"" # key # "\"";
    let parts = json.split(#text needle);
    ignore parts.next();
    let rest = switch (parts.next()) {
      case null return null;
      case (?r) r;
    };
    var collecting = false;
    var num : Int = 0;
    label scan for (c in rest.toIter()) {
      if (not collecting) {
        if (c >= '0' and c <= '9') {
          collecting := true;
          num := digitVal(c);
        };
      } else {
        if (c >= '0' and c <= '9') {
          num := num * 10 + digitVal(c);
        } else break scan;
      };
    };
    if (collecting) ?num else null;
  };

  func digitVal(c : Char) : Int {
    switch c {
      case '0' 0; case '1' 1; case '2' 2; case '3' 3; case '4' 4;
      case '5' 5; case '6' 6; case '7' 7; case '8' 8; case _ 9;
    };
  };

  // Generates PKCE code verifier, builds and returns the authorization URL.
  // Persists the session state keyed by caller.
  public func startOAuth(
    clientId : Text,
    redirectUri : Text,
    caller : Principal,
    sessions : Map.Map<Principal, PkceSession>,
  ) : async* Text {
    let randBlob = await Random.blob();
    let codeVerifier = base64url(randBlob);
    let hashBlob = Sha256.fromBlob(#sha256, codeVerifier.encodeUtf8());
    let codeChallenge = base64url(hashBlob);
    let stateBlob = await Random.blob();
    let csrfState = base64url(stateBlob);
    sessions.add(caller, { codeVerifier; state = csrfState; redirectUri });
    "https://x.com/i/oauth2/authorize" #
      "?response_type=code" #
      "&client_id=" # urlEncode(clientId) #
      "&redirect_uri=" # urlEncode(redirectUri) #
      "&scope=tweet.read%20tweet.write%20users.read%20offline.access" #
      "&state=" # urlEncode(csrfState) #
      "&code_challenge=" # urlEncode(codeChallenge) #
      "&code_challenge_method=S256";
  };

  // Exchanges the authorization code for tokens using stored PKCE session.
  // The transform callback must come from the calling actor (shared query).
  public func exchangeCode(
    clientId : Text,
    code : Text,
    redirectUri : Text,
    caller : Principal,
    sessions : Map.Map<Principal, PkceSession>,
    transform : Transform,
  ) : async* XAuth {
    let session = switch (sessions.get(caller)) {
      case (?s) s;
      case null Runtime.trap("No active OAuth session — please restart the connection flow");
    };
    sessions.remove(caller);
    let body =
      "grant_type=authorization_code" #
      "&code=" # urlEncode(code) #
      "&redirect_uri=" # urlEncode(redirectUri) #
      "&client_id=" # urlEncode(clientId) #
      "&code_verifier=" # urlEncode(session.codeVerifier);
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
    ];
    let json = await OutCall.httpPostRequest(
      "https://api.x.com/2/oauth2/token",
      headers,
      body,
      transform,
    );
    parseXAuth(json);
  };

  // Returns the auth if still fresh; otherwise refreshes and returns new XAuth.
  // The transform callback must come from the calling actor (shared query).
  public func ensureFreshToken(
    clientId : Text,
    auth : XAuth,
    transform : Transform,
  ) : async* XAuth {
    let buffer = 60 * 1_000_000_000;
    if (Time.now() + buffer < auth.expires_at) {
      return auth;
    };
    let body =
      "grant_type=refresh_token" #
      "&refresh_token=" # urlEncode(auth.refresh_token) #
      "&client_id=" # urlEncode(clientId);
    let headers : [OutCall.Header] = [
      { name = "Content-Type"; value = "application/x-www-form-urlencoded" },
    ];
    let json = await OutCall.httpPostRequest(
      "https://api.x.com/2/oauth2/token",
      headers,
      body,
      transform,
    );
    parseXAuth(json);
  };

  // Returns whether the user has a connected X account.
  public func isConnected(
    caller : Principal,
    xAuthByUser : Map.Map<Principal, XAuth>,
  ) : Bool {
    xAuthByUser.containsKey(caller);
  };

  // Parse a token endpoint JSON response into an XAuth record.
  public func parseXAuth(json : Text) : XAuth {
    let access_token = switch (jsonExtractStr(json, "access_token")) {
      case (?t) t;
      case null Runtime.trap("X token response missing access_token: " # json);
    };
    let refresh_token = switch (jsonExtractStr(json, "refresh_token")) {
      case (?t) t;
      case null "";
    };
    let expires_in : Int = switch (jsonExtractNum(json, "expires_in")) {
      case (?n) n;
      case null 7200;
    };
    let scope_str = switch (jsonExtractStr(json, "scope")) {
      case (?s) s;
      case null "";
    };
    let scope : [Text] = if (scope_str.isEmpty()) [] else
      scope_str.split(#char ' ').toArray();
    {
      access_token;
      refresh_token;
      expires_at = Time.now() + expires_in * 1_000_000_000;
      scope;
    };
  };
};
