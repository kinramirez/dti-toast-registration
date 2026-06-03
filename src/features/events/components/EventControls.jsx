import React from 'react';
import { List, LayoutGrid } from 'lucide-react';
import { cn } from "@/lib/utils/utils";

const EventControls = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8 border-b pb-4">
      <h2 className="text-2xl font-bold text-blue-600 text-center md:text-left">EVENTS</h2>
      
      <div className="flex items-center justify-center gap-3 text-sm font-semibold">
        <span className="text-gray-600">VIEW AS</span>
        <List 
          className={cn("h-5 w-5 cursor-pointer text-gray-400", viewMode === 'list' && "text-blue-600")} 
          onClick={() => onViewModeChange('list')}
        />
        <LayoutGrid 
          className={cn("h-5 w-5 cursor-pointer text-gray-400", viewMode === 'grid' && "text-blue-600")}
          onClick={() => onViewModeChange('grid')}
        />
      </div>
    </div>
  );
};

export default EventControls;