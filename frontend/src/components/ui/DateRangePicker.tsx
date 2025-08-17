import { Calendar } from 'lucide-react';
import { DateRange } from '@/lib/types';

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export default function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const presetRanges = [
    {
      label: 'Last 7 days',
      range: { start: '2025-06-22', end: '2025-06-28' }
    },
    {
      label: 'Last 3 days', 
      range: { start: '2025-06-26', end: '2025-06-28' }
    },
    {
      label: 'Custom range',
      range: null
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center text-sm font-medium text-gray-700">
          <Calendar className="w-4 h-4 mr-2" />
          Date Range:
        </div>
        
        <div className="flex space-x-2">
          {presetRanges.map((preset) => (
            <button
              key={preset.label}
              onClick={() => preset.range && onDateRangeChange(preset.range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                preset.range && 
                dateRange.start === preset.range.start && 
                dateRange.end === preset.range.end
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
            className="text-sm text-black border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="text-gray-400">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
            className="text-sm text-black border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}