// src/components/lead-capture/steps/AmenitiesStep.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AmenitiesStepProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
  onBack: () => void;
  onNext: () => void;      // added onNext
}

const AMENITIES = [
  'Gym',
  'Pool',
  'Pet Friendly',
  'Parking',
  'Washer/Dryer',
  'Air Conditioning',
];

export function AmenitiesStep({ selectedAmenities: initialSelected, onChange, onBack, onNext }: AmenitiesStepProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  // Sync if parent resets
  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  const toggle = (amenity: string) => {
    setSelected((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleNext = () => {
    onChange(selected);
    onNext();           // invoke onNext to advance
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">Select amenities</h2>
      <div className="grid grid-cols-2 gap-4">
        {AMENITIES.map((amenity) => (
          <label key={amenity} className="flex items-center space-x-2">
            <Checkbox
              checked={selected.includes(amenity)}
              onCheckedChange={() => toggle(amenity)}
            />
            <span>{amenity}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button variant="default" onClick={handleNext}>
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
