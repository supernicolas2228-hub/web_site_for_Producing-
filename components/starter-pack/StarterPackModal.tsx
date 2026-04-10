"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { STARTER_PACK_SUBMIT_URL } from "@/config/starter-pack";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/track";

export type StarterPackFormPayload = {
  ageRange: string;
  role: string;
  roleOther: string;
  triedOnline: string;
  mainBlock: string;
  moneyHorizon: string;
  telegram: string;
  consent: boolean;
};

const initialForm: StarterPackFormPayload = {
  ageRange: "",
  role: "",
  roleOther: "",
  triedOnline: "",
  mainBlock: "",
  moneyHorizon: "",
  telegram: "",
  consent: false,
};

const LS_KEY = "sil_starter_pack_last_submit";

type Props = {
  open: boolean;
  onClose: () => void;
  source?: string;
};

export function StarterPackModal({ open, onClose, source = "unknown" }: Props) {
  const [form, setForm] = useState<StarterPackFormPayload>(initialForm);
  const [step, setStep] = useState<"form" | "done">("form");
  const [busy, setBusy] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const idPrefix = useId();

  useEffect(() => {
    if (!open) return;
    setStep("form");
    setForm(initialForm);
    setBusy(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("input, select, textarea")?.focus());
    return () => cancelAnimationFrame(t);
  }, [open, step]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const set = useCallback(<K extends keyof StarterPackFormPayload>(key: K, v: StarterPackFormPayload[K]) => {
    setForm((f) => ({ ...f, [key]: v }));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      ...form,
      telegram: form.telegram.trim().replace(/^@+/, ""),
      submittedAt: new Date().toISOString(),
      source,
    };

    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(LS_KEY, JSON.stringify(payload));
      }
    } catch {
      /* ignore */
    }

    await track("starter_pack_survey_submit", {
      source,
      ageRange: form.ageRange,
      role: form.role,
      triedOnline: form.triedOnline,
      mainBlock: form.mainBlock,
      moneyHorizon: form.moneyHorizon,
      hasTelegram: Boolean(form.telegram.trim()),
    });

    if (STARTER_PACK_SUBMIT_URL) {
      try {
        await fetch(STARTER_PACK_SUBMIT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        /* остаёмся на локальном успехе */
      }
    }

    setStep("done");
    setBusy(false);
  };

  const field =
    "mt-1 w-full rounded-xl border border-stroke/25 bg-white/95 px-4 py-3 text-[15px] text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-400 focus:border-accent focus:ring-2 focus:ring-accent/25 dark:border-white/15 dark:bg-black/50 dark:text-white dark:placeholder:text-white/35";

  const label = "block text-sm font-semibold text-zinc-800 dark:text-white";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto overflow-x-hidden bg-black/45 p-4 pt-10 backdrop-blur-sm sm:pt-16 md:items-center md:pt-4"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${idPrefix}-title`}
            className="relative w-full max-w-lg rounded-2xl border border-stroke/20 bg-page/95 shadow-[var(--shadow-lift),var(--shadow-plate)] backdrop-blur-xl dark:border-white/12 dark:bg-zinc-950/95"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-stroke/15 bg-page/90 px-5 py-4 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/90 sm:px-6">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">Starter Pack</p>
                <h2 id={`${idPrefix}-title`} className="mt-1 font-display text-xl uppercase leading-tight text-zinc-900 dark:text-white">
                  Забрать материалы
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-white">
                  Короткая анкета на сайте. Отправка на внешний сервис пока отключена; ответы учитываются в статистике и сохраняются в браузере.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-stroke/20 px-2.5 py-1 text-lg leading-none text-zinc-500 transition hover:border-accent/40 hover:text-zinc-900 dark:border-white/15 dark:text-white dark:hover:text-white"
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>

            {step === "form" ? (
              <form onSubmit={submit} className="space-y-5 px-5 py-6 sm:px-6 sm:py-7">
                <div>
                  <label className={label} htmlFor={`${idPrefix}-age`}>
                    Сколько тебе лет? <span className="text-accent">*</span>
                  </label>
                  <select
                    id={`${idPrefix}-age`}
                    required
                    className={field}
                    value={form.ageRange}
                    onChange={(e) => set("ageRange", e.target.value)}
                  >
                    <option value="">Выбери вариант</option>
                    <option value="до 14">до 14</option>
                    <option value="15–17">15–17</option>
                    <option value="18–20">18–20</option>
                    <option value="21–25">21–25</option>
                    <option value="26+">26 и старше</option>
                  </select>
                </div>

                <div>
                  <label className={label} htmlFor={`${idPrefix}-role`}>
                    Чем сейчас занимаешься? <span className="text-accent">*</span>
                  </label>
                  <select
                    id={`${idPrefix}-role`}
                    required
                    className={field}
                    value={form.role}
                    onChange={(e) => set("role", e.target.value)}
                  >
                    <option value="">Выбери вариант</option>
                    <option value="Школа">Школа</option>
                    <option value="Колледж / вуз">Колледж / вуз</option>
                    <option value="Работа по найму">Работа по найму</option>
                    <option value="Фриланс / самозанятость">Фриланс / самозанятость</option>
                    <option value="Ищу себя / перерыв">Ищу себя / перерыв</option>
                    <option value="Другое">Другое</option>
                  </select>
                  {form.role === "Другое" ? (
                    <input
                      type="text"
                      className={`${field} mt-2`}
                      placeholder="Уточни в двух словах"
                      value={form.roleOther}
                      onChange={(e) => set("roleOther", e.target.value)}
                    />
                  ) : null}
                </div>

                <div>
                  <span className={label}>
                    Уже пробовал зарабатывать онлайн? <span className="text-accent">*</span>
                  </span>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {(["Да, есть опыт", "Чуть-чуть / пробовал", "Нет, только думаю"] as const).map((v) => (
                      <label
                        key={v}
                        className="flex cursor-pointer items-center gap-2 rounded-xl border border-stroke/20 bg-white/70 px-3 py-2 text-sm dark:border-white/12 dark:bg-black/35"
                      >
                        <input
                          type="radio"
                          name="tried"
                          required
                          className="accent-accent"
                          checked={form.triedOnline === v}
                          onChange={() => set("triedOnline", v)}
                        />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={label} htmlFor={`${idPrefix}-block`}>
                    Что сейчас больше всего мешает? <span className="text-accent">*</span>
                  </label>
                  <select
                    id={`${idPrefix}-block`}
                    required
                    className={field}
                    value={form.mainBlock}
                    onChange={(e) => set("mainBlock", e.target.value)}
                  >
                    <option value="">Выбери ближайшее</option>
                    <option value="Хаос и прокрастинация">Хаос и прокрастинация</option>
                    <option value="Нет чёткой системы">Нет чёткой системы</option>
                    <option value="Страшно писать людям / продавать">Страшно писать людям / продавать</option>
                    <option value="Не понимаю, с чего начать">Не понимаю, с чего начать</option>
                    <option value="Мало времени">Мало времени</option>
                    <option value="Сливался на обучениях раньше">Сливался на обучениях раньше</option>
                    <option value="Другое">Другое</option>
                  </select>
                </div>

                <div>
                  <label className={label} htmlFor={`${idPrefix}-horizon`}>
                    На какой горизонт хочешь первые деньги? <span className="text-accent">*</span>
                  </label>
                  <select
                    id={`${idPrefix}-horizon`}
                    required
                    className={field}
                    value={form.moneyHorizon}
                    onChange={(e) => set("moneyHorizon", e.target.value)}
                  >
                    <option value="">Выбери</option>
                    <option value="Без жёсткого срока">Без жёсткого срока</option>
                    <option value="В ближайший месяц">В ближайший месяц</option>
                    <option value="1–3 месяца">1–3 месяца</option>
                    <option value="Пока только разбираюсь">Пока только разбираюсь</option>
                  </select>
                </div>

                <div>
                  <label className={label} htmlFor={`${idPrefix}-tg`}>
                    Telegram <span className="font-normal text-zinc-400 dark:text-white">(по желанию)</span>
                  </label>
                  <input
                    id={`${idPrefix}-tg`}
                    type="text"
                    className={field}
                    placeholder="@username или ссылка"
                    autoComplete="off"
                    value={form.telegram}
                    onChange={(e) => set("telegram", e.target.value)}
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-stroke/20 bg-red-50/50 p-3 text-sm dark:border-white/10 dark:bg-accent/10">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 accent-accent"
                    checked={form.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                  />
                  <span className="text-zinc-700 dark:text-white">
                    Согласен получить Starter Pack и связанные материалы. Понимаю, что сейчас это тестовый приём без внешней отправки.
                  </span>
                </label>

                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:justify-end">
                  <Button type="button" variant="ghost" className="w-full sm:w-auto" onClick={onClose}>
                    Отмена
                  </Button>
                  <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={busy}>
                    {busy ? "Отправка…" : "Отправить"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="px-5 py-10 text-center sm:px-8">
                <p className="font-display text-4xl text-accent" aria-hidden>
                  ✓
                </p>
                <p className="mt-4 font-display text-lg uppercase text-zinc-900 dark:text-white">Спасибо!</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-white">
                  Анкета принята. Приём в CRM или на почту подключим позже — данные уже в статистике и в{" "}
                  <code className="text-xs">localStorage</code> браузера.
                </p>
                <Button type="button" variant="primary" className="mt-8 w-full sm:w-auto" onClick={onClose}>
                  Закрыть
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
