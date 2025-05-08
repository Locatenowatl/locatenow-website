// src/components/lead-capture/types.ts
import { SizeOption } from './steps/ApartmentSizeStep';

export interface FormData {
  size: SizeOption[];
  budget: string;
  // now a single ISO date
  moveInDate: string;
  amenities: string[];

  // new credit/background fields
  creditStatus: string;
  backgroundIssues: string[];
  employmentStatus: string;

  name: string;
  email: string;
  phone: string;
  additionalInfo: string;
  emailDeals: boolean;
}
