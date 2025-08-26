export default function CurvedScreen() {
  return (
    <div className="mb-16 flex justify-center">
      <div className="relative flex flex-col items-center">
        {/* Enhanced screen with multiple layers */}
        <div className="relative">
          {/* Outer glow effect */}
          <div className="absolute inset-0 blur-2xl opacity-40">
            <div
              className="w-[700px] h-20 bg-gradient-to-r from-transparent via-violet-400/80 to-transparent"
              style={{
                borderRadius: '60% 60% 0 0',
                transform: 'perspective(500px) rotateX(18deg)',
              }}
            />
          </div>
          
          {/* Secondary glow */}
          <div className="absolute inset-0 blur-xl opacity-60">
            <div
              className="w-[650px] h-18 bg-gradient-to-r from-transparent via-violet-500/70 to-transparent"
              style={{
                borderRadius: '55% 55% 0 0',
                transform: 'perspective(450px) rotateX(16deg)',
              }}
            />
          </div>

          {/* Main screen body */}
          <div
            className="w-[600px] h-16 relative overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.9) 20%, rgba(236, 72, 153, 0.9) 50%, rgba(147, 51, 234, 0.9) 80%, transparent 100%)',
              borderRadius: '50% 50% 0 0',
              transform: 'perspective(400px) rotateX(15deg)',
              boxShadow: `
                0 0 30px rgba(6, 182, 212, 0.4),
                0 0 60px rgba(236, 72, 153, 0.3),
                inset 0 2px 15px rgba(255, 255, 255, 0.15),
                inset 0 -2px 10px rgba(0, 0, 0, 0.2)
              `,
            }}
          >
            {/* Top highlight */}
            <div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4/5 h-2"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.6) 70%, transparent 100%)',
                borderRadius: '50px',
                filter: 'blur(1px)',
              }}
            />
            
            {/* Inner animated shimmer */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                animation: 'shimmer 3s ease-in-out infinite',
              }}
            />
            
            {/* Bottom gradient fade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
          
          {/* Screen base/support with enhanced styling */}
          <div
            className="w-[580px] h-4 mx-auto -mt-1 relative"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.4) 30%, rgba(236, 72, 153, 0.5) 50%, rgba(147, 51, 234, 0.4) 70%, transparent 100%)',
              borderRadius: '40% 40% 0 0',
              transform: 'perspective(300px) rotateX(8deg)',
              boxShadow: '0 4px 15px rgba(6, 182, 212, 0.2)',
            }}
          />
          
          {/* Subtle base reflection */}
          <div
            className="w-[540px] h-2 mx-auto -mt-1 opacity-20"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
              borderRadius: '30% 30% 0 0',
              transform: 'perspective(200px) rotateX(4deg)',
              filter: 'blur(2px)',
            }}
          />
        </div>
        
        {/* Enhanced label section */}
        <div className="mt-8 text-center relative">
          {/* Subtle glow behind text */}
          <div className="absolute inset-0 blur-lg opacity-30">
            <p className="tracking-[0.3em] text-cyan-400 text-sm font-extralight">
              SCREEN
            </p>
          </div>
          
          {/* Main text */}
          <p 
            className="tracking-[0.3em] text-gray-200 text-sm font-extralight relative z-10"
            style={{
              textShadow: '0 0 10px rgba(6, 182, 212, 0.3)',
            }}
          >
            SCREEN
          </p>
          
          {/* Animated underline */}
          <div className="relative mt-3 mx-auto w-20 h-px overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-60"
              style={{
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-40"
              style={{
                animation: 'pulse 2s ease-in-out infinite 1s',
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
