"use client";
import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import StaffCard from "./StaffCard";

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  theaterId?: any;
  createdAt?: string;
  updatedAt?: string;
}

interface StaffGridProps {
  groupedStaffs: Record<string, StaffMember[]>;
  groupBy: string;
  collapsedGroups: Set<string>;
  onToggleGroupCollapse: (groupKey: string) => void;
  onEdit: (staff: StaffMember) => void;
  onView: (staff: StaffMember) => void;
  onToggleStatus: (staffId: string, isActive: boolean) => void;
  lexendMedium: any;
  lexendSmall: any;
}

const StaffGrid: React.FC<StaffGridProps> = ({
  groupedStaffs,
  groupBy,
  collapsedGroups,
  onToggleGroupCollapse,
  onEdit,
  onView,
  onToggleStatus,
  lexendMedium,
  lexendSmall
}) => {
  return (
    <div className="space-y-4">
      {Object.entries(groupedStaffs).map(([groupKey, staffs]) => {
        const [, groupLabel] = groupKey.split('|');
        const isCollapsed = collapsedGroups.has(groupKey);

        return (
          <div key={groupKey} className="space-y-3">
            {groupBy !== "none" && (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onToggleGroupCollapse(groupKey)}
                  className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  <h4 className={`${lexendMedium.className} text-lg`}>
                    {groupLabel} ({staffs.length})
                  </h4>
                </button>
              </div>
            )}
            
            {!isCollapsed && (
              <div className="space-y-3">
                {staffs.map((staff) => (
                  <StaffCard
                    key={staff._id}
                    staff={staff}
                    onEdit={onEdit}
                    onView={onView}
                    onToggleStatus={onToggleStatus}
                    lexendMedium={lexendMedium}
                    lexendSmall={lexendSmall}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
      
      {Object.keys(groupedStaffs).length === 0 && (
        <div className="text-center py-8">
          <p className={`${lexendMedium.className} text-gray-400`}>
            No staff members found
          </p>
        </div>
      )}
    </div>
  );
};

export default StaffGrid;
