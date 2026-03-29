import { useMemo, useState } from "react";

import { BoardCard } from "@/components/BoardCard";
import { BoardSidebar } from "@/components/BoardSidebar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BoardMeta } from "@/lib/data";
import { boardMatchesQuery } from "@/lib/data";

export type BoardsHomeProps = {
  boards: BoardMeta[];
};

export default function BoardsHome({ boards }: BoardsHomeProps) {
  const [query, setQuery] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const filtered = useMemo(
    () => boards.filter((b) => boardMatchesQuery(b, query)),
    [boards, query],
  );

  return (
    <div className="mx-auto flex max-w-7xl">
      <div
        className={cn(
          "hidden shrink-0 overflow-hidden transition-[width] duration-200 ease-out lg:block",
          sidebarCollapsed ? "w-0" : "w-64",
        )}
      >
        <BoardSidebar boards={boards} searchQuery={query} className="w-64 border-r" />
      </div>

      <button
        type="button"
        className="border-border bg-background text-muted-foreground hover:bg-muted/60 sticky top-0 z-10 hidden h-screen w-9 shrink-0 flex-col items-center justify-center border-r text-xl font-light leading-none transition-colors lg:flex"
        onClick={() => setSidebarCollapsed((c) => !c)}
        aria-expanded={!sidebarCollapsed}
        aria-label={sidebarCollapsed ? "展开侧栏" : "收起侧栏"}
      >
        {sidebarCollapsed ? "›" : "‹"}
      </button>

      <div className="min-w-0 flex-1 px-4 sm:px-6">
        <section className="py-10 text-center sm:py-14">
          <h1 className="text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            RuyiSDK Examples
          </h1>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-base">
            在 RISC-V 开发板上运行你的第一个程序
          </p>
          <div className="mx-auto mt-6 max-w-lg">
            <Input
              type="search"
              placeholder="搜索板子、SoC、板厂、芯片厂商、核心…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="搜索开发板"
              className="h-10"
            />
          </div>
        </section>

        {filtered.length === 0 ? (
          <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center text-sm">
            没有匹配的板子，请调整搜索条件。
          </div>
        ) : (
          <ul className="grid list-none gap-5 pb-16 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((b) => (
              <li key={b.slug}>
                <BoardCard
                  product={b.product}
                  slug={b.slug}
                  cpu={b.cpu}
                  vendor={b.vendor}
                  socVendor={b.socVendor}
                  exampleCount={b.examples.length}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
