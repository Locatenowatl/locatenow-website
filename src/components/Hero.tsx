import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onOpenModal: () => void;
}

export function Hero({ onOpenModal }: HeroProps) {
  return (
    <div className="relative bg-black text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80")',
          opacity: '0.4'
        }}
      />
      <div className="relative z-10 px-4 py-32 mx-auto max-w-7xl text-center">
        <Building2 className="w-16 h-16 mx-auto mb-8" />
        <h1 className="text-5xl font-bold mb-6">Find Your Perfect Home</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Let our expert apartment locators help you find your dream home. Free service, 
          personalized recommendations, and exclusive deals.
        </p>
        <Button 
          size="lg" 
          onClick={onOpenModal}
          className="bg-white text-black hover:bg-gray-100"
        >
          Start Your Search
        </Button>
      </div>
    </div>
  );
}