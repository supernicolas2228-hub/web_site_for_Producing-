import type { Event } from "@prisma/client";

export type RangeMetrics = {
  visits: number;
  starterClicks: number;
  productClicks: number;
  pricingClicks: number;
  conversionPct: number;
};

export type AdminAnalytics = {
  today: RangeMetrics;
  week: RangeMetrics;
  month: RangeMetrics;
  visitsByDay: { date: string; views: number }[];
  clicksByLabel: { name: string; key: string; count: number }[];
  utmSources: { source: string; count: number }[];
  topDays: { date: string; views: number }[];
  recentLeads: { at: string; raw: string | null }[];
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function yyyyMmDd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseData(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as unknown;
    return typeof v === "object" && v !== null ? (v as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function countInRange(events: Event[], start: Date, end: Date) {
  const inR = events.filter((e) => e.createdAt >= start && e.createdAt < end);
  const visits = inR.filter((e) => e.event === "page_view").length;
  const starterClicks = inR.filter((e) => e.event === "click_starter_pack").length;
  const productClicks = inR.filter((e) => e.event === "click_product").length;
  const pricingClicks = inR.filter((e) => e.event === "click_pricing").length;
  const allClicks = starterClicks + productClicks + pricingClicks;
  const conversionPct = visits > 0 ? Math.round((allClicks / visits) * 1000) / 10 : 0;
  return {
    visits,
    starterClicks,
    productClicks,
    pricingClicks,
    conversionPct,
  };
}

/** Подпись строки для визитов без `?utm_source=` — чтобы блок не был пустым */
export const ANALYTICS_UTM_NONE_LABEL = "Без UTM-метки" as const;

function aggregateUtm(events: Event[]): { source: string; count: number }[] {
  const map = new Map<string, number>();
  let withoutUtm = 0;
  for (const e of events) {
    if (e.event !== "page_view") continue;
    const d = parseData(e.data);
    const utm = d.utm as Record<string, string> | undefined;
    const src = utm?.utm_source?.trim();
    if (src) map.set(src, (map.get(src) ?? 0) + 1);
    else withoutUtm += 1;
  }
  const rows = Array.from(map.entries()).map(([source, count]) => ({ source, count }));
  if (withoutUtm > 0) {
    rows.push({ source: ANALYTICS_UTM_NONE_LABEL, count: withoutUtm });
  }
  rows.sort((a, b) => b.count - a.count);
  return rows.slice(0, 15);
}

function visitsByDayRange(events: Event[], days: number): { date: string; views: number }[] {
  const today = startOfDay(new Date());
  const out: { date: string; views: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const views = events.filter(
      (e) => e.event === "page_view" && e.createdAt >= day && e.createdAt < next,
    ).length;
    out.push({ date: yyyyMmDd(day), views });
  }
  return out;
}

export function buildAnalytics(all: Event[]): AdminAnalytics {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrow = new Date(todayStart);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);

  const monthStart = new Date(todayStart);
  monthStart.setDate(monthStart.getDate() - 29);

  const today = countInRange(all, todayStart, tomorrow);
  const week = countInRange(all, weekStart, tomorrow);
  const month = countInRange(all, monthStart, tomorrow);

  const monthEvents = all.filter((e) => e.createdAt >= monthStart && e.createdAt < tomorrow);
  const visitsByDay = visitsByDayRange(all, 30);

  const clicksByLabel = [
    {
      name: "Запрос (клик)",
      key: "click_starter_pack",
      count: monthEvents.filter((e) => e.event === "click_starter_pack").length,
    },
    {
      name: "Запрос (форма)",
      key: "starter_pack_survey_submit",
      count: monthEvents.filter((e) => e.event === "starter_pack_survey_submit").length,
    },
    {
      name: "Клики к тарифам",
      key: "click_product",
      count: monthEvents.filter((e) => e.event === "click_product").length,
    },
    {
      name: "CTA сотрудничества",
      key: "click_pricing",
      count: monthEvents.filter((e) => e.event === "click_pricing").length,
    },
  ];

  const utmSources = aggregateUtm(monthEvents);

  const byDayMap = new Map<string, number>();
  for (const row of visitsByDay) {
    byDayMap.set(row.date, row.views);
  }
  const topDays = Array.from(byDayMap.entries())
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 7);

  const leads = all
    .filter((e) => e.event === "click_starter_pack" || e.event === "starter_pack_survey_submit")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 40)
    .map((e) => ({ at: e.createdAt.toISOString(), raw: e.data }));

  return {
    today,
    week,
    month,
    visitsByDay,
    clicksByLabel,
    utmSources,
    topDays,
    recentLeads: leads,
  };
}
