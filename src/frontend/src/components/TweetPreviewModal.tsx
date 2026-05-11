import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { SiX } from "react-icons/si";

interface TweetPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  emoji: string;
  eventLabel: string;
  tweetText: string;
  isPending: boolean;
  error: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const CHAR_LIMIT = 280;

export default function TweetPreviewModal({
  open,
  onOpenChange,
  emoji,
  eventLabel,
  tweetText,
  isPending,
  error,
  onConfirm,
  onCancel,
}: TweetPreviewModalProps) {
  const charCount = tweetText.length;
  const overLimit = charCount > CHAR_LIMIT;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-3xl max-w-md"
        data-ocid="tweet_preview.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <span>{emoji}</span>
            Preview Your Tweet
          </DialogTitle>
        </DialogHeader>

        {/* Tweet preview bubble */}
        <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <SiX className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground leading-none">
                {eventLabel}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Preview</p>
            </div>
          </div>
          <p
            className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words"
            data-ocid="tweet_preview.tweet_text"
          >
            {tweetText}
          </p>
          <div className="flex justify-end">
            <span
              className={`text-xs font-mono ${
                overLimit ? "text-destructive" : "text-muted-foreground"
              }`}
              data-ocid="tweet_preview.char_count"
            >
              {charCount} / {CHAR_LIMIT}
            </span>
          </div>
        </div>

        {/* Inline error */}
        {error && (
          <div
            className="flex items-start gap-2.5 rounded-xl bg-destructive/10 border border-destructive/20 px-3.5 py-3"
            data-ocid="tweet_preview.error_state"
          >
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-sm text-destructive leading-snug flex-1">
              {error}
            </p>
          </div>
        )}

        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button
            onClick={onConfirm}
            disabled={isPending || overLimit || !tweetText.trim()}
            className="w-full rounded-full gap-2"
            data-ocid="tweet_preview.confirm_button"
          >
            <SiX className="w-4 h-4" />
            {isPending ? "Posting…" : error ? "Retry" : "Share on X"}
          </Button>
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
            className="w-full rounded-full"
            data-ocid="tweet_preview.cancel_button"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface TweetSuccessBannerProps {
  show: boolean;
  onDismiss: () => void;
}

export function TweetSuccessBanner({
  show,
  onDismiss,
}: TweetSuccessBannerProps) {
  if (!show) return null;
  return (
    <div
      className="flex items-center gap-3 p-4 bg-accent/10 border border-accent/30 rounded-2xl shadow-xs animate-in fade-in slide-in-from-top-2 duration-300"
      data-ocid="tweet_preview.success_state"
    >
      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
      <p className="text-sm text-foreground flex-1 font-medium">
        Your moment has been shared on X! 🎉
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDismiss}
        className="shrink-0 text-xs text-muted-foreground h-7 px-2 rounded-full"
        data-ocid="tweet_preview.close_button"
      >
        Dismiss
      </Button>
    </div>
  );
}
