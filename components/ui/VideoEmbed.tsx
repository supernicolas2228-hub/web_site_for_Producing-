"use client";

import { isYoutubeEmbedUnavailable, toYouTubeEmbedUrl } from "@/lib/youtube";
import { VideoPlaceholder } from "@/components/ui/VideoPlaceholder";

type Props = {
  src: string;
  title?: string;
  className?: string;
};

/** Если ссылка битая — тот же постер, что в блоке «Обо мне», без iframe */
export function VideoEmbed({ src, title = "Видео", className = "" }: Props) {
  const unavailable = isYoutubeEmbedUnavailable(src);
  const embedSrc = toYouTubeEmbedUrl(src);

  if (unavailable) {
    return (
      <VideoPlaceholder
        title={title}
        overline="Вопрос"
        headline="Видео-ответ"
        description="Запись по этому пункту добавим позже. Соцсети — внизу страницы."
        className={className}
      />
    );
  }

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden rounded-xl border border-stroke/25 bg-[#0c0c0e] shadow-plate dark:border-white/20 ${className}`}
    >
      <iframe
        className="absolute inset-0 h-full w-full border-0"
        src={embedSrc}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
