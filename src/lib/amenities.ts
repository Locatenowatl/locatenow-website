export interface Amenity {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const AMENITIES: Amenity[] = [
  {
    id: 'pet-friendly',
    name: 'Pet Friendly',
    icon: '🐾',
    description: 'Welcome pets with designated areas'
  },
  {
    id: 'balcony',
    name: 'Balcony/Patio',
    icon: '🏗️',
    description: 'Private outdoor space'
  },
  {
    id: 'rooftop',
    name: 'Rooftop Lounge',
    icon: '🌆',
    description: 'Scenic views and social space'
  },
  {
    id: 'concierge',
    name: 'Concierge',
    icon: '👔',
    description: '24/7 front desk service'
  },
  {
    id: 'fitness',
    name: 'Fitness Center',
    icon: '💪',
    description: '24/7 gym access'
  },
  {
    id: 'windows',
    name: 'Floor to Ceiling Windows',
    icon: '🪟',
    description: 'Natural light and views'
  },
  {
    id: 'parking',
    name: 'Covered Parking',
    icon: '🅿️',
    description: 'Protected vehicle parking'
  },
  {
    id: 'sauna',
    name: 'Sauna',
    icon: '🧖',
    description: 'Relaxation and wellness'
  }
];