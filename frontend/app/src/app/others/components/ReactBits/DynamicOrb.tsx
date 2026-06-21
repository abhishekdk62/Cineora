"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const Orb = dynamic(() => import("./Orb"), { ssr: false });

type OrbProps = ComponentProps<typeof Orb>;

export default function DynamicOrb(props: OrbProps) {
  return <Orb {...props} />;
}
