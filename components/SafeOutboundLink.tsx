"use client";

import type { ComponentPropsWithoutRef } from "react";
import { outboundAnchorProps } from "@/lib/outbound-link";

type Props = Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: string };

export function SafeOutboundLink({ href, children, ...rest }: Props) {
  const o = outboundAnchorProps(href);
  return (
    <a {...o} {...rest}>
      {children}
    </a>
  );
}
