"use client";
import React from "react";
import { X, MapPin, CheckCircle ,Popcorn} from "lucide-react";

interface TheaterData {
  _id: string;
  name: string;
  city: string;
  state: string;
  location?: {
    type: string;
    coordinates: number[];
  };
}

interface TheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  theaters: TheaterData[];
  isAllTheaters: boolean;
}

const TheaterModal: React.FC<TheaterModalProps> = ({ 
  isOpen, 
  onClose, 
  theaters, 
  isAllTheaters 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-xl">
        {/* Modal Header */}
        <div className="bg-orange-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Available Theaters</h2>
              <p className="text-orange-100">
                {isAllTheaters 
                  ? 'Valid at all theaters in our network' 
                  : `Valid at ${theaters.length} selected theater${theaters.length !== 1 ? 's' : ''}`
                }
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {isAllTheaters ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">All Theaters Available!</h3>
              <p className="text-gray-600 text-lg max-w-lg mx-auto leading-relaxed">
                This coupon can be used at any theater in our network. Choose your favorite cinema and enjoy the show!
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Valid Everywhere</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {theaters.map((theater) => (
                <div 
                  key={theater._id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                      <Popcorn />
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">
                        {theater.name}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{theater.city}, {theater.state}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <span>Available</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              <strong className="text-gray-900">
                {isAllTheaters ? 'All theaters' : theaters.length}
              </strong> available for this coupon
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterModal;
