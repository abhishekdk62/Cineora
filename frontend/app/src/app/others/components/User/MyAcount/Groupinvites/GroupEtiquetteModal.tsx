'use client'
import React from 'react';
import { X, Users, MessageCircle, Shield, Heart, AlertCircle } from 'lucide-react';

interface GroupEtiquetteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

const GroupEtiquetteModal: React.FC<GroupEtiquetteModalProps> = ({ isOpen, onClose, onProceed }) => {
  if (!isOpen) return null;

  const etiquetteRules = [
    {
      icon: <Heart className="w-5 h-5 text-red-400" />,
      title: "Be Respectful",
      description: "You'll be joining strangers. Treat everyone with kindness and respect."
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
      title: "Communicate Politely",
      description: "Use appropriate language in the group chat. Keep conversations friendly."
    },
    {
      icon: <Users className="w-5 h-5 text-green-400" />,
      title: "Be Punctual",
      description: "Arrive on time for the show. Others are depending on you."
    },
    {
      icon: <Shield className="w-5 h-5 text-purple-400" />,
      title: "No Harassment",
      description: "Any form of harassment, abuse, or inappropriate behavior is strictly prohibited."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Group Etiquette</h2>
              <p className="text-purple-100 text-sm">Before you join...</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-300 text-sm font-medium mb-1">Important Notice</p>
              <p className="text-yellow-200/80 text-xs">
                You'll be joining a group chat with strangers. Please follow these guidelines to ensure everyone has a great experience.
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {etiquetteRules.map((rule, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {rule.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{rule.title}</h3>
                  <p className="text-gray-400 text-xs">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
            <p className="text-purple-300 text-xs text-center font-medium">
              💜 Let's make this a fun and memorable experience for everyone! 💜
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onProceed}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              I Agree, Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupEtiquetteModal;
