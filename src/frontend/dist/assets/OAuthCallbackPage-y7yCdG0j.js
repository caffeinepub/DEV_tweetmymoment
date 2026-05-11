import { o as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Skeleton, B as Button } from "./index-DNKqcXcV.js";
import { c as useCompleteXOAuth, S as SiX } from "./useXConnection-DzKPq9bk.js";
import { C as CircleCheck } from "./circle-check-BzY5oJ9I.js";
import { C as CircleX } from "./circle-x-B9n09u7C.js";
function OAuthCallbackPage() {
  const completeOAuth = useCompleteXOAuth();
  const navigate = useNavigate();
  const [status, setStatus] = reactExports.useState(
    "loading"
  );
  const [errorMsg, setErrorMsg] = reactExports.useState("");
  const completed = reactExports.useRef(false);
  const mutateRef = reactExports.useRef(completeOAuth.mutate);
  const navigateRef = reactExports.useRef(navigate);
  reactExports.useEffect(() => {
    mutateRef.current = completeOAuth.mutate;
  });
  reactExports.useEffect(() => {
    navigateRef.current = navigate;
  });
  reactExports.useEffect(() => {
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
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex-1 flex items-center justify-center px-4 py-16 min-h-[calc(100vh-8rem)]",
      "data-ocid": "oauth_callback.page",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm text-center space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-3xl bg-muted flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SiX, { className: "w-8 h-8 text-foreground" }) }),
        status === "loading" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "oauth_callback.loading_state", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48 mx-auto rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-64 mx-auto rounded-full" })
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
