import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Calendar, Gift } from 'lucide-react';
import aboutBanner from '@/assets/Frame 410.png';
import aboutBg from '@/assets/Rectangle 4.jpg';

const features = [
  {
    icon: Heart,
    title: 'Love & Commitment',
    description:
      'Celebrating love stories and helping couples begin their journey together.',
    color: 'text-brand-blue',
  },
  {
    icon: Users,
    title: 'Community Building',
    description:
      'Bringing together couples, families, and wedding professionals in one place.',
    color: 'text-brand-blue',
  },
  {
    icon: Calendar,
    title: 'Event Excellence',
    description:
      'Curating unforgettable wedding expos and bridal shows across the Philippines.',
    color: 'text-brand-blue',
  },
  {
    icon: Gift,
    title: 'Special Offers',
    description:
      'Exclusive deals, giveaways, and special packages for wedding couples.',
    color: 'text-brand-blue',
  },
];

export default function About() {
  return (
    <div className='bg-white min-h-screen animate-page-in'>
      {/* Hero Section */}
      <section className='py-24 px-8 bg-brand-dark text-white relative overflow-hidden'>
        <div
          className='absolute inset-0 opacity-20 bg-cover bg-center'
          style={{ backgroundImage: `url(${aboutBg})` }}
        />
        <div className='absolute inset-0 bg-linear-to-b from-brand-dark via-brand-dark/90 to-brand-dark' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-brand-blue/10 via-transparent to-transparent' />

        <div className='max-w-7xl mx-auto relative z-10'>
          <div className='text-center animate-fade-in-up'>
            <h3 className='text-brand-blue font-bold tracking-widest text-2xl uppercase mb-4'>
              About Us
            </h3>
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-tight mb-6 animate-fade-in-up delay-100'>
              DTI <span className='text-brand-blue'>WEDDING FAIR</span>
            </h1>
            <p className='text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200'>
              The premier wedding exhibition experience in the Philippines,
              connecting couples with the best wedding professionals and
              creating unforgettable moments.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className='py-24 px-8 bg-white'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-16 items-center animate-fade-in-up'>
            <div className='rounded-2xl overflow-hidden shadow-2xl hover:shadow-3d hover:scale-[1.02] transition-all duration-500 group'>
              <div className='absolute inset-0 bg-linear-to-tr from-brand-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              <img
                src={aboutBanner}
                alt='Wedding Fair Event'
                className='w-full h-full object-cover transform group-hover:rotate-y-3 transition-transform duration-700'
                style={{ transformStyle: 'preserve-3d' }}
              />
            </div>

            <div className='flex flex-col justify-center animate-fade-in-left'>
              <h3 className='text-gray-900 font-bold tracking-widest text-2xl uppercase mb-4'>
                Who We Are
              </h3>
              <h2 className='text-brand-blue text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-tight mb-6'>
                Celebrating Love
              </h2>
              <p className='text-gray-600 text-lg leading-relaxed mb-6'>
                DTI Wedding Fair is the Philippines' most prestigious wedding
                exhibition experience. We bring together engaged couples and the
                wedding industry's finest professionals in one spectacular
                setting.
              </p>
              <p className='text-gray-600 text-lg leading-relaxed mb-8'>
                Since our inception, we've been dedicated to helping couples
                plan their perfect wedding day. Our events feature hundreds of
                exhibitors, including venues, photographers, florists, dress
                designers, and more.
              </p>
              <Link
                to='/event'
                className='bg-brand-blue hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1'
              >
                Explore Our Events{' '}
                <ArrowRight className='h-5 w-5 group-hover:rotate-45 transition-transform duration-300' />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-24 px-8 bg-gray-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16 animate-fade-in-up'>
            <h3 className='text-gray-900 font-bold tracking-widest text-2xl uppercase mb-4'>
              What We Offer
            </h3>
            <h2 className='text-brand-blue text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-tight'>
              Why Choose Us
            </h2>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in-up'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='bg-white p-8 rounded-2xl shadow-lg hover:shadow-3d hover:-translate-y-2 transition-all duration-500 group'
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
              >
                <div
                  className={`w-16 h-16 ${feature.color} bg-opacity-10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <feature.icon size={32} className={feature.color} />
                </div>
                <h4 className='text-2xl font-bold mb-4 text-[#212121] group-hover:text-brand-blue transition-colors'>
                  {feature.title}
                </h4>
                <p className='text-gray-600 leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className='py-24 px-8 bg-brand-dark text-white'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-16 items-center animate-fade-in-up'>
            <div className='order-2 lg:order-1 animate-fade-in-right'>
              <h3 className='text-brand-blue font-bold tracking-widest text-2xl uppercase mb-4'>
                Our Mission
              </h3>
              <h2 className='text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-tight mb-6'>
                Making Dreams Come True
              </h2>
              <p className='text-gray-300 text-lg leading-relaxed mb-6'>
                Our mission is to create unforgettable wedding experiences that
                help couples celebrate their love story in the most beautiful
                way possible.
              </p>
              <p className='text-gray-300 text-lg leading-relaxed mb-8'>
                We believe that every wedding tells a unique story, and we're
                here to help couples write the most beautiful chapter of their
                lives.
              </p>
              <Link
                to='/contact'
                className='border-2 border-brand-blue hover:bg-brand-blue text-brand-blue hover:text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-lg hover:-translate-y-1'
              >
                Get In Touch
              </Link>
            </div>
            <div className='order-1 lg:order-2 animate-fade-in-left'>
              <div className='relative' style={{ perspective: '1000px' }}>
                <div className='absolute inset-0 bg-brand-blue rounded-2xl transform translate-x-4 translate-y-4 transition-transform duration-500 hover:rotate-6' />
                <img
                  src={aboutBg}
                  alt='Wedding celebration'
                  className='relative rounded-2xl shadow-2xl w-full transform hover:scale-105 transition-transform duration-500'
                  style={{ transformStyle: 'preserve-3d' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-24 px-8 bg-brand-blue text-white relative overflow-hidden animate-fade-in-up'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent' />
        <div className='max-w-7xl mx-auto text-center relative z-10'>
          <h2 className='text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-tight mb-6'>
            Ready to Plan Your Wedding?
          </h2>
          <p className='text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto'>
            Join thousands of couples who found their perfect wedding
            professionals at DTI Wedding Fair.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              to='/event'
              className='bg-brand-dark hover:bg-black text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-xl hover:-translate-y-1'
            >
              Browse Events
            </Link>
            <Link
              to='/contact'
              className='bg-white text-brand-blue hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-all hover:shadow-xl hover:-translate-y-1'
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
