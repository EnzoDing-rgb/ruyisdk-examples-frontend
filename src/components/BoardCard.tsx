import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type BoardCardProps = {
  product: string;
  slug: string;
  cpu: string;
  vendor: string;
  exampleCount: number;
  className?: string;
};

export function BoardCard({ product, slug, cpu, vendor, exampleCount, className }: BoardCardProps) {
  const href = `/boards/${encodeURIComponent(slug)}/`;

  return (
    <a
      href={href}
      className={cn(
        "block rounded-xl outline-none ring-offset-background transition-transform duration-150 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Card className="h-full transition-shadow duration-150 hover:shadow-md">
        <CardHeader className="gap-1.5 pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold leading-snug">{product}</CardTitle>
            <Badge variant="secondary" className="shrink-0 text-xs">
              {exampleCount} 个示例
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm">
            {cpu || "—"}
            {vendor ? ` · ${vendor}` : ""}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}
