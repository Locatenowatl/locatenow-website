import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

export interface CreditStepProps {
  creditStatus: string;
  backgroundIssues: string[];
  employmentStatus: string;
  onChange: (data: {
    creditStatus: string;
    backgroundIssues: string[];
    employmentStatus: string;
  }) => void;
  onBack: () => void;
  onNext: () => void;
}

const options = {
  credit: [
    'Great 700-850',
    'Good 600-700',
    'Fair 550-600',
    'Poor 300-549',
  ],
  background: [
    'None',
    'Active Rental Debt',
    'Eviction',
    'Bankruptcy',
    'Misdemeanor',
    'Felony',
  ],
  employment: [
    'W-2 Employee',
    'Contractor',
    'Self-Employed',
    'Student',
    'Other',
  ],
};

export default function CreditStep({
  creditStatus,
  backgroundIssues,
  employmentStatus,
  onChange,
  onBack,
  onNext,
}: CreditStepProps) {
  const [localCredit, setLocalCredit] = useState<string>(creditStatus);
  const [localBackground, setLocalBackground] =
    useState<string[]>(backgroundIssues);
  const [localEmployment, setLocalEmployment] =
    useState<string>(employmentStatus);

  useEffect(() => {
    onChange({
      creditStatus: localCredit,
      backgroundIssues: localBackground,
      employmentStatus: localEmployment,
    });
  }, [localCredit, localBackground, localEmployment, onChange]);

  const toggleBackground = (issue: string) => {
    setLocalBackground(prev =>
      prev.includes(issue) ? prev.filter(i => i !== issue) : [...prev, issue]
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <h2 className="text-2xl font-semibold">
          How do your credit & background look?
        </h2>
        <Info className="w-5 h-5 text-gray-500" />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {/* Credit Status */}
        <section>
          <h3 className="font-medium mb-1">Credit Status</h3>
          <div className="grid grid-cols-4 gap-2">
            {options.credit.map(opt => (
              <Button
                key={opt}
                variant="outline"
                className={`flex flex-col items-center justify-center px-4 py-2 text-center transition-colors duration-150 hover:bg-blue-50 hover:border-blue-300 ${
                  localCredit === opt
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : ''
                }`}
                onClick={() => setLocalCredit(opt)}
              >
                <span className="font-semibold text-sm">{opt.split(' ')[0]}</span>
                <span className="text-xs">{opt.split(' ').slice(1).join(' ')}</span>
              </Button>
            ))}
          </div>
        </section>

        {/* Background Issues */}
        <section>
          <h3 className="font-medium mb-1">Background Issues</h3>
          <div className="grid grid-cols-3 gap-2">
            {options.background.map(issue => (
              <Button
                key={issue}
                variant="outline"
                className={`px-4 py-2 text-center transition-colors duration-150 hover:bg-blue-50 hover:border-blue-300 ${
                  localBackground.includes(issue)
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : ''
                }`}
                onClick={() => toggleBackground(issue)}
              >
                {issue}
              </Button>
            ))}
          </div>
        </section>

        {/* Employment Status */}
        <section>
          <h3 className="font-medium mb-1">Employment Status</h3>
          <div className="grid grid-cols-2 gap-2">
            {options.employment.slice(0, 4).map(status => (
              <Button
                key={status}
                variant="outline"
                className={`px-4 py-2 text-center transition-colors duration-150 hover:bg-blue-50 hover:border-blue-300 ${
                  localEmployment === status
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : ''
                }`}
                onClick={() => setLocalEmployment(status)}
              >
                {status}
              </Button>
            ))}
            <div className="col-span-2">
              <Button
                variant="outline"
                className={`w-full px-4 py-2 text-center transition-colors duration-150 hover:bg-blue-50 hover:border-blue-300 ${
                  localEmployment === 'Other'
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : ''
                }`}
                onClick={() => setLocalEmployment('Other')}
              >
                Other
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button
          variant="default"
          onClick={onNext}
          disabled={!localCredit || !localEmployment}
          className="disabled:opacity-50 px-6 py-3"
        >
          Next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
