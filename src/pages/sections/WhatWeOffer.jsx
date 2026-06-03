import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Frame411 from "../../assets/Frame 411.png";
import Frame410 from "../../assets/Frame 410.png";
import Frame412 from "../../assets/Frame 412.png";
import Frame413 from "../../assets/Frame 413.png";
import Frame415 from "../../assets/Frame 415.png";
import Frame414 from "../../assets/Frame 414.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const imgVariant = (rotate, x = 0) => ({
  hidden: { opacity: 0, rotate: 0, x },
  visible: { opacity: 1, rotate, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
});

export default function WhatWeOffer() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center"]
  });

  // Progress stops at 1 (complete) and holds
  const clampedProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  
  // Smooth spring animation
  const smoothProgress = useSpring(clampedProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Cards start from right (positive x) and move to final position (x: 0)
  const x1 = useTransform(smoothProgress, [0, 1], [150, 0]);   // Frame411
  const x2 = useTransform(smoothProgress, [0, 1], [300, 0]);   // Frame412
  const x3 = useTransform(smoothProgress, [0, 1], [200, 0]);   // Frame410
  const x4 = useTransform(smoothProgress, [0, 1], [250, 0]);   // Frame413
  const x5 = useTransform(smoothProgress, [0, 1], [350, 0]);   // Frame415
  const x6 = useTransform(smoothProgress, [0, 1], [200, 0]);   // Frame414

  const cards = [
    { 
      src: Frame411, 
      alt: "frame-411", 
      finalStyle: { left: "3%", top: "48px", width: "300px", height: "420px", zIndex: 50 }, 
      x: x1 
    },
    { 
      src: Frame412, 
      alt: "frame-412", 
      finalStyle: { left: "30%", top: "-10px", width: "480px", height: "580px", zIndex: 80 }, 
      x: x2 
    },
    { 
      src: Frame410, 
      alt: "frame-410", 
      finalStyle: { left: "17%", top: "200px", width: "320px", height: "420px", zIndex: 70 }, 
      x: x3 
    },
    { 
      src: Frame413, 
      alt: "frame-413", 
      finalStyle: { right: "26%", top: "450px", width: "270px", height: "330px", zIndex: 45 }, 
      x: x4 
    },
    { 
      src: Frame415, 
      alt: "frame-415", 
      finalStyle: { right: "10%", top: "200px", width: "360px", height: "480px", zIndex: 60 }, 
      x: x5 
    },
    { 
      src: Frame414, 
      alt: "frame-414", 
      finalStyle: { right: "9%", top: "750px", width: "320px", height: "420px", zIndex: 30 }, 
      x: x6 
    },
  ];

  return (
    <section className="py-24 px-8 bg-gradient-to-b from-white to-[#1877F2]">
      <div className="max-w-7xl mx-auto">
        <motion.header
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.3 }}
        >
          <h3 className="text-black font-bold tracking-widest text-2xl uppercase mb-2">
            WHAT WE OFFER
          </h3>
          <h2 className="text-brand-blue text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-tight">
            DTI EVENTS
          </h2>
        </motion.header>

        {/* Mobile layout */}
        <div className="block md:hidden mt-8">
          <div className="grid grid-cols-2 gap-4">
            {[Frame411, Frame412, Frame410, Frame413, Frame415, Frame414].map((src, i) => (
              <motion.img
                key={i}
                src={src}
                alt={`frame-${i}`}
                className="w-full rounded-2xl"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.2 }}
                custom={i}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
          <motion.p
            className="text-white mt-8 text-sm text-justify leading-relaxed"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
          >
            Dive into our diverse lineup of events tailored to support your business growth!
            From hands-on workshops and expert-led seminars to networking mixers and conferences,
            we've got something for every entrepreneur. Join us to gain valuable insights,
            connect with like-minded peers, and access the resources you need to take your
            business to the next level.
          </motion.p>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block">
          <div className="relative overflow-visible min-h-[920px]">

            <motion.img src={Frame411} alt="Business"
              className="absolute object-contain left-[5%] -top-[40px] w-[27%] h-[531px] z-50 -rotate-[8deg]"
              variants={imgVariant(-8, -60)}
              initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
            />

            <motion.img src={Frame410} alt="Corporate"
              className="absolute object-contain left-[20%] top-[250px] w-[30%] h-[460px] z-[70] rotate-[6deg]"
              variants={imgVariant(6, -40)}
              initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
            />

            <motion.img src={Frame412} alt="Private"
              className="absolute object-contain left-[33%] top-[10px] w-[40%] h-[531px] z-[80] -rotate-[3deg]"
              variants={imgVariant(-3, 0)}
              initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
            />

            <motion.img src={Frame413} alt="Weddings"
              className="absolute object-contain right-[17%] top-[420px] w-[22%] h-auto z-[45] rotate-[5deg]"
              variants={imgVariant(5, 40)}
              initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
            />

            <motion.img src={Frame415} alt="Specials"
              className="absolute object-contain -right-[10%] top-[160px] w-[35%] h-auto z-[60] rotate-[5deg]"
              variants={imgVariant(5, 60)}
              initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
            />

            <motion.img src={Frame414} alt="frame-414"
              className="absolute object-contain -right-[5%] top-[750px] w-[30%] h-[539px] z-30 -rotate-[6deg]"
              variants={imgVariant(-6, 60)}
              initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }}
            />

            <motion.p
              className="absolute text-white text-lg text-justify leading-relaxed left-0 top-[750px] max-w-[53%] z-[90]"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
            >
              Dive into our diverse lineup of events tailored to support your business growth!
              From hands-on workshops and expert-led seminars to networking mixers and
              conferences, we've got something for every entrepreneur. Join us to gain valuable
              insights, connect with like-minded peers, and access the resources you need to
              take your business to the next level. Whether you're looking to boost skills, stay
              updated on industry trends, or expand your network, we're here to help you succeed.
            </motion.p>

          </div>
        </div>
      </div>
    </section>
  );
}