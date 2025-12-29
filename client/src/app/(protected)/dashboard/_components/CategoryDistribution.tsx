import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart } from "lucide-react";
import type { CategoryDistribution as CategoryDist } from "../_hooks/use-dashboard-data";

interface CategoryDistributionProps {
  distribution: CategoryDist[];
}

const categoryColors = [
  { bg: "bg-blue-500", text: "text-blue-500" },
  { bg: "bg-green-500", text: "text-green-500" },
  { bg: "bg-purple-500", text: "text-purple-500" },
  { bg: "bg-orange-500", text: "text-orange-500" },
  { bg: "bg-pink-500", text: "text-pink-500" },
  { bg: "bg-cyan-500", text: "text-cyan-500" },
  { bg: "bg-amber-500", text: "text-amber-500" },
  { bg: "bg-indigo-500", text: "text-indigo-500" },
];

export function CategoryDistribution({ distribution }: CategoryDistributionProps) {
  if (distribution.length === 0) {
    return (
      <Card className="rounded-2xl border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart size={20} className="text-primary" />
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No categories to display yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart size={20} className="text-primary" />
          Category Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {distribution.map((item, index) => {
          const color = categoryColors[index % categoryColors.length];

          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color.bg}`} />
                  <span className="text-sm font-medium capitalize">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {item.count} {item.count === 1 ? "article" : "articles"}
                  </span>
                  <span className="text-sm font-semibold">
                    {item.percentage}%
                  </span>
                </div>
              </div>
              <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${color.bg} rounded-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
