"use client";

import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  FaTwitter,
  FaFacebook,
  FaLinkedin,
  FaReddit,
  FaWhatsapp,
} from "react-icons/fa";

export const ShareButton = ({
  title,
  text,
}: {
  title: string;
  text: string;
}) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const shareLinks = [
    {
      name: "Twitter",
      icon: FaTwitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title
      )}&url=${encodeURIComponent(currentUrl)}`,
      color: "hover:bg-blue-50 hover:text-blue-600",
      iconColor: "text-blue-400",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
      color: "hover:bg-blue-50 hover:text-blue-700",
      iconColor: "text-blue-600",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        currentUrl
      )}`,
      color: "hover:bg-blue-50 hover:text-blue-800",
      iconColor: "text-blue-700",
    },
    {
      name: "Reddit",
      icon: FaReddit,
      url: `https://reddit.com/submit?url=${encodeURIComponent(
        currentUrl
      )}&title=${encodeURIComponent(title)}`,
      color: "hover:bg-orange-50 hover:text-orange-600",
      iconColor: "text-orange-500",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${encodeURIComponent(
        `${title} ${currentUrl}`
      )}`,
      color: "hover:bg-green-50 hover:text-green-600",
      iconColor: "text-green-500",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400">
          <Share2 size={18} />
          <span className="text-sm font-medium">Share</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this article</DialogTitle>
          <DialogDescription>
            Share this article with your friends and followers
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Social Media Links */}
          <div className="grid grid-cols-5 gap-2">
            {shareLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-3 rounded-lg border border-border transition-all ${platform.color} group`}
                onClick={() => setOpen(false)}
              >
                <platform.icon
                  className={`w-6 h-6 ${platform.iconColor} transition-transform group-hover:scale-110`}
                />
                <span className="text-xs mt-1.5 font-medium text-muted-foreground group-hover:text-current">
                  {platform.name}
                </span>
              </a>
            ))}
          </div>

          {/* Copy Link */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Or copy link</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentUrl}
                readOnly
                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
