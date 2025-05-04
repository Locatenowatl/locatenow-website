// src/components/FAQ.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQItems: FAQItem[] = [
  {
    question: "Is your apartment locating service really free?",
    answer:
      "Yes! Our service is completely free for renters. We're paid by the properties when you lease through us, so there's never any cost to you.",
  },
  {
    question: "How does the apartment locating process work?",
    answer:
      "After you submit your preferences, one of our local experts will reach out within 24 hours to discuss your needs in detail. We'll then create a curated list of apartments that match your criteria, schedule tours for you, and help negotiate the best possible deal.",
  },
  {
    question: "What areas of Atlanta do you serve?",
    answer:
      "We serve all of Metro Atlanta, including popular neighborhoods like Midtown, Buckhead, Virginia Highland, Old Fourth Ward, West Midtown, and many more. Our experts know each area intimately and can help you find the perfect location.",
  },
  {
    question: "How long does the process typically take?",
    answer:
      "The timeline varies based on your needs, but we typically help clients find and secure their perfect apartment within 1-2 weeks. If you're planning further ahead, we can start the search process up to 3 months before your desired move date.",
  },
  {
    question: "What information do I need to have ready?",
    answer:
      "It's helpful to know your budget, desired move-in date, preferred areas, and must-have amenities. You'll also need proof of income (typically 3x the monthly rent), photo ID, and funds for application fees and deposits when you're ready to apply.",
  },
  {
    question: "Can you help negotiate better rates or terms?",
    answer:
      "Absolutely! We have established relationships with properties across Atlanta and often have access to special deals and promotions. We'll always advocate for the best possible terms on your behalf.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-[#1A1A1A] text-white py-24">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-[#B69D74]">
            Everything you need to know about our apartment locating service
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {FAQItems.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-gray-800 rounded-lg px-6 bg-[#2A2A2A]"
            >
              <AccordionTrigger className="text-left hover:text-[#B69D74] py-6">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-6">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
