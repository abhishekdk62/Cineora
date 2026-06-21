"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const Aurora = dynamic(() => import("./Aurora"), { ssr: false });

type AuroraProps = ComponentProps<typeof Aurora>;

export default function DynamicAurora(props: AuroraProps) {
  return <Aurora {...props} />;
}
