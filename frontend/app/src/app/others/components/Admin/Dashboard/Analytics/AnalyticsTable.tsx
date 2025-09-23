import React from 'react';
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';

type RowData = Record<string, unknown>;

interface TableColumn<T extends RowData> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode; 
  align?: 'left' | 'center' | 'right';
}

interface AnalyticsTableProps<T extends RowData> {
  title: string;
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  sortBy?: keyof T;
  sortOrder?: 'asc' | 'desc';
  onSort?: (column: keyof T) => void;
  className?: string;
}

const renderCellValue = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (React.isValidElement(value)) {
    return value;
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

export const AnalyticsTable = <T extends RowData>({
  title,
  columns,
  data,
  loading = false,
  sortBy,
  sortOrder,
  onSort,
  className = ""
}: AnalyticsTableProps<T>) => {
  if (loading) {
    return (
      <div className={`bg-gray-900/90 border border-yellow-500/20 rounded-lg overflow-hidden ${className}`}>
        <div className="p-4 border-b border-gray-700/50">
          <div className="h-6 bg-gray-700/50 rounded w-48 animate-pulse"></div>
        </div>
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex justify-between items-center animate-pulse">
              <div className="h-4 bg-gray-700/50 rounded w-32"></div>
              <div className="h-4 bg-gray-700/50 rounded w-20"></div>
              <div className="h-4 bg-gray-700/50 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleSort = (column: TableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  return (
    <div className={`bg-gray-900/90 border border-yellow-500/20 rounded-lg overflow-hidden ${className}`}>
      <div className="p-4 border-b border-gray-700/50">
        <h3 className="text-2xl text-yellow-400 font-medium">{title}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={`text-yellow-400 px-4 py-3 text-sm font-medium ${
                    column.align === 'right' ? 'text-right' : 
                    column.align === 'center' ? 'text-center' : 'text-left'
                  } ${column.sortable ? 'cursor-pointer hover:bg-yellow-500/5 transition-all duration-200' : ''}`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && sortBy === column.key && (
                      sortOrder === 'asc' ? 
                        <ChevronUp className="w-4 h-4" /> : 
                        <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-yellow-500/5 border-b border-gray-700/50 transition-all duration-200">
                {columns.map((column) => (
                  <td
                    key={column.key as string}
                    className={`px-4 py-3 text-sm text-white ${
                      column.align === 'right' ? 'text-right' : 
                      column.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    {column.render ? 
                      column.render(row[column.key], row) : 
                      renderCellValue(row[column.key])
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {data.length === 0 && (
          <div className="text-center py-8 text-gray-300">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};
