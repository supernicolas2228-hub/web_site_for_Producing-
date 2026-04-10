type Props = {
  label: string;
  value: string | number;
  hint?: string;
};

export function MetricCard({ label, value, hint }: Props) {
  return (
    <div className="rounded-xl border border-stroke/18 bg-white/85 p-4 shadow-plate backdrop-blur-xl dark:border-white/20 dark:bg-black/50 sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-white">{label}</p>
      <p className="mt-2 font-display text-3xl text-zinc-900 sm:text-4xl dark:text-white">{value}</p>
      {hint ? <p className="mt-2 text-xs text-zinc-500 dark:text-white">{hint}</p> : null}
    </div>
  );
}
