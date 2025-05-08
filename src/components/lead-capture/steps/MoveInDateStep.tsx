import React, { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface MoveInDateStepProps {
  // now receives single ISO date
  value: string;
  onChange: (date: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function MoveInDateStep({ value, onChange, onBack, onNext }: MoveInDateStepProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  const label = selectedDate
    ? format(selectedDate, 'MM/dd/yyyy')
    : 'Select move‑in date';

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
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                onChange(date.toISOString().slice(0, 10));
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
        <Button
          variant="ghost"
          onClick={onNext}
          disabled={!selectedDate}
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
