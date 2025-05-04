// src/components/lead-capture/LeadCaptureForm.tsx
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ApartmentSizeStep, SizeOption } from './steps/ApartmentSizeStep';
import { Progress } from '@/components/ui/progress';
import { BudgetStep } from './steps/BudgetStep';
import { MoveInDateStep } from './steps/MoveInDateStep';
import { AmenitiesStep } from './steps/AmenitiesStep';
import { ContactInfoStep } from './steps/ContactInfoStep';
import { FormData } from './types';

const STEPS = ['size', 'budget', 'moveIn', 'amenities', 'contact'] as const;
type StepKey = typeof STEPS[number];

interface LeadCaptureFormProps {
  onClose: () => void;
}

export function LeadCaptureForm({ onClose }: LeadCaptureFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<StepKey>('size');
  const [formData, setFormData] = useState<FormData>({
    size: [] as SizeOption[],
    budget: '',
    moveInDate: ['', ''],
    amenities: [],
    name: '',
    email: '',
    phone: '',
    additionalInfo: '',
    emailDeals: false,
  });

  const currentIndex = STEPS.indexOf(currentStep);
  const progressPercent = ((currentIndex + 1) / STEPS.length) * 100;

  const updateFormData = (fields: Partial<FormData>) =>
    setFormData(prev => ({ ...prev, ...fields }));

  const handleNext = (fields: Partial<FormData>) => {
    updateFormData(fields);
    if (currentIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentStep(STEPS[currentIndex - 1]);
  };

  const handleComplete = () => {
    toast({ title: 'Submitted!', description: 'Thanks for your info.' });
    onClose();
  };

  return (
    <div className="space-y-6 px-6 pb-6">
      {/* Progress bar */}
      <Progress value={progressPercent} className="mb-6" />

      {currentStep === 'size' && (
        <ApartmentSizeStep
          value={formData.size}
          onChange={sizes => updateFormData({ size: sizes })}
          onBack={handleBack}
          onNext={(sizes: SizeOption[]) => handleNext({ size: sizes })}
        />
      )}

      {currentStep === 'budget' && (
        <BudgetStep
          value={formData.budget}
          sizes={formData.size}
          onChange={budget => updateFormData({ budget })}
          onBack={handleBack}
          onNext={() => handleNext({ budget: formData.budget })}
        />
      )}

      {currentStep === 'moveIn' && (
        <MoveInDateStep
          value={formData.moveInDate}
          onChange={moveInDate => updateFormData({ moveInDate })}
          onBack={handleBack}
          onNext={() => handleNext({ moveInDate: formData.moveInDate })}
        />
      )}

      {currentStep === 'amenities' && (
        <AmenitiesStep
          selectedAmenities={formData.amenities}
          onChange={amenities => updateFormData({ amenities })}
          onBack={handleBack}
          onNext={() => handleNext({ amenities: formData.amenities })}
        />
      )}

      {currentStep === 'contact' && (
        <ContactInfoStep
          formData={formData}
          onChange={data => updateFormData(data)}
          onBack={handleBack}
          onSubmit={handleComplete}
        />
      )}
    </div>
  );
}
