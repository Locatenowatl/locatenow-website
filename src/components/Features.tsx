import { Home, Clock, DollarSign, ThumbsUp } from 'lucide-react';

const features = [
  {
    icon: Home,
    title: "Extensive Network",
    description: "Access to thousands of apartments across the city, including exclusive listings not found elsewhere."
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Our experts do the heavy lifting, presenting you with only the options that match your criteria."
  },
  {
    icon: DollarSign,
    title: "Free Service",
    description: "Our apartment locating service is completely free - we're paid by the properties, not by you."
  },
  {
    icon: ThumbsUp,
    title: "Expert Guidance",
    description: "Get personalized recommendations from local experts who know the market inside and out."
  }
];

export function Features() {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose LocateNow?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We make finding your next apartment simple, fast, and enjoyable.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm">
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}