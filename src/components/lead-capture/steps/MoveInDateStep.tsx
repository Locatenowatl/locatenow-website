// src/components/lead-capture/steps/MoveInDateStep.tsx
import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateRange } from 'react-day-picker';

export interface MoveInDateStepProps {
  // now receives [startISO,endISO]
  value: [string, string];
  onChange: (range: [string, string]) => void;
  onBack: () => void;
  onNext: () => void;
}

export function MoveInDateStep({ value, onChange, onBack, onNext }: MoveInDateStepProps) {
  // Use react-day-picker's DateRange type
  const [range, setRange] = useState<DateRange | undefined>(
    value[0] || value[1]
      ? { from: value[0] ? new Date(value[0]) : undefined,
          to:   value[1] ? new Date(value[1]) : undefined }
      : undefined
  );

  const label = range && range.from && range.to
    ? `${format(range.from, 'MM/dd/yyyy')} – ${format(range.to, 'MM/dd/yyyy')}`
    : 'Select move‑in range';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">When are you looking to move?</h2>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {label}
            <ChevronRight className="w-5 h-5 text-gray-500 rotate-90" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            selected={range}
            onSelect={(newRange) => {
              // newRange is DateRange | undefined
              setRange(newRange);
              if (newRange && newRange.from && newRange.to) {
                const iso0 = newRange.from.toISOString().slice(0, 10);
                const iso1 = newRange.to.toISOString().slice(0, 10);
                onChange([iso0, iso1]);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button variant="ghost" onClick={onNext} disabled={!(range && range.from && range.to)}>
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
