"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <p className="font-display text-2xl font-semibold text-zinc-900 dark:text-white md:text-3xl">
        Не удалось загрузить страницу
      </p>
      <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        Произошла внутренняя ошибка. Попробуйте обновить страницу. Если сообщение повторяется,
        напишите нам.
      </p>
      <Button type="button" variant="primary" onClick={() => reset()}>
        Попробовать снова
      </Button>
    </div>
  );
}
