import { Lexend } from "next/font/google";
import Orb from "../../ReactBits/Orb";
import { Footer, NavBar } from "../../Home";


const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

interface NotFoundPageProps {
  onGoBack: () => void;
}

export default function NotFoundPage({ onGoBack }: NotFoundPageProps) {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>
      <div className="relative z-10">
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30 text-center">
            <h2 className={`${lexendBold.className} text-white text-2xl mb-4`}>Movie Not Found</h2>
            <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
              The movie you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={onGoBack}
              className={`${lexendMedium.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300`}
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
