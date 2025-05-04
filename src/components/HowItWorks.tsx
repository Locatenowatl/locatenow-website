// src/components/HowItWorks.tsx
import { Button } from '@/components/ui/button';

const steps = [
  {
    title: 'Start Now',
    description: 'Answer a few questions about what youre looking for'
  },
  {
    title: 'Locate Now',
    description: 'Our ATL local experts create a personalized list of apartments and works with you to finalize your favorite options'
  },
  {
    title: 'Tour Now',
    description: 'Your agent will handle leasing communications and schedule tours so all you need to do is show up'
  },
  {
    title: 'Lease Now',
    description: 'Our ATL local experts create a personalized list of apartments'
  }
];

export function HowItWorks({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <section id="how-it-works" className="bg-[#1A1A1A] text-white py-24 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-[#B69D74] mb-2">Ready to connect with your locator?</p>
          <h2 className="text-4xl font-bold mb-8">Here's how it works!</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <h3 className="mb-4">
                  <span className="text-[#B69D74] font-bold text-2xl">{step.title.split(' ')[0]}</span>
                  <span className="text-white font-bold text-2xl"> {step.title.split(' ')[1]}</span>
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80" 
            alt="Atlanta Skyline" 
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Modern Apartment Interior" 
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Apartment Building Exterior" 
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-lg overflow-hidden lg:block hidden">
            <img 
              src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Luxury Apartment View" 
              className="w-full h-64 object-cover"
            />
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={onOpenModal}
            className="bg-[#B69D74] hover:bg-[#A38B62] text-white px-8 py-6 text-lg"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
