"use client";

import { Lexend } from "next/font/google";
import CircularGallery from "../../Utils/ReactBits/CircularGallery";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

export default function Trending() {
  const movies = [
    {
      image:
        "https://creativereview.imgix.net/content/uploads/2024/12/AlienRomulus-scaled.jpg?auto=compress,format&q=60&w=1728&h=2560",
      text: "Alien",
    },
    {
      image:
        "https://creativereview.imgix.net/content/uploads/2024/12/MuZhongWuRen2.jpg?auto=compress,format&q=60&w=1071&h=",
      text: "Agent",
    },
    {
      image:
        "https://miro.medium.com/v2/resize:fit:1400/1*iQhzIW0ZffqWaTI10ywLsA.jpeg",
      text: "Spider-Man",
    },
  ];

  return (
    <section
      id="movies"
      className="relative z-10 pt-30 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center mb-16">
        <h2
          className={`${lexendBold.className} text-4xl md:text-5xl text-white mb-4`}
        >
          Trending Now
        </h2>
        <p className={`${lexendSmall.className} text-xl text-gray-300`}>
          Catch the Hottest Movies Everyone's Talking About
        </p>
      </div>
      <div style={{ height: "600px", position: "relative" }}>
        <CircularGallery
          items={movies}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
        />
      </div>
    </section>
  );
}