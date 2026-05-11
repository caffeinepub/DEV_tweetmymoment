import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { Link } from "@tanstack/react-router";
import { LogOut, Settings, Sparkles } from "lucide-react";

export default function NavBar() {
  const { isAuthenticated, isInitializing, principalShort, logout } = useAuth();
  const { data: isAdmin } = useIsAdmin();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <nav className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-semibold text-foreground hover:text-primary transition-colors duration-200"
          data-ocid="nav.home_link"
        >
          <Sparkles className="w-5 h-5 text-primary" />
          TweetMyMoment
        </Link>

        <div className="flex items-center gap-2">
          {isInitializing ? (
            <Skeleton className="h-8 w-24 rounded-full" />
          ) : isAuthenticated ? (
            <>
              {principalShort && (
                <span className="hidden sm:block text-xs text-muted-foreground font-mono px-2 py-1 bg-muted rounded-full">
                  {principalShort}
                </span>
              )}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  aria-label="Settings"
                  data-ocid="nav.admin_settings_link"
                >
                  <Link to="/admin">
                    <Settings className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1">Settings</span>
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                data-ocid="nav.logout_button"
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline ml-1">Logout</span>
              </Button>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
