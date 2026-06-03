import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const faqs = [
  { number: "1. ", question: "How do I register for an event?", answer: "Click the 'Register' button on an event page and complete the form." },
  { number: "2. ", question: "Can I cancel my registration?", answer: "Yes — check the event policy for cancellation windows." },
  { number: "3. ", question: "Will I get a certificate of attendance?", answer: "Some events provide certificates; see event details." },
  { number: "4. ", question: "Is the event available offline?", answer: "Venue information is listed on the event page." },
  { number: "5. ", question: "How will I receive event updates?", answer: "We send reminders via email and SMS (if provided)." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function FaqsSection() {
  const [openIndexes, setOpenIndexes] = useState([]);

  const toggle = (index) => {
    setOpenIndexes(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        <motion.header
          className="mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <h3 className="text-gray-900 font-bold tracking-widest text-2xl uppercase mb-2">
            FREQUENTLY ASKED QUESTIONS
          </h3>
          <h2 className="text-brand-blue text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
            FAQs
          </h2>
        </motion.header>

        <motion.div
          className="space-y-6 max-w-6xl"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="flex items-start justify-between gap-4"
              variants={itemVariant}
            >
              <div className="flex-1">
                <p className="text-3xl font-bold">
                  <span className="text-brand-blue">{faq.number}</span>{faq.question}
                </p>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndexes.includes(index) ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                }`}>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              </div>
              <ArrowRight
                onClick={() => toggle(index)}
                className={`text-brand-blue transition-transform duration-300 cursor-pointer shrink-0 ml-4 ${
                  openIndexes.includes(index) ? "-rotate-90" : ""
                }`}
                size={30}
                strokeWidth={3}
              />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}