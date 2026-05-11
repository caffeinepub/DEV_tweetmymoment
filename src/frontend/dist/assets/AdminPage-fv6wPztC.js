import { c as createLucideIcon, j as jsxRuntimeExports, e as cn, r as reactExports, h as createSlot, S as Skeleton, B as Button, i as ue, f as useActor, k as useQuery, l as useQueryClient, g as createActor } from "./index-DXWA2vRi.js";
import { B as Badge } from "./badge-BkOGAB9i.js";
import { C as CircleCheck, u as useMutation } from "./circle-check-1qbBJyYY.js";
import { C as CircleX } from "./circle-x-DbqPQawS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Label";
var Label$1 = reactExports.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        var _a;
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        (_a = props.onMouseDown) == null ? void 0 : _a.call(props, event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label$1.displayName = NAME;
var Root = Label$1;
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function useXClientIdStatus() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["isXClientIdConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isXClientIdConfigured();
    },
    enabled: !!actor && !isFetching
  });
}
function useSetXClientId() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.setXClientId(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isXClientIdConfigured"] });
    }
  });
}
function AdminPage() {
  const { data: isConfigured, isLoading } = useXClientIdStatus();
  const setClientId = useSetXClientId();
  const [clientIdInput, setClientIdInput] = reactExports.useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    const id = clientIdInput.trim();
    if (!id) return;
    try {
      await setClientId.mutateAsync(id);
      ue.success("X Client ID saved successfully!");
      setClientIdInput("");
    } catch (err) {
      ue.error(
        err instanceof Error ? err.message : "Failed to save. Please try again."
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-lg mx-auto px-4 py-10 space-y-8",
      "data-ocid": "admin.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-semibold text-foreground", children: "Admin Settings" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Configure TweetMyMoment for all users" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-3xl p-6 shadow-xs space-y-5",
            "data-ocid": "admin.client_id_section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground text-base", children: "X Developer App" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Your X (Twitter) Client ID from the Developer Portal" })
                ] }),
                isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24 rounded-full" }) : isConfigured ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "secondary",
                    className: "gap-1.5 rounded-full text-accent",
                    "data-ocid": "admin.configured_badge",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
                      "Configured"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    variant: "outline",
                    className: "gap-1.5 rounded-full text-muted-foreground",
                    "data-ocid": "admin.not_configured_badge",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                      "Not configured"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "form",
                {
                  onSubmit: handleSubmit,
                  className: "space-y-3",
                  "data-ocid": "admin.client_id_form",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "client-id", className: "text-sm", children: "Client ID" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "client-id",
                          type: "password",
                          placeholder: "Paste your X Client ID here",
                          value: clientIdInput,
                          onChange: (e) => setClientIdInput(e.target.value),
                          className: "rounded-xl",
                          autoComplete: "off",
                          "data-ocid": "admin.client_id_input"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "submit",
                        disabled: !clientIdInput.trim() || setClientId.isPending,
                        className: "w-full rounded-full",
                        "data-ocid": "admin.save_client_id_button",
                        children: setClientId.isPending ? "Saving…" : isConfigured ? "Update Client ID" : "Save Client ID"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
                "Find your Client ID in the",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: "https://developer.x.com/en/portal/dashboard",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "underline underline-offset-2 hover:text-foreground transition-colors",
                    children: "X Developer Portal"
                  }
                ),
                ". This is a public identifier (not a secret) used for the OAuth flow."
              ] })
            ]
          }
        )
      ]
    }
  );
}
export {
  AdminPage as default
};
