"use client";

import { useState } from "react";
import {
  NavBar,
  Hero,
  Trending,
  Upcoming,
  CallToAction,
  SpotlightArticles,
  Footer,
} from "./others/components/Home";
import { useRouter } from "next/navigation";
import OrbClient from "./others/components/Home/OrbClient";
import Orb from "./others/Utils/ReactBits/Orb";

interface Movie {
  id: string;
  title: string;
  genre: string;
  rating: number;
  duration: string;
  poster: string;
  trailer: string;
  showtimes: string[];
  price: number;
}

export default function LandingPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClick = () => {
    router.push("/login");
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>

      <div className="relative z-10">
        <NavBar handleClick={handleClick} scrollToSection={scrollToSection} />
        <Hero />
        <Trending />
        <Upcoming />
        <CallToAction />
        <SpotlightArticles />
        <Footer />
      </div>
    </div>
  );
}
