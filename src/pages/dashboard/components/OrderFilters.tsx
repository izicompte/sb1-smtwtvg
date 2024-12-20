import React from 'react';
import { OrderStatus } from '../../../types';
import { Button } from '../../../components/ui/Button';
import { Calendar } from 'lucide-react';

interface OrderFiltersProps {
  currentFilter: OrderStatus | 'all';
  onFilterChange: (filter: OrderStatus | 'all') => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
}

export function OrderFilters({ 
  currentFilter, 
  onFilterChange,
  dateRange,
  onDateRangeChange 
}: OrderFiltersProps) {
  const filters: Array<{ value: OrderStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const presets = [
    { label: 'Today', days: 0 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 }
  ];

  const handleDatePreset = (days: number) => {
    const to = new Date();
    const from = new Date();
    if (days > 0) {
      from.setDate(from.getDate() - days);
    } else {
      from.setHours(0, 0, 0, 0);
    }
    onDateRangeChange({ from, to });
  };

  const clearDateRange = () => {
    onDateRangeChange({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <Button
            key={filter.value}
            variant={currentFilter === filter.value ? 'primary' : 'secondary'}
            onClick={() => onFilterChange(filter.value)}
            size="sm"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        {presets.map(preset => (
          <Button
            key={preset.label}
            variant="secondary"
            size="sm"
            onClick={() => handleDatePreset(preset.days)}
          >
            {preset.label}
          </Button>
        ))}
        {(dateRange.from || dateRange.to) && (
          <Button
            variant="secondary"
            size="sm"
            onClick={clearDateRange}
          >
            Clear Date Filter
          </Button>
        )}
      </div>
    </div>
  );
}