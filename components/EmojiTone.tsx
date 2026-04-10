import type { HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "className" | "children">;

/** Смайлики: светлая тема — алый градиент; тёмная — красные (вкл. «белые» эмодзи), см. `.emoji-tone` */
export function EmojiTone({ children, className = "", ...rest }: Props) {
  return (
    <span className={`emoji-tone ${className}`.trim()} {...rest}>
      {children}
    </span>
  );
}
