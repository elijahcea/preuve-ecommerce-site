"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Faq() {
  const faqItems = [
    {
      question: "What is your return policy?",
      answer:
        "Unfortunately, we are unable to cancel an order once it has been submitted. No exchanges. If the purchased item is the incorrect size you need to repurchase the correct size and we will refund your incorrect order. Please email​ elijah.cea01@gmail.com w​ithin 30 min of your update to process your refund properly.",
    },
    {
      question: "Will sold out items be restocked?",
      answer:
        "All restocks are available on a first come first serve basis. Please note product restocks are not guaranteed and are dependent on product availability.",
    },
    {
      question: "Which countries do you ship to?",
      answer: "We ship globally.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, Amex, Mastercard, Discover) and PayPal. During a high volume release certain payment methods may be unavailable for security reasons.",
    },
  ];
  return (
    <main className="flex flex-col justify-center items-center my-auto">
      <h1 className="font-semibold text-lg">FAQ</h1>

      <section className="w-full max-w-2xl flex flex-col items-center px-4 text-sm divide-y divide-foreground/10">
        {faqItems.map((i, idx) => (
          <Disclosure key={idx} as="div" className="w-full p-4">
            <DisclosureButton className="py-2 flex w-full justify-between gap-1 cursor-pointer">
              {i.question}{" "}
              <ChevronDownIcon className="size-5 data-open:rotate-180" />
            </DisclosureButton>
            <DisclosurePanel className="mt-2 text-foreground/50">
              {i.answer}
            </DisclosurePanel>
          </Disclosure>
        ))}
      </section>
    </main>
  );
}
