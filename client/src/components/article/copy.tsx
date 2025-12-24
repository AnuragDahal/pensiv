import { Button } from "@/components/ui/button";
import { Check, Copy as CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
interface CopyProps {
  content: string;
}

const Copy = ({ content }: CopyProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      toast.success("Copied to clipboard!");

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.log(err);
      toast.error("Failed to copy!");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={copyToClipboard}
      className="h-8 w-8 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
      aria-label={isCopied ? "Copied!" : "Copy code"}
    >
      {isCopied ? (
        <Check className="h-4 w-4" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );
};

export default Copy;
