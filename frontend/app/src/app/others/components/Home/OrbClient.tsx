"use client";

import DynamicOrb from "../ReactBits/DynamicOrb";

export default function OrbClient() {
  return (
    <DynamicOrb
      hoverIntensity={0.5}
      rotateOnHover
      hue={0}
      forceHoverState={false}
    />
  );
}
