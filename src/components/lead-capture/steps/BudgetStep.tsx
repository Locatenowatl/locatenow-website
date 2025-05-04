// src/components/lead-capture/steps/BudgetStep.tsx
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SizeOption } from './ApartmentSizeStep';

interface BudgetStepProps {
  /** Currently selected budget preset or custom string */
  value: string;
  /** Apartment sizes selected in the previous step */
  sizes: SizeOption[];
  onChange: (budget: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function BudgetStep({ value, sizes, onChange, onBack, onNext }: BudgetStepProps) {
  // Define preset budgets for each size
  const budgetsBySize: Record<SizeOption, number[]> = {
    STUDIO:   [1400, 1600, 1800, 2000, 2200, 2400],
    '1 BED':  [1600, 1800, 2000, 2300, 2600, 3000],
    '2 BED':  [2200, 2400, 2600, 3000, 3500, 4000],
    '3+ BEDS':[3000, 3400, 3800, 4200, 4600, 5000],
  };

  // Compute which presets to show
  const presetBudgets = useMemo<number[]>(() => {
    if (sizes.includes('STUDIO') && sizes.includes('1 BED')) {
      return Array.from(
        new Set([...(budgetsBySize.STUDIO || []), ...(budgetsBySize['1 BED'] || [])])
      ).sort((a, b) => a - b);
    }
    const primary = sizes[0];
    return budgetsBySize[primary] || [];
  }, [sizes]);

  // Determine if current value is custom (not in presets)
  const showCustom = !presetBudgets.map(String).includes(value) && value !== '';

  // Handle clicking a preset button
  const handlePresetClick = (amt: number) => {
    onChange(amt.toString());
  };

  // Handle typing into custom input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const isNextDisabled = value === '';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">What is your budget?</h2>

      {/* Preset buttons + custom input in a grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {presetBudgets.map((amt) => (
          <Button
            key={amt}
            variant={value === amt.toString() ? 'default' : 'outline'}
            onClick={() => handlePresetClick(amt)}
            className={value === amt.toString() ? 'bg-[#B69D74] text-white' : ''}
          >
            ${amt.toLocaleString()}
          </Button>
        ))}
      </div>

      {/* Combined custom input field centered below */}
      <div className="flex justify-center mt-4">
        <Input
          type="number"
          placeholder="Other…"
          value={showCustom ? value : ''}
          onChange={handleInputChange}
          className={`w-2/3 ${showCustom ? 'border-[#B69D74]' : 'border-gray-300'}`}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button variant="default" onClick={onNext} disabled={isNextDisabled}>
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
