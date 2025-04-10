"use client";

import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";
import { GoArrowRight } from "react-icons/go";

const faqs = [
  {
    question: "Suspendisse ultrices pharetra libero sed interdum.",
    answer: "",
    bullets: [
      "Vivamus sed est non arcu porta aliquet et vitae nulla.",
      "Integer et lacus vitae justo fermentum rutrum.",
      "Proin blandit nunc risus, at semper turpis sagittis nec.",
      "Quisque ut dolor erat.",
    ],
  },
  {
    question: "Fusce molestie condimentum facilisis.",
    answer: `Nulla malesuada iaculis nisi, vitae sagittis lacus laoreet in. Morbi aliquet pulvinar orci non vulputate. Donec aliquet ullamcorper gravida. Interdum et malesuada fames ac ante ipsum primis in faucibus.`,
    bullets: [
      "Vivamus sed est non arcu porta aliquet et vitae nulla.",
      "Integer et lacus vitae justo fermentum rutrum.",
      "Proin blandit nunc risus, at semper turpis sagittis nec.",
      "Quisque ut dolor erat.",
    ],
  },
  {
    question: "Quisque quis nunc quis urna tempor lobortis vel non orci.",
    answer: "",
    bullets: [
      "Vivamus sed est non arcu porta aliquet et vitae nulla.",
      "Integer et lacus vitae justo fermentum rutrum.",
      "Proin blandit nunc risus, at semper turpis sagittis nec.",
      "Quisque ut dolor erat.",
    ],
  },
  {
    question:
      "Donec rutrum ultrices ante nec malesuada. In accumsan eget nisi a rhoncus.",
    answer: "",
    bullets: [
      "Vivamus sed est non arcu porta aliquet et vitae nulla.",
      "Integer et lacus vitae justo fermentum rutrum.",
      "Proin blandit nunc risus, at semper turpis sagittis nec.",
      "Quisque ut dolor erat.",
    ],
  },
  {
    question: "Nulla sed sapien maximus, faucibus massa vitae.",
    answer: "",
    bullets: [
      "Vivamus sed est non arcu porta aliquet et vitae nulla.",
      "Integer et lacus vitae justo fermentum rutrum.",
      "Proin blandit nunc risus, at semper turpis sagittis nec.",
      "Quisque ut dolor erat.",
    ],
  },
];

export default function FaqSection() {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set([1])); // Default open 2nd

  const toggleIndex = (index: number) => {
    const newSet = new Set(openIndexes);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setOpenIndexes(newSet);
  };

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 py-10">
        {/* FAQ Accordion */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, index) => {
            const isOpen = openIndexes.has(index);
            return (
              <div
                key={index}
                className={`border rounded-sm border-[#E4E7E9] transition-all ${
                  isOpen ? "bg-orange-100 border-[#E4E7E9]" : "bg-white"
                }`}
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className={`w-full text-left p-4 flex justify-between items-center ${
                    isOpen ? "bg-[#FA8232] text-white" : ""
                  }`}
                >
                  <span className="font-medium">{faq.question}</span>
                  {isOpen ? (
                    <FiMinus className="text-xl cursor-pointer" />
                  ) : (
                    <FiPlus className="text-xl cursor-pointer" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-gray-700 space-y-3">
                    {faq.answer && <p>{faq.answer}</p>}
                    {faq.bullets && (
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {faq.bullets.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="bg-[#FBF4CE] p-6 rounded-lg max-h-[500px] min-h-[400px] overflow-auto">
          <h3 className="text-lg font-semibold mb-2">
            Don’t find your answer? Ask for support.
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed
            molestie accumsan dui.
          </p>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2 border border-[#F7E99E] rounded-sm focus:outline-none bg-white"
            />
            <input
              type="text"
              placeholder="Subject"
              className="w-full px-4 py-2 border border-[#F7E99E] rounded-sm focus:outline-none bg-white"
            />
            <textarea
              rows={4}
              placeholder="Message (Optional)"
              className="w-full px-4 py-2 border border-[#F7E99E] rounded-sm focus:outline-none bg-white"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-sm flex items-center justify-center hover:bg-orange-600 transition"
            >
              SEND MESSAGE <GoArrowRight />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
