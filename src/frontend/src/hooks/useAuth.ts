import { createActor } from "@/backend";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
  } = useInternetIdentity();
  const queryClient = useQueryClient();

  const principal = identity?.getPrincipal();
  const principalShort = principal
    ? `${principal.toString().slice(0, 8)}…`
    : null;

  function handleLogin() {
    login();
  }

  function handleLogout() {
    clear();
    queryClient.clear();
  }

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    principal,
    principalShort,
    login: handleLogin,
    logout: handleLogout,
  };
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}
