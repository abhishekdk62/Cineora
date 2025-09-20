interface LegendProps {
  lexendSmallClassName: string;
}

export default function Legend({ lexendSmallClassName }: LegendProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-4 border border-gray-500/30">
        <div className="flex gap-6">

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-cyan-400 rounded border-2 border-cyan-300"></div>
            <span className={`${lexendSmallClassName} text-gray-300 text-sm`}>General</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded border-2 border-purple-500"></div>
            <span className={`${lexendSmallClassName} text-gray-300 text-sm`}>Premium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded border-2 border-yellow-400"></div>
            <span className={`${lexendSmallClassName} text-gray-300 text-sm`}>VIP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#afff94] rounded border-2 border-[#afff94]"></div>
            <span className={`${lexendSmallClassName} text-gray-300 text-sm`}>On Hold</span>
          </div>

        </div>
      </div>
    </div>
  );
}
