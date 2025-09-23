"use client";
import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { lexendSmall } from '@/app/others/Utils/fonts';

interface NavigationBreadcrumbProps {
  items: {
    label: string;
    onClick?: () => void;
    active?: boolean;
  }[];
}

const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({ items }) => {
  return (
    <div className="flex items-center gap-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className={`${lexendSmall.className} transition-colors ${
                item.active 
                  ? 'text-white' 
                  : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              {item.label}
            </button>
          ) : (
            <span className={`${lexendSmall.className} text-white`}>
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NavigationBreadcrumb;
