import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompleteXOAuth } from "@/hooks/useXConnection";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiX } from "react-icons/si";

export default function OAuthCallbackPage() {
  const { isActorReady, mutate } = useCompleteXOAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");
  // Track whether the mutation has already been fired
  const completed = useRef(false);
  const mutateRef = useRef(mutate);
  const navigateRef = useRef(navigate);

  useEffect(() => {
    mutateRef.current = mutate;
  });

  useEffect(() => {
    navigateRef.current = navigate;
  });

  // Extract URL params once — they won't change
  const paramsRef = useRef(() => {
    const p = new URLSearchParams(window.location.search);
    return { code: p.get("code"), error: p.get("error") };
  });

  // Start a 15-second timeout: if the actor never becomes ready, show the error
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (!completed.current) {
        completed.current = true;
        setStatus("error");
        setErrorMsg("Actor not available — please try again.");
      }
    }, 15_000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Fire the mutation exactly once, as soon as the actor is ready
  useEffect(() => {
    if (!isActorReady || completed.current) return;

    // Cancel the timeout — actor arrived in time
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    completed.current = true;

    const { code, error } = paramsRef.current();

    if (error) {
      setStatus("error");
      setErrorMsg("Authorization was denied or cancelled.");
      return;
    }

    if (!code) {
      setStatus("error");
      setErrorMsg("No authorization code received from X.");
      return;
    }

    const redirectUri = `${window.location.origin}/oauth/callback`;

    mutateRef.current(
      { code, redirectUri },
      {
        onSuccess: () => {
          setStatus("success");
          setTimeout(() => navigateRef.current({ to: "/" }), 2000);
        },
        onError: (err) => {
          setStatus("error");
          setErrorMsg(
            err instanceof Error
              ? err.message
              : "Failed to complete X authorization.",
          );
        },
      },
    );
  }, [isActorReady]);

  return (
    <div
      className="flex-1 flex items-center justify-center px-4 py-16 min-h-[calc(100vh-8rem)]"
      data-ocid="oauth_callback.page"
    >
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto">
          <SiX className="w-8 h-8 text-foreground" />
        </div>

        {status === "loading" && (
          <div className="space-y-3" data-ocid="oauth_callback.loading_state">
            <Skeleton className="h-6 w-48 mx-auto rounded-full" />
            <Skeleton className="h-4 w-64 mx-auto rounded-full" />
            <p className="text-sm text-muted-foreground animate-pulse">
              Connecting to X…
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-2" data-ocid="oauth_callback.success_state">
            <CheckCircle2 className="w-8 h-8 text-accent mx-auto" />
            <h2 className="font-display text-xl font-semibold text-foreground">
              X Connected!
            </h2>
            <p className="text-sm text-muted-foreground">
              Redirecting you back…
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4" data-ocid="oauth_callback.error_state">
            <XCircle className="w-8 h-8 text-destructive mx-auto" />
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Connection Failed
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{errorMsg}</p>
            </div>
            <Button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="rounded-full w-full"
              data-ocid="oauth_callback.back_button"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
