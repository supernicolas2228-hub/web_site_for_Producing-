"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClicksChart } from "@/components/admin/ClicksChart";
import { MetricCard } from "@/components/admin/MetricCard";
import { VisitsChart } from "@/components/admin/VisitsChart";
import { site } from "@/config/content";
import { ANALYTICS_UTM_NONE_LABEL, type AdminAnalytics } from "@/lib/analytics";

function formatLeadData(raw: string | null): string {
  if (!raw) return "—";
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    const utm = o.utm as Record<string, string> | undefined;
    if (utm?.utm_source) return `utm: ${utm.utm_source}`;
    return JSON.stringify(o).slice(0, 120);
  } catch {
    return raw.slice(0, 120);
  }
}

export function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<AdminAnalytics | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/analytics", { cache: "no-store" });
        if (res.status === 401) {
          router.replace("/admin/login");
          return;
        }
        if (!res.ok) throw new Error("load");
        const json = (await res.json()) as AdminAnalytics;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setErr("Не удалось загрузить аналитику");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  if (err) {
    return <p className="text-accent">{err}</p>;
  }

  if (!data) {
    return <p className="text-zinc-500 dark:text-white">Загрузка...</p>;
  }

  const ranges = [
    { key: "today" as const, title: "Сегодня" },
    { key: "week" as const, title: "7 дней" },
    { key: "month" as const, title: "30 дней" },
  ];

  const panel =
    "rounded-xl border border-stroke/20 bg-white/85 p-4 shadow-plate backdrop-blur-xl dark:border-white/20 dark:bg-black/50 sm:p-5";

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wide text-zinc-900 sm:text-5xl dark:text-white">
            Аналитика
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-white">
            {(site.name.trim() || site.nameEn).trim() || "Сайт"} — дашборд
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ThemeToggle />
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full border-2 border-zinc-300 bg-white px-6 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-900 shadow-md shadow-zinc-900/10 hover:border-accent hover:text-accent dark:border-white/20 dark:bg-black/50 dark:text-white dark:shadow-plate dark:backdrop-blur-xl dark:hover:text-white"
          >
            На сайт
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-accent/40 bg-accent/10 px-5 text-sm font-semibold text-accent hover:bg-accent/15"
          >
            Выйти
          </button>
        </div>
      </div>

      {ranges.map(({ key, title }) => {
        const m = data[key];
        return (
          <section key={key}>
            <h2 className="mb-4 font-display text-xl uppercase tracking-wide text-zinc-800 dark:text-white">
              {title}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <MetricCard label="Посещения" value={m.visits} />
              <MetricCard label="Запрос" value={m.starterClicks} />
              <MetricCard label="К тарифам" value={m.productClicks} />
              <MetricCard label="CTA" value={m.pricingClicks} />
              <MetricCard label="Конверсия" value={`${m.conversionPct}%`} hint="все клики / визиты" />
            </div>
          </section>
        );
      })}

      <div className="grid gap-6 lg:grid-cols-2">
        <VisitsChart data={data.visitsByDay} />
        <ClicksChart
          data={data.clicksByLabel.map(({ name, count }) => ({ name, count }))}
        />
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <div
          className={`${panel} relative overflow-hidden`}
        >
          <div
            className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-accent/[0.07] blur-2xl dark:bg-accent/[0.12]"
            aria-hidden
          />
          <div className="relative">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h3 className="font-display text-lg uppercase tracking-wide text-zinc-800 dark:text-white">
                Источники (UTM)
              </h3>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-white/80">
                окно 30 дней · {data.month.visits} визитов
              </p>
            </div>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-zinc-600 dark:text-white/85">
              Считаются открытия главной и страниц с <span className="font-mono text-[11px] text-accent">?utm_source=…</span> в
              ссылке. Строка «{ANALYTICS_UTM_NONE_LABEL}» — переходы без этой метки.
            </p>

            {data.month.visits === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-stroke/25 bg-white/50 px-5 py-10 text-center dark:border-white/15 dark:bg-black/25">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-stroke/15 bg-white shadow-sm dark:border-white/10 dark:bg-black/40"
                  aria-hidden
                >
                  <svg className="h-7 w-7 text-accent/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <p className="font-display text-sm uppercase tracking-wide text-zinc-800 dark:text-white">
                  Пока нет визитов
                </p>
                <p className="mx-auto mt-2 max-w-xs text-xs text-zinc-600 dark:text-white/75">
                  Как только появятся просмотры, здесь покажется доля с UTM и без метки.
                </p>
              </div>
            ) : (
              <ul className="mt-6 space-y-3">
                {(() => {
                  const max = Math.max(1, ...data.utmSources.map((r) => r.count));
                  return data.utmSources.map((row) => {
                    const pct = Math.round((row.count / max) * 100);
                    const isNone = row.source === ANALYTICS_UTM_NONE_LABEL;
                    return (
                      <li
                        key={row.source}
                        className="rounded-xl border border-stroke/12 bg-gradient-to-br from-white/90 to-zinc-50/80 px-4 py-3 shadow-[0_1px_0_rgb(15_23_39_/0.04)] dark:border-white/10 dark:from-black/45 dark:to-black/25 dark:shadow-none"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`min-w-0 truncate text-sm font-medium ${
                              isNone ? "text-zinc-500 dark:text-white/70" : "text-zinc-800 dark:text-white"
                            }`}
                          >
                            {isNone ? (
                              <span className="flex items-center gap-2">
                                <span
                                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-zinc-200/90 text-[10px] font-bold text-zinc-600 dark:bg-white/10 dark:text-white/80"
                                  aria-hidden
                                >
                                  —
                                </span>
                                {row.source}
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <span
                                  className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-[10px] font-bold uppercase text-accent dark:bg-accent/25"
                                  aria-hidden
                                >
                                  #
                                </span>
                                <span className="font-mono text-[13px] tracking-tight">{row.source}</span>
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 rounded-lg bg-white/90 px-2.5 py-1 font-mono text-sm tabular-nums font-semibold text-zinc-900 shadow-sm dark:bg-white/10 dark:text-white">
                            {row.count}
                          </span>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200/80 dark:bg-white/[0.08]">
                          <div
                            className={`h-full rounded-full transition-[width] duration-500 ease-out ${
                              isNone
                                ? "bg-gradient-to-r from-zinc-400/50 to-zinc-500/40 dark:from-white/25 dark:to-white/15"
                                : "bg-gradient-to-r from-accent/90 to-[#c41e1e]"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  });
                })()}
              </ul>
            )}
          </div>
        </div>

        <div className={panel}>
          <h3 className="font-display text-lg uppercase text-zinc-800 dark:text-white">Топ дней по визитам</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {data.topDays.map((d) => (
              <li
                key={d.date}
                className="flex items-center justify-between border-b border-stroke/15 pb-2 text-zinc-700 dark:border-white/10 dark:text-white"
              >
                <span>{d.date}</span>
                <span className="font-mono text-accent">{d.views}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={panel}>
        <h3 className="font-display text-lg uppercase text-zinc-800 dark:text-white">
          Заявки и быстрые запросы
        </h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-white">Последние события с источником в данных</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-zinc-500 dark:text-white">
                <th className="pb-2 pr-4 font-semibold">Время</th>
                <th className="pb-2 font-semibold">Источник / данные</th>
              </tr>
            </thead>
            <tbody>
              {data.recentLeads.map((row, idx) => (
                <tr key={`${row.at}-${idx}`} className="border-t border-stroke/15 dark:border-white/10">
                  <td className="whitespace-nowrap py-2 pr-4 text-zinc-600 dark:text-white">
                    {new Date(row.at).toLocaleString("ru-RU")}
                  </td>
                  <td className="py-2 text-zinc-800 dark:text-white">{formatLeadData(row.raw)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
