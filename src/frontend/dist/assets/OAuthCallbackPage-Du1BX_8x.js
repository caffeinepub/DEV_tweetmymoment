import { o as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, B as Button } from "./index-DXWA2vRi.js";
import { c as useCompleteXOAuth, S as SiX } from "./useXConnection-D7Lnas1m.js";
import { C as CircleCheck } from "./circle-check-1qbBJyYY.js";
import { C as CircleX } from "./circle-x-DbqPQawS.js";
function OAuthCallbackPage() {
  const { isActorReady, mutate } = useCompleteXOAuth();
  const navigate = useNavigate();
  const [status, setStatus] = reactExports.useState(
    "loading"
  );
  const [errorMsg, setErrorMsg] = reactExports.useState("");
  const completed = reactExports.useRef(false);
  const mutateRef = reactExports.useRef(mutate);
  const navigateRef = reactExports.useRef(navigate);
  reactExports.useEffect(() => {
    mutateRef.current = mutate;
  });
  reactExports.useEffect(() => {
    navigateRef.current = navigate;
  });
  const paramsRef = reactExports.useRef(() => {
    const p = new URLSearchParams(window.location.search);
    return { code: p.get("code"), error: p.get("error") };
  });
  const timeoutRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      if (!completed.current) {
        completed.current = true;
        setStatus("error");
        setErrorMsg("Actor not available — please try again.");
      }
    }, 15e3);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    if (!isActorReady || completed.current) return;
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
          setTimeout(() => navigateRef.current({ to: "/" }), 2e3);
        },
        onError: (err) => {
          setStatus("error");
          setErrorMsg(
            err instanceof Error ? err.message : "Failed to complete X authorization."
          );
        }
      }
    );
  }, [isActorReady]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex-1 flex items-center justify-center px-4 py-16 min-h-[calc(100vh-8rem)]",
      "data-ocid": "oauth_callback.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm text-center space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SiX, { className: "w-8 h-8 text-foreground" }) }),
        status === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "oauth_callback.loading_state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48 mx-auto rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-64 mx-auto rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground animate-pulse", children: "Connecting to X…" })
        ] }),
        status === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "oauth_callback.success_state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-accent mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "X Connected!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Redirecting you back…" })
        ] }),
        status === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "oauth_callback.error_state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-8 h-8 text-destructive mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground", children: "Connection Failed" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: errorMsg })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              onClick: () => navigate({ to: "/" }),
              className: "rounded-full w-full",
              "data-ocid": "oauth_callback.back_button",
              children: "Back to Home"
            }
          )
        ] })
      ] })
    }
  );
}
export {
  OAuthCallbackPage as default
};
