import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function useXClientIdStatus() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<boolean>({
    queryKey: ["isXClientIdConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isXClientIdConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

function useSetXClientId() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setXClientId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isXClientIdConfigured"] });
    },
  });
}

export default function AdminPage() {
  const { data: isConfigured, isLoading } = useXClientIdStatus();
  const setClientId = useSetXClientId();
  const [clientIdInput, setClientIdInput] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = clientIdInput.trim();
    if (!id) return;
    try {
      await setClientId.mutateAsync(id);
      toast.success("X Client ID saved successfully!");
      setClientIdInput("");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to save. Please try again.",
      );
    }
  }

  return (
    <div
      className="max-w-lg mx-auto px-4 py-10 space-y-8"
      data-ocid="admin.page"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Admin Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure TweetMyMoment for all users
          </p>
        </div>
      </div>

      <div
        className="bg-card border border-border rounded-3xl p-6 shadow-xs space-y-5"
        data-ocid="admin.client_id_section"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground text-base">
              X Developer App
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your X (Twitter) Client ID from the Developer Portal
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-6 w-24 rounded-full" />
          ) : isConfigured ? (
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full text-accent"
              data-ocid="admin.configured_badge"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Configured
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="gap-1.5 rounded-full text-muted-foreground"
              data-ocid="admin.not_configured_badge"
            >
              <XCircle className="w-3.5 h-3.5" />
              Not configured
            </Badge>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-3"
          data-ocid="admin.client_id_form"
        >
          <div className="space-y-1.5">
            <Label htmlFor="client-id" className="text-sm">
              Client ID
            </Label>
            <Input
              id="client-id"
              type="password"
              placeholder="Paste your X Client ID here"
              value={clientIdInput}
              onChange={(e) => setClientIdInput(e.target.value)}
              className="rounded-xl"
              autoComplete="off"
              data-ocid="admin.client_id_input"
            />
          </div>
          <Button
            type="submit"
            disabled={!clientIdInput.trim() || setClientId.isPending}
            className="w-full rounded-full"
            data-ocid="admin.save_client_id_button"
          >
            {setClientId.isPending
              ? "Saving…"
              : isConfigured
                ? "Update Client ID"
                : "Save Client ID"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Find your Client ID in the{" "}
          <a
            href="https://developer.x.com/en/portal/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            X Developer Portal
          </a>
          . This is a public identifier (not a secret) used for the OAuth flow.
        </p>
      </div>
    </div>
  );
}
