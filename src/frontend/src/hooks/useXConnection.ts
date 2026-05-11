import { createActor } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useXConnection() {
  const { actor, isFetching } = useActor(createActor);
  const { isAuthenticated } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ["isMyXConnected"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isMyXConnected();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useStartXOAuth() {
  const { actor } = useActor(createActor);

  return useMutation({
    mutationFn: async (redirectUri: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.startXOAuth(redirectUri);
    },
    onSuccess: (authUrl: string) => {
      window.location.href = authUrl;
    },
  });
}

export function useCompleteXOAuth() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      code,
      redirectUri,
    }: { code: string; redirectUri: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.completeXOAuth(code, redirectUri);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isMyXConnected"] });
    },
  });
}

export function useDisconnectX() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.disconnectMyX();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isMyXConnected"] });
    },
  });
}
