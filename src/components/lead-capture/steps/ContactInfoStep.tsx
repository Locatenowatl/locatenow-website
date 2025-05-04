import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft } from 'lucide-react';
import { FormData } from '../types';
import { Star } from 'lucide-react';

interface ContactInfoStepProps {
  formData: FormData;
  onChange: (data: Partial<FormData>) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function ContactInfoStep({ formData, onChange, onBack, onSubmit }: ContactInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Start your Search!</h2>
        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
          <span>4.9</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#B69D74] text-[#B69D74]" />
            ))}
          </div>
          <span>3,000+ reviews</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Your Full Name *"
          value={formData.name}
          onChange={(e) => onChange({ name: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
          />
          <Input
            placeholder="Phone Number *"
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            required
          />
        </div>
        <div className="bg-[#F5F1EB] p-4 rounded-lg text-sm">
          <p>Our 1-on-1 approach starts with a phone consultation, so please enter a valid phone number. We do not share your contact information with 3rd parties.</p>
        </div>
        <div>
          <p className="text-sm mb-2">+ Anything else you'd like us to know?</p>
          <Textarea
            value={formData.additionalInfo}
            onChange={(e) => onChange({ additionalInfo: e.target.value })}
            rows={3}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="emailDeals"
            checked={formData.emailDeals}
            onCheckedChange={(checked) => onChange({ emailDeals: checked as boolean })}
          />
          <label htmlFor="emailDeals" className="text-sm">
            Email me a list of exclusive deals in Atlanta!
          </label>
        </div>
        <div className="flex justify-between pt-4">
          <Button type="button" variant="ghost" onClick={onBack}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button 
            type="submit"
            className="bg-[#B69D74] hover:bg-[#A38B62] px-8"
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}