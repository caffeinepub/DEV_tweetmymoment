import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const { login, isInitializing, isLoggingIn } = useAuth();

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-4 py-16 min-h-[calc(100vh-4rem)]"
      data-ocid="login.page"
    >
      <div className="w-full max-w-sm text-center space-y-8">
        {/* Logo / Brand */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center shadow-elevated">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-semibold text-foreground leading-tight">
              TweetMyMoment
            </h1>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
              Celebrate and share your special life moments on X — marriages,
              promotions, new babies, and more.
            </p>
          </div>
        </div>

        {/* Celebration events preview */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: "💍", label: "Marriage" },
            { emoji: "🎉", label: "Promotion" },
            { emoji: "💼", label: "New Job" },
            { emoji: "👶", label: "New Baby" },
            { emoji: "🎂", label: "Birthday" },
            { emoji: "🎓", label: "Graduation" },
          ].map(({ emoji, label }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-2xl py-3 px-2 flex flex-col items-center gap-1 shadow-xs"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-muted-foreground font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Login CTA */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full rounded-full text-base font-semibold shadow-elevated hover:shadow-elevated transition-smooth"
            onClick={login}
            disabled={isInitializing || isLoggingIn}
            data-ocid="login.submit_button"
          >
            {isInitializing
              ? "Loading…"
              : isLoggingIn
                ? "Opening login…"
                : "Sign in with Internet Identity"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Secure, private login — no password required.
          </p>
        </div>
      </div>
    </div>
  );
}
