import React from "react";
import { Building, MapPin, Power, ChevronRight } from "lucide-react";
import { lexendMedium, lexendSmall } from "@/app/others/Utils/fonts";
import { ITheater } from "@/app/others/Types";
interface TheatersListProps {
  theaters: ITheater[];
  isLoading: boolean;
  onTheaterSelect(theater: ITheater): void;
}
const TheatersList: React.FC<TheatersListProps> = ({
  theaters,
  isLoading,
  onTheaterSelect,
}) => {
  if (isLoading) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-600 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (theaters.length === 0) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-12 text-center">
        <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className={`${lexendMedium.className} text-xl text-white mb-2`}>
          No theaters found
        </h3>
        <p className={`${lexendSmall.className} text-gray-400`}>
          You need to add theaters first before managing screens
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
      <h2 className={`${lexendMedium.className} text-lg text-white mb-4`}>
        Select Theater
      </h2>

      <div className="space-y-3">
        {theaters.map((theater: ITheater) => (
          <div
            key={theater._id}
            onClick={() => onTheaterSelect(theater)}
            className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-gray-500/30"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theater.isActive ? "bg-green-500/20" : "bg-orange-500/20"
              }`}
            >
              <Building
                className={`w-6 h-6 ${
                  theater.isActive ? "text-green-400" : "text-orange-400"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3
                  className={`${lexendMedium.className} text-white text-lg truncate`}
                >
                  {theater.name}
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      theater.isActive ? "bg-green-400" : "bg-orange-400"
                    }`}
                  />
                  <span
                    className={`${lexendSmall.className} text-xs ${
                      theater.isActive ? "text-green-400" : "text-orange-400"
                    }`}
                  >
                    {theater.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className={`${lexendSmall.className} text-sm truncate`}>
                  {theater.city}, {theater.state}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={`${lexendSmall.className} text-xs text-gray-400`}>
                  Screens
                </p>
                <p className={`${lexendMedium.className} text-sm text-white`}>
                  {theater.screens || 0} 
                </p>

                <p
                  className={`${lexendMedium.className} text-sm text-white`}
                ></p>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TheatersList;
