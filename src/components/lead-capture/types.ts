// src/components/lead-capture/types.ts
import { SizeOption } from './steps/ApartmentSizeStep';

export interface FormData {
  size: SizeOption[];
  budget: string;
  // now a range: [startISO, endISO]
  moveInDate: [string, string];
  amenities: string[];
  name: string;
  email: string;
  phone: string;
  additionalInfo: string;
  emailDeals: boolean;
}
