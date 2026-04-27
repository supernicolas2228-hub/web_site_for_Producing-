"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { STARTER_PACK_SUBMIT_URL } from "@/config/starter-pack";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/track";
import { spring } from "@/lib/motion";

export type StarterPackFormPayload = {
  projectStage: string;
  formatInterest: string;
  businessModel: string;
  mainTask: string;
  timeline: string;
  telegram: string;
  consent: boolean;
};

const initialForm: StarterPackFormPayload = {
  projectStage: "",
  formatInterest: "",
  businessModel: "",
  mainTask: "",
  timeline: "",
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
      projectStage: form.projectStage,
      formatInterest: form.formatInterest,
      businessModel: form.businessModel,
      mainTask: form.mainTask,
      timeline: form.timeline,
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
    "mt-1 w-full rounded-2xl border border-stroke/25 bg-white/90 px-4 py-3 text-[15px] text-zinc-900 shadow-sm outline-none transition placeholder:text-zinc-600 focus:border-accent focus:ring-2 focus:ring-accent/25 dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:[color-scheme:dark]";

  const label = "block text-sm font-semibold text-zinc-800 dark:text-zinc-100";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="starter-pack-scroll"
          className="fixed inset-0 z-[200]"
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="fixed inset-0 z-[1] cursor-default border-0 bg-black/45 p-0 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
          <div className="starter-pack-scroll-layer fixed inset-0 z-[2] overflow-y-auto overflow-x-hidden overscroll-y-contain">
            <div className="mx-auto flex min-h-[min(100dvh,100vh)] w-full justify-center px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-16 md:items-center md:py-12">
              <div className="flex w-full max-w-lg flex-col items-stretch justify-center pointer-events-none md:min-h-0">
                <motion.div
                  ref={panelRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby={`${idPrefix}-title`}
                  className="pointer-events-auto relative z-10 my-6 w-full rounded-[2rem] border border-stroke/20 bg-page/95 shadow-[var(--shadow-lift),var(--shadow-plate)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/95 md:my-0"
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={spring.modal}
                >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-stroke/15 bg-page/90 px-5 py-4 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/90 sm:px-6">
              <div>
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-accent">Заявка</p>
                <h2
                  id={`${idPrefix}-title`}
                  className="mt-1 font-display text-xl uppercase leading-tight text-zinc-900 dark:text-zinc-100"
                >
                  Несколько вопросов перед контактом
                </h2>
                <p className="mt-1 text-xs font-medium leading-relaxed text-zinc-800 dark:text-zinc-200">
                  Это быстрый бриф перед первым контактом. Внешняя отправка пока отключена: ответы сохраняются
                  локально и попадают в аналитику сайта.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-stroke/20 px-2.5 py-1 text-lg leading-none text-zinc-800 transition hover:border-accent/40 hover:text-zinc-950 dark:border-white/10 dark:text-zinc-100 dark:hover:text-white"
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>

            {step === "form" ? (
              <form onSubmit={submit} className="space-y-5 px-5 py-6 sm:px-6 sm:py-7">
                <div>
                  <label className={label} htmlFor={`${idPrefix}-stage`}>
                    На каком этапе вы сейчас? <span className="text-accent">*</span>
                  </label>
                  <select
                    id={`${idPrefix}-stage`}
                    required
                    className={field}
                    value={form.projectStage}
                    onChange={(e) => set("projectStage", e.target.value)}
                  >
                    <option value="">Выбери вариант</option>
                    <option value="Расту в инфобизнесе, много идей и мало фокуса">Расту в инфобизнесе, много идей и мало фокуса</option>
                    <option value="Нужен разбор одной конкретной задачи">Нужен разбор одной конкретной задачи</option>
                    <option value="Интересует наставничество на постоянной основе">Интересует наставничество на постоянной основе</option>
                    <option value="Хочу начать с бесплатного тарифа">Хочу начать с бесплатного тарифа</option>
                    <option value="Рассматриваю продвинутый платный тариф">Рассматриваю продвинутый платный тариф</option>
                  </select>
                </div>

                <div>
                  <label className={label} htmlFor={`${idPrefix}-format`}>
                    Что ближе: разовый разбор или сопровождение? <span className="text-accent">*</span>
                  </label>
                  <select
                    id={`${idPrefix}-format`}
                    required
                    className={field}
                    value={form.formatInterest}
                    onChange={(e) => set("formatInterest", e.target.value)}
                  >
                    <option value="">Выбери вариант</option>
                    <option value="Консультация">Консультация</option>
                    <option value="Наставничество">Наставничество</option>
                    <option value="Бесплатный тариф">Бесплатный тариф</option>
                    <option value="Продвинутый тариф">Продвинутый тариф</option>
                    <option value="Нужно помочь выбрать">Нужно помочь выбрать</option>
                  </select>
                </div>

                <div>
                  <label className={label} htmlFor={`${idPrefix}-model`}>
                    Что вы продаёте или хотите продавать? <span className="text-accent">*</span>
                  </label>
                  <select
                    id={`${idPrefix}-model`}
                    required
                    className={field}
                    value={form.businessModel}
                    onChange={(e) => set("businessModel", e.target.value)}
                  >
                    <option value="">Выбери ближайшее</option>
                    <option value="Консультации или экспертные услуги">Консультации или экспертные услуги</option>
                    <option value="Наставничество или сопровождение">Наставничество или сопровождение</option>
                    <option value="Авторский продукт или клуб">Авторский продукт или клуб</option>
                    <option value="Несколько направлений сразу">Несколько направлений сразу</option>
                    <option value="Пока формирую направление">Пока формирую направление</option>
                  </select>
                </div>

                <div>
                  <label className={label} htmlFor={`${idPrefix}-task`}>
                    Какая задача сейчас главная? <span className="text-accent">*</span>
                  </label>
                  <select
                    id={`${idPrefix}-task`}
                    required
                    className={field}
                    value={form.mainTask}
                    onChange={(e) => set("mainTask", e.target.value)}
                  >
                    <option value="">Выбери</option>
                    <option value="Разобраться в приоритетах и следующем шаге">Разобраться в приоритетах и следующем шаге</option>
                    <option value="Снизить перегруз и шум в инфобизнесе">Снизить перегруз и шум в инфобизнесе</option>
                    <option value="Разобрать подачу и сообщения (без «сделайте за меня»)">Разобрать подачу и сообщения (без «сделайте за меня»)</option>
                    <option value="Понять, консультация мне или наставничество">Понять, консультация мне или наставничество</option>
                    <option value="Понять, с чего начать">Понять, с чего начать</option>
                  </select>
                </div>

                <div>
                  <label className={label} htmlFor={`${idPrefix}-timeline`}>
                    Когда хотите стартовать? <span className="text-accent">*</span>
                  </label>
                  <select
                    id={`${idPrefix}-timeline`}
                    required
                    className={field}
                    value={form.timeline}
                    onChange={(e) => set("timeline", e.target.value)}
                  >
                    <option value="">Выбери</option>
                    <option value="В ближайшие 7 дней">В ближайшие 7 дней</option>
                    <option value="В течение месяца">В течение месяца</option>
                    <option value="Чуть позже — оставить заявку">Чуть позже — оставить заявку</option>
                    <option value="Пока изучаю варианты">Пока изучаю варианты</option>
                  </select>
                </div>

                <div>
                  <label className={label} htmlFor={`${idPrefix}-tg`}>
                    Telegram <span className="font-medium text-zinc-700 dark:text-zinc-200">(по желанию)</span>
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

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stroke/20 bg-accent/10 p-3 text-sm dark:border-white/10 dark:bg-accent/10">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 accent-accent"
                    checked={form.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                  />
                  <span className="text-zinc-700 dark:text-[#ddd1ba]">
                    Согласен на первичный контакт по заявке и понимаю, что сейчас это локальный тестовый приём
                    без внешней CRM.
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
                <p className="mt-4 font-display text-lg uppercase text-zinc-900 dark:text-zinc-100">Спасибо!</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">
                  Запрос сохранён. Позже его можно будет подключить к CRM или почте, а сейчас данные уже есть в
                  статистике и в{" "}
                  <code className="text-xs">localStorage</code> браузера.
                </p>
                <Button type="button" variant="primary" className="mt-8 w-full sm:w-auto" onClick={onClose}>
                  Закрыть
                </Button>
              </div>
            )}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
