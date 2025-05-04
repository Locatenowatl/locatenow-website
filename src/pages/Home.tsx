// src/pages/Home.tsx
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { FAQ } from '@/components/FAQ';

interface HomeProps {
  onOpenModal: () => void;
}

export default function Home({ onOpenModal }: HomeProps) {
  return (
    <>
      <Hero onOpenModal={onOpenModal} />
      <Features />
      <HowItWorks onOpenModal={onOpenModal} />
      <FAQ />
    </>
  );
}