import type { backendInterface } from "../backend";
import { EventKind, UserRole } from "../backend";

export const mockBackend: backendInterface = {
  _initializeAccessControl: async () => undefined,
  assignCallerUserRole: async (_user, _role) => undefined,
  completeXOAuth: async (_code, _redirectUri) => undefined,
  disconnectMyX: async () => undefined,
  getCallerUserRole: async () => UserRole.user,
  isCallerAdmin: async () => false,
  isMyXConnected: async () => true,
  isXClientIdConfigured: async () => true,
  postEventTweet: async (_req) => "https://twitter.com/i/web/status/1234567890",
  setXClientId: async (_id) => undefined,
  startXOAuth: async (_redirectUri) =>
    "https://twitter.com/i/oauth2/authorize?response_type=code&client_id=mock&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Foauth%2Fcallback&scope=tweet.write+users.read+offline.access&state=mock_state&code_challenge=mock_challenge&code_challenge_method=S256",
  xPostTransform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
  xTransform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
};
