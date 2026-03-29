import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import type { BoardMeta, SiliconVendorGroup } from "@/lib/data";
import {
  boardMatchesQuery,
  groupBoardsBySiliconVendorChip,
  slugifyUrlSegment,
  socSlugFromCpu,
} from "@/lib/data";

export type BoardSidebarProps = {
  boards: BoardMeta[];
  /** 与首页主搜索框同步 */
  searchQuery: string;
  className?: string;
};

export function BoardSidebar({ boards, searchQuery, className }: BoardSidebarProps) {
  const [expandedVendors, setExpandedVendors] = useState<Set<string>>(() =>
    new Set(boards.map((b) => b.socVendor ?? "Unknown")),
  );
  const [expandedChips, setExpandedChips] = useState<Set<string>>(() =>
    new Set(boards.map((b) => `${b.socVendor ?? "Unknown"}::${b.cpu || "Unknown"}`)),
  );

  const tree: SiliconVendorGroup[] = useMemo(() => {
    const all = groupBoardsBySiliconVendorChip(boards);
    const q = searchQuery.trim();
    if (!q) return all;
    return all
      .map((vg) => ({
        ...vg,
        chips: vg.chips
          .map((cg) => ({
            ...cg,
            boards: cg.boards.filter((b) => boardMatchesQuery(b, q)),
          }))
          .filter((cg) => cg.boards.length > 0),
      }))
      .filter((vg) => vg.chips.length > 0);
  }, [boards, searchQuery]);

  function toggleVendor(siliconVendor: string) {
    setExpandedVendors((prev) => {
      const next = new Set(prev);
      if (next.has(siliconVendor)) next.delete(siliconVendor);
      else next.add(siliconVendor);
      return next;
    });
  }

  function toggleChip(key: string) {
    setExpandedChips((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "border-border sticky top-0 h-screen w-64 shrink-0 overflow-y-auto border-r",
        className,
      )}
    >
      <nav className="px-2 pb-6 pt-4">
        {tree.length === 0 && (
          <p className="text-muted-foreground px-3 py-4 text-center text-xs">无匹配</p>
        )}

        {tree.map((vg) => {
          const vendorOpen = expandedVendors.has(vg.siliconVendor);
          const vendorHref = `/vendors/${encodeURIComponent(slugifyUrlSegment(vg.siliconVendor))}/`;
          return (
            <div key={vg.siliconVendor} className="mb-1">
              <div className="hover:bg-muted/60 flex w-full items-center justify-between rounded-md px-2 py-1.5">
                <a
                  href={vendorHref}
                  className="text-foreground min-w-0 flex-1 truncate text-sm font-semibold underline-offset-4 hover:underline"
                >
                  {vg.siliconVendor}
                </a>
                <button
                  type="button"
                  onClick={() => toggleVendor(vg.siliconVendor)}
                  className="text-muted-foreground hover:text-foreground shrink-0 rounded p-0.5"
                  aria-label={vendorOpen ? "折叠" : "展开"}
                >
                  <ChevronIcon open={vendorOpen} />
                </button>
              </div>

              {vendorOpen && (
                <div className="ml-2">
                  {vg.chips.map((cg) => {
                    const chipKey = `${vg.siliconVendor}::${cg.cpu}`;
                    const chipOpen = expandedChips.has(chipKey);
                    const socHref = `/socs/${encodeURIComponent(socSlugFromCpu(cg.cpu))}/`;
                    return (
                      <div key={chipKey}>
                        <div className="hover:bg-muted/40 flex w-full items-center justify-between rounded-md px-2 py-1">
                          <a
                            href={socHref}
                            className="text-muted-foreground min-w-0 flex-1 truncate text-sm underline-offset-4 hover:underline"
                          >
                            {cg.cpu}
                          </a>
                          <button
                            type="button"
                            onClick={() => toggleChip(chipKey)}
                            className="text-muted-foreground hover:text-foreground shrink-0 rounded p-0.5"
                            aria-label={chipOpen ? "折叠" : "展开"}
                          >
                            <ChevronIcon open={chipOpen} />
                          </button>
                        </div>

                        {chipOpen && (
                          <div className="ml-2">
                            {cg.boards.map((b) => (
                              <a
                                key={b.slug}
                                href={`/boards/${encodeURIComponent(b.slug)}/`}
                                className="text-foreground hover:bg-muted/60 flex items-center justify-between rounded-md px-3 py-1.5 text-sm transition-colors"
                              >
                                <span className="truncate">{b.product}</span>
                                <span className="text-muted-foreground ml-2 shrink-0 text-xs tabular-nums">
                                  {b.examples.length}
                                </span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={cn(
        "text-muted-foreground shrink-0 transition-transform duration-150",
        open && "rotate-90",
      )}
    >
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
