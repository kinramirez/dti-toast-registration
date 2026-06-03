import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Banner from '@/assets/Rectangle 3.png';
import Mic from '@/assets/Rectangle 5.png';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function AboutSection() {
  return (
    <section className='bg-white py-b-24 px-8 overflow-x-hidden'>
      <motion.div
        className='relative left-1/2 -translate-x-1/2 w-screen overflow-hidden rounded-b-2xl mb-8'
        variants={fadeUp}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: false, amount: 0.2 }}
      >
        <img src={Banner} alt='About banner' className='w-full h-auto block' />
      </motion.div>

      <div className='max-w-7xl mx-auto'>
        <motion.header
          className='mb-12'
          variants={fadeUp}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: false, amount: 0.3 }}
        >
          <h3 className='text-gray-900 font-bold tracking-widest text-3xl uppercase'>
            WHO ARE WE
          </h3>
          <h2 className='text-[#1d76f2] text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-tight'>
            ABOUT US
          </h2>
        </motion.header>

        <div className='grid md:grid-cols-2 gap-12 items-start'>
          <motion.div
            className='rounded-2xl overflow-hidden shadow-xl'
            variants={fadeLeft}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: false, amount: 0.2 }}
          >
            <img
              src={Mic}
              alt='Microphone'
              className='w-full h-full object-cover'
            />
          </motion.div>

          <motion.div
            className='flex flex-col justify-center h-full'
            variants={fadeRight}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: false, amount: 0.2 }}
          >
            <p className='text-gray-600 leading-relaxed mb-4'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
              Praesent mauris.
            </p>
            <p className='text-gray-600 leading-relaxed mb-8'>
              Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum
              lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora
              torquent per conubia nostra, per inceptos himenaeos.
            </p>
            <Link
              className='bg-[#1d76f2] hover:bg-blue-700 text-white w-fit px-8 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-all shadow-lg'
              to='/event'
            >
              Explore more <ArrowRight className='h-4 w-4' />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
