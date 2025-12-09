import { Share2 } from "lucide-react";
import { toast } from "sonner";

export const ShareButton = ({
  title,
  text,
}: {
  title: string;
  text: string;
}) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
    >
      <Share2 />
      <span className="text-sm font-medium">Share</span>
    </button>
  );
};
