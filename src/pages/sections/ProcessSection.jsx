import { motion } from "framer-motion";
import processBg from "@/assets/Frame 416.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.12 },
  }),
};

const steps = [
  { title: "Explore Events", desc: "Browse our calendar for upcoming events, workshops, and conferences." },
  { title: "Get Details", desc: "Click on an event to view schedule, speakers, and registration info." },
  { title: "Register", desc: "Sign up for events that interest you and receive confirmation." },
  { title: "Attend", desc: "Join us on the event day and connect with other attendees." },
  { title: "Stay Updated", desc: "Get reminders and updates on your registered events." },
];

export default function ProcessSection() {
  return (
    <section className="py-10 px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        <motion.header
          className="mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <h3 className="text-gray-900 font-bold tracking-widest text-3xl uppercase">
            HOW IT WORK
          </h3>
          <h2 className="text-[#1d76f2] text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-tight">
            THE PROCESS
          </h2>
        </motion.header>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
          >
            <img
              src={processBg}
              alt="process"
              className="rounded-2xl shadow-lg w-full object-cover h-[580px]"
            />
          </motion.div>

          <div className="flex flex-col justify-center mt-2 ml-10">
            <ul className="space-y-6">
              {steps.map((step, i) => (
                <motion.li
                  key={step.title}
                  custom={i}
                  variants={fadeRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, amount: 0.3 }}
                >
                  <h4 className="text-5xl font-bold">{step.title}</h4>
                  <p className="text-gray-500 text-base mt-3">{step.desc}</p>
                </motion.li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}