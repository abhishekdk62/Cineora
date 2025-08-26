"use client";

import dynamic from "next/dynamic";
import Orb from "../ReactBits/Orb";

export default function OrbClient() {
  return <Orb hoverIntensity={0.5} rotateOnHover hue={0} />;
}
