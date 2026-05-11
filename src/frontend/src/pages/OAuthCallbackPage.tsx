import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompleteXOAuth } from "@/hooks/useXConnection";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiX } from "react-icons/si";

export default function OAuthCallbackPage() {
  const completeOAuth = useCompleteXOAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMsg, setErrorMsg] = useState("");
  const completed = useRef(false);
  const mutateRef = useRef(completeOAuth.mutate);
  const navigateRef = useRef(navigate);

  useEffect(() => {
    mutateRef.current = completeOAuth.mutate;
  });

  useEffect(() => {
    navigateRef.current = navigate;
  });

  useEffect(() => {
    if (completed.current) return;
    completed.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

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
  }, []);

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
