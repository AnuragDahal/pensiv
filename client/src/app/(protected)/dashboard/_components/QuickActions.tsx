import { Button } from "@/components/ui/button";
import { PenSquare, FileText, Settings } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
      <Link href="/article/create" className="flex-1 sm:flex-initial">
        <Button
          size="lg"
          className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all font-semibold text-base"
        >
          <PenSquare size={20} className="mr-2" />
          Create New Article
        </Button>
      </Link>

      <Link href="/article?author=me" className="flex-1 sm:flex-initial">
        <Button
          size="lg"
          variant="outline"
          className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 rounded-xl border-border/50 hover:border-primary/30 transition-all font-semibold text-base"
        >
          <FileText size={20} className="mr-2" />
          View All Articles
        </Button>
      </Link>

      <Link href="/settings" className="flex-1 sm:flex-initial">
        <Button
          size="lg"
          variant="outline"
          className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 rounded-xl border-border/50 hover:border-primary/30 transition-all font-semibold text-base"
        >
          <Settings size={20} className="mr-2" />
          Settings
        </Button>
      </Link>
    </div>
  );
}
