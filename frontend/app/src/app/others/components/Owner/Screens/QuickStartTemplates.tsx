import React from 'react';
import { Lexend } from "next/font/google";
import { screenTemplates } from './templateData';

const lexendBold = Lexend({ weight: "700", subsets: ["latin"] });
const lexendSmall = Lexend({ weight: "400", subsets: ["latin"] });

interface QuickStartTemplatesProps {
  onApplyTemplate: (templateIndex: number) => void;
}

export const QuickStartTemplates: React.FC<QuickStartTemplatesProps> = ({
  onApplyTemplate
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`${lexendBold.className} text-2xl text-white mb-2`}>
          Choose Your Screen Layout
        </h3>
        <p className={`${lexendSmall.className} text-gray-400`}>
          Select a pre-designed layout that matches your theater's style and capacity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {screenTemplates.map((template, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onApplyTemplate(index)}
            className="p-6 bg-white/5 hover:bg-white/10 border border-gray-500/30 hover:border-white/30 rounded-2xl text-left transition-all duration-300 group"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl text-white mb-4">{template.icon}</div>

              <h4 className={`${lexendBold.className} text-white text-lg font-bold group-hover:text-blue-400 transition-colors mb-2`}>
                {template.name}
              </h4>
              <p className={`${lexendSmall.className} text-gray-400 text-sm mb-3 leading-relaxed`}>
                {template.description}
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full">
                <span className={`${lexendSmall.className} text-blue-400 text-xs font-medium`}>
                  {template.capacity}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
