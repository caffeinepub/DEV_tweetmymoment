import { createActor } from "@/backend";
import TweetPreviewModal, {
  TweetSuccessBanner,
} from "@/components/TweetPreviewModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useDisconnectX,
  useStartXOAuth,
  useXConnection,
} from "@/hooks/useXConnection";
import { EVENT_CONFIGS, type EventKind, type PostRequest } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle, Unlink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiX } from "react-icons/si";

type EventConfigItem = (typeof EVENT_CONFIGS)[0];

function usePostEventTweet() {
  const { actor } = useActor(createActor);
  return useMutation({
    mutationFn: async (req: PostRequest) => {
      if (!actor) throw new Error("Actor not available");
      return actor.postEventTweet(req);
    },
  });
}

// Step 1: "Other" custom text compose dialog
function OtherComposeDialog({
  open,
  onOpenChange,
  onPreview,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onPreview: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const charLimit = 280;
  const over = text.length > charLimit;

  function handleNext() {
    if (!text.trim() || over) return;
    const hashtag = "#TweetMyMoment";
    const full = text.includes(hashtag) ? text : `${text}\n\n${hashtag}`;
    onPreview(full);
  }

  // Reset text when dialog reopens
  useEffect(() => {
    if (open) setText("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-3xl max-w-md"
        data-ocid="events.other_compose_dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <span>✨</span> What's Your Moment?
          </DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your special moment with the world…"
            rows={6}
            className="resize-none rounded-2xl text-sm leading-relaxed"
            autoFocus
            data-ocid="events.other_textarea"
          />
          <span
            className={`absolute bottom-2 right-3 text-xs ${
              over ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {text.length}/{charLimit}
          </span>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            onClick={handleNext}
            disabled={!text.trim() || over}
            className="w-full rounded-full gap-2"
            data-ocid="events.other_preview_button"
          >
            Preview Tweet
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full"
            data-ocid="events.other_cancel_button"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function EventsPage() {
  const { data: isConnected, isLoading: connectionLoading } = useXConnection();
  const startOAuth = useStartXOAuth();
  const disconnect = useDisconnectX();
  const postTweet = usePostEventTweet();

  const [selectedEvent, setSelectedEvent] = useState<EventConfigItem | null>(
    null,
  );
  const [composeOpen, setComposeOpen] = useState(false); // Only for "Other"
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [postError, setPostError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearSuccessTimer() {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  }

  function triggerSuccess() {
    setShowSuccess(true);
    clearSuccessTimer();
    successTimerRef.current = setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  }

  function dismissSuccess() {
    clearSuccessTimer();
    setShowSuccess(false);
  }

  function openEvent(config: EventConfigItem) {
    setSelectedEvent(config);
    setPostError(null);
    postTweet.reset();

    if (config.kind === ("Other" as EventKind)) {
      setComposeOpen(true);
    } else {
      const hashtags = config.hashtags.join(" ");
      setPreviewText(`${config.template}\n\n${hashtags}`);
      setPreviewOpen(true);
    }
  }

  function handleOtherPreview(text: string) {
    setComposeOpen(false);
    setPreviewText(text);
    setPreviewOpen(true);
  }

  async function handleConfirmTweet() {
    if (!selectedEvent) return;
    setPostError(null);
    try {
      await postTweet.mutateAsync({
        event: selectedEvent.kind as EventKind,
        customText: previewText,
      });
      setPreviewOpen(false);
      setSelectedEvent(null);
      setPreviewText("");
      triggerSuccess();
    } catch (err) {
      setPostError(
        err instanceof Error
          ? err.message
          : "Failed to post. Please try again.",
      );
    }
  }

  function handlePreviewCancel() {
    setPreviewOpen(false);
    setPostError(null);
    postTweet.reset();
    setSelectedEvent(null);
    setPreviewText("");
  }

  function handleConnectX() {
    const redirectUri = `${window.location.origin}/oauth/callback`;
    startOAuth.mutate(redirectUri);
  }

  return (
    <div
      className="max-w-2xl mx-auto px-4 py-8 space-y-6"
      data-ocid="events.page"
    >
      {/* Success banner */}
      <TweetSuccessBanner show={showSuccess} onDismiss={dismissSuccess} />

      {/* X connection status */}
      {connectionLoading ? (
        <Skeleton className="h-12 w-full rounded-2xl" />
      ) : !isConnected ? (
        <div
          className="flex items-center gap-3 p-4 bg-card border border-border rounded-2xl shadow-xs"
          data-ocid="events.x_connect_banner"
        >
          <AlertCircle className="w-5 h-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground flex-1">
            Connect your X account to start sharing moments.
          </p>
          <Button
            type="button"
            size="sm"
            onClick={handleConnectX}
            disabled={startOAuth.isPending}
            className="rounded-full shrink-0 gap-1.5"
            data-ocid="events.connect_x_button"
          >
            <SiX className="w-3.5 h-3.5" />
            Connect X
          </Button>
        </div>
      ) : (
        <div
          className="flex items-center gap-3 p-3 bg-accent/10 border border-accent/20 rounded-2xl"
          data-ocid="events.x_connected_badge"
        >
          <Badge variant="secondary" className="gap-1.5 rounded-full">
            <SiX className="w-3 h-3" />X Connected
          </Badge>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => disconnect.mutate()}
            disabled={disconnect.isPending}
            className="ml-auto text-muted-foreground hover:text-destructive gap-1.5 text-xs"
            data-ocid="events.disconnect_x_button"
          >
            <Unlink className="w-3.5 h-3.5" />
            Disconnect
          </Button>
        </div>
      )}

      {/* Event grid */}
      <section data-ocid="events.grid_section">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Share Your Moment
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {EVENT_CONFIGS.map((config, index) => (
            <button
              key={config.kind}
              type="button"
              onClick={() => openEvent(config)}
              disabled={!isConnected}
              className="group bg-card border border-border rounded-3xl p-6 flex flex-col items-center gap-3 shadow-xs hover:shadow-elevated hover:border-primary/30 hover:bg-primary/5 transition-smooth disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              data-ocid={`events.event_button.${index + 1}`}
            >
              <span className="text-4xl group-hover:scale-110 transition-smooth">
                {config.emoji}
              </span>
              <span className="font-display font-semibold text-foreground text-sm">
                {config.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Other: custom text compose */}
      <OtherComposeDialog
        open={composeOpen}
        onOpenChange={setComposeOpen}
        onPreview={handleOtherPreview}
      />

      {/* Tweet preview + confirm */}
      <TweetPreviewModal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        emoji={selectedEvent?.emoji ?? ""}
        eventLabel={selectedEvent?.label ?? ""}
        tweetText={previewText}
        isPending={postTweet.isPending}
        error={postError}
        onConfirm={handleConfirmTweet}
        onCancel={handlePreviewCancel}
      />
    </div>
  );
}
