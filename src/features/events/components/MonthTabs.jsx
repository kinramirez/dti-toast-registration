import React from 'react';

const MONTHS = [
    { label: 'JAN', year: '2026', value: '2026-01' },
    { label: 'FEB', year: '2026', value: '2026-02' },
    { label: 'MAR', year: '2026', value: '2026-03' },
    { label: 'APR', year: '2026', value: '2026-04' },
    { label: 'MAY', year: '2026', value: '2026-05' },
    { label: 'JUN', year: '2026', value: '2026-06' },
    { label: 'JUL', year: '2026', value: '2026-07' },
    { label: 'AUG', year: '2026', value: '2026-08' },
    { label: 'SEP', year: '2026', value: '2026-09' },
    { label: 'OCT', year: '2026', value: '2026-10' },
    { label: 'NOV', year: '2026', value: '2026-11' },
    { label: 'DEC', year: '2026', value: '2026-12' },
];

const MonthTabs = ({ selectedMonth, onMonthChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {MONTHS.map((month) => {
        const isActive = selectedMonth === month.value;
        const isPast = month.value < new Date().toISOString().slice(0, 7);

        return (
          <button
            key={month.value}
            onClick={() => onMonthChange(month.value)}
            className={`flex flex-col items-center justify-center w-16 h-20 rounded-xl border transition-colors shrink-0
              ${isActive ? 'bg-blue-600 text-white border-blue-600' : 
                isPast ? 'bg-gray-200 text-gray-400 border-gray-200' : 
                'bg-white text-gray-500 border-gray-300 hover:border-blue-400'}`}
          >
            <span className="font-bold text-lg">{month.label}</span>
            <span className="text-xs">{month.year}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MonthTabs;