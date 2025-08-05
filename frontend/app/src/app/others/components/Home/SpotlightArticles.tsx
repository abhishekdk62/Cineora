"use client";

import SpotlightCard from "../../Utils/ReactBits/Spotlight";

export default function SpotlightArticles() {
  const articles = [
    {
      title: "10 Must-Watch Movies This Month",
      date: "July 2025",
      image:
        "https://www.tallengestore.com/cdn/shop/products/1917_-_Sam_Mendes_-_Hollywood_War_Film_Classic_English_Movie_Poster_9ef86295-4756-4c71-bb4e-20745c5fbc1a.jpg?v=1582781084",
      excerpt:
        "From heart-pounding thrillers to feel-good comedies, here's our pick of this month's top releases you can't miss.",
    },
    {
      title: "Behind the Scenes: Blockbusters of 2025",
      date: "July 2025",
      image:
        "https://www.tallengestore.com/cdn/shop/products/1917_-_Sam_Mendes_-_Hollywood_War_Film_Classic_English_Movie_Poster_9ef86295-4756-4c71-bb4e-20745c5fbc1a.jpg?v=1582781084",
      excerpt:
        "Take a peek behind the curtain of this year's most anticipated movies — cast interviews, trivia, and more.",
    },
    {
      title: "5 Tips for the Perfect Movie Night",
      date: "July 2025",
      image: "/?height=300&width=500",
      excerpt:
        "Planning your next theater trip? Here's how to make it unforgettable — from best seats to pre-show hacks.",
    },
  ];

  return (
    <SpotlightCard
      className="custom-spotlight-card"
      spotlightColor="rgba(92, 6, 239, 0.8)"
    >
      <section
        id="blog-news"
        className="relative z-10 py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h2 className="text-4xl text-center md:text-5xl text-white mb-6 font-bold">
            Movies & Insights
          </h2>
          <p className="text-gray-300 text-center text-lg mb-12">
            Stay updated with the latest movie trends, insider news, and
            curated lists.
          </p>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div
                key={index}
                className="bg-black/30 backdrop-blur-sm border border-gray-500/30 rounded-xl overflow-hidden hover:bg-black/50 transition"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <p className="text-gray-400 text-sm mb-2">{article.date}</p>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    {article.excerpt}
                  </p>
                  <button className="text-[#FF5A3C] hover:underline text-sm">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SpotlightCard>
  );
}