import { Lexend } from "next/font/google";
import { Footer, NavBar } from "../../Home";
import Orb from "../../ReactBits/Orb";


const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

export default function LoadingSpinner() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Orb hoverIntensity={0.5} rotateOnHover={true} hue={0} forceHoverState={false} />
      </div>
      <div className="relative z-10">
        <NavBar />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-gray-500/30">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className={`${lexendMedium.className} text-white text-center`}>Loading movie details...</p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
