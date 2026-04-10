import type { AnchorHTMLAttributes, MouseEvent } from "react";

/** Атрибуты для внешней ссылки: если href ещё заглушка (#), клик не уводит со страницы. */
export function outboundAnchorProps(
  href: string
): Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick" | "target" | "rel"> {
  const dead = !href || href === "#";
  return {
    href: dead ? "#" : href,
    onClick: dead ? (e) => e.preventDefault() : undefined,
    ...(!dead ? { target: "_blank" as const, rel: "noreferrer" as const } : {}),
  };
}

export function chainOnClick(
  first: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"],
  second: (e: MouseEvent<HTMLAnchorElement>) => void
): AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] {
  return (e) => {
    first?.(e);
    second(e);
  };
}
