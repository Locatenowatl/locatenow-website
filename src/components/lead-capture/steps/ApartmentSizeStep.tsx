// src/components/lead-capture/ui/ApartmentSizeStep.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SIZES = ['STUDIO', '1 BED', '2 BED', '3+ BEDS'] as const;
export type SizeOption = typeof SIZES[number];

interface ApartmentSizeStepProps {
  value: SizeOption[];
  onChange: (sizes: SizeOption[]) => void;
  onBack: () => void;
  onNext: (sizes: SizeOption[]) => void;
}

export function ApartmentSizeStep({ value, onChange, onBack, onNext }: ApartmentSizeStepProps) {
  const handleSelect = (size: SizeOption) => {
    const multiAllowed: SizeOption[] = ['STUDIO', '1 BED'];
    let next: SizeOption[];

    // Selecting a larger unit resets to that only
    if (size === '2 BED' || size === '3+ BEDS') {
      next = [size];
      onChange(next);
      // auto-advance only if no prior selections
      if (value.length === 0) {
        onNext(next);
      }
      return;
    }

    // Toggle studio/1-bed selection
    if (value.includes(size)) {
      next = value.filter((s) => s !== size);
    } else {
      next = Array.from(new Set([size, ...value.filter((v) => multiAllowed.includes(v))]));
    }
    onChange(next);

    // Auto-advance when both STUDIO and 1 BED are selected
    if (next.length === 2 && multiAllowed.every((opt) => next.includes(opt))) {
      onNext(next);
    }
  };

  const isNextDisabled = value.length === 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">What size apartment?</h2>
      <div className="grid grid-cols-4 gap-2">
        {SIZES.map((size) => (
          <Button
            key={size}
            variant={value.includes(size) ? 'default' : 'outline'}
            className={value.includes(size) ? 'bg-[#B69D74] hover:bg-[#A38B62]' : ''}
            onClick={() => handleSelect(size)}
          >
            {size}
          </Button>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button
          variant="ghost"
          onClick={() => onNext(value)}
          disabled={isNextDisabled}
        >
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
