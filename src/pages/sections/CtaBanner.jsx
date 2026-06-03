import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ctaBg from "@/assets/Rectangle 4.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

export default function CtaBanner() {
  return (
    <section
      className="py-24 px-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${ctaBg})` }}
    >
      <div className="max-w-7xl mx-auto text-white">
        <motion.div
          className="bg-black/50 p-12 rounded-2xl"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <motion.h3
            className="text-2xl text-brand-blue font-medium uppercase tracking-widest"
            variants={fadeUp}
          >
            YOU ARE NEXT
          </motion.h3>
          <motion.h2
            className="text-6xl md:text-7xl lg:text-8xl font-black mt-4 leading-tight"
            variants={fadeUp}
          >
            THE NEXT BIG EVENT IS NEARBY
          </motion.h2>
          <motion.div className="mt-8" variants={fadeUp}>
            <Link
              to="/event"
              className="inline-block bg-[#1d76f2] text-white px-6 py-3 rounded-full"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}