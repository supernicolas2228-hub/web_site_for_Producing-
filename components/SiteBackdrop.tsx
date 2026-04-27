import Image from "next/image";
import { hero } from "@/config/content";

/**
 * Фон: одна картинка на весь экран. `object-cover` + якоря по брейкпоинтам — без пустых полос,
 * важная часть кадра (замок) остаётся в кадре на телефоне (портрет/ландшафт), планшете и ПК.
 */
export function SiteBackdrop() {
  return (
    <div
      className="site-backdrop pointer-events-none fixed inset-0 z-0 min-h-[100dvh] w-full max-w-[100vw] overflow-hidden bg-zinc-800"
      aria-hidden
    >
      <Image
        src={hero.backdropSrc}
        alt=""
        fill
        priority
        quality={90}
        className="object-cover [transform:translateZ(0)] [object-position:center_48%] contrast-[1.05] saturate-[1.1] brightness-[1.02] min-[480px]:[object-position:center_45%] md:[object-position:center_43%] lg:[object-position:center_42%] xl:[object-position:center_40%] dark:brightness-[0.96] dark:contrast-[1.08] dark:saturate-[1.1]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, (max-width: 1920px) 100vw, 1920px"
      />
      <div className="site-backdrop-scrim absolute inset-0" />
    </div>
  );
}
