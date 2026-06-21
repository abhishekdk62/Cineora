"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const Prism = dynamic(() => import("./Prism"), { ssr: false });

type PrismProps = ComponentProps<typeof Prism>;

export default function DynamicPrism(props: PrismProps) {
  return <Prism {...props} />;
}
