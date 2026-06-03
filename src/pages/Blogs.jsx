import { Link } from 'react-router-dom';
import {
  Calendar,
  Heart,
  MessageCircle,
  Share2,
  ArrowRight,
} from 'lucide-react';
import blog1 from '@/assets/fair_drug.jpg';
import blog2 from '@/assets/fair_food.jpg';
import blog3 from '@/assets/fair_manggahan.jpg';
import blog4 from '@/assets/fair_trade.jpg';
import blog5 from '@/assets/fair_train.jpg';
import ctaBg from '@/assets/Rectangle 4.jpg';

const blogCategories = [
  { name: 'Wedding Planning', count: 45 },
  { name: 'Bridal Fashion', count: 32 },
  { name: 'Venue Selection', count: 28 },
  { name: 'Photography', count: 24 },
  { name: 'Ceremony Ideas', count: 19 },
];

const recentPosts = [
  {
    id: 1,
    title: 'Top 10 Wedding Venues in Metro Manila',
    excerpt:
      'Discover the most beautiful and iconic wedding venues that will make your special day truly unforgettable.',
    image: blog1,
    author: 'Maria Santos',
    date: 'March 15, 2026',
    category: 'Venue Selection',
    readTime: '6 min read',
    likes: 124,
    comments: 32,
  },
  {
    id: 2,
    title: "Bridal Trends for 2026: What's In Style",
    excerpt:
      'Get a glimpse into the hottest bridal fashion trends that will dominate the wedding scene this year.',
    image: blog2,
    author: 'Juan Dela Cruz',
    date: 'March 10, 2026',
    category: 'Bridal Fashion',
    readTime: '5 min read',
    likes: 89,
    comments: 24,
  },
  {
    id: 3,
    title: 'How to Plan a Budget-Friendly Wedding',
    excerpt:
      'Smart tips and tricks to plan your dream wedding without breaking the bank.',
    image: blog3,
    author: 'Ana Reyes',
    date: 'March 5, 2026',
    category: 'Wedding Planning',
    readTime: '8 min read',
    likes: 156,
    comments: 45,
  },
  {
    id: 4,
    title: 'Capturing Forever: Wedding Photography Tips',
    excerpt:
      'Essential tips for couples on choosing the right photographer and what shots to prioritize.',
    image: blog4,
    author: 'Carlos Garcia',
    date: 'February 28, 2026',
    category: 'Photography',
    readTime: '7 min read',
    likes: 112,
    comments: 28,
  },
  {
    id: 5,
    title: 'The Perfect Wedding Ceremony Script',
    excerpt:
      'A comprehensive guide to creating a meaningful and memorable ceremony that reflects your love story.',
    image: blog5,
    author: 'Sofia Lopez',
    date: 'February 20, 2026',
    category: 'Ceremony Ideas',
    readTime: '10 min read',
    likes: 178,
    comments: 52,
  },
  {
    id: 6,
    title: 'Wedding Reception Entertainment Ideas',
    excerpt:
      'Make your reception unforgettable with these creative entertainment options and activities.',
    image: blog1,
    author: 'James Wilson',
    date: 'February 15, 2026',
    category: 'Wedding Planning',
    readTime: '6 min read',
    likes: 95,
    comments: 21,
  },
];

export default function Blogs() {
  return (
    <div className='bg-white min-h-screen animate-page-in'>
      {/* Hero Section */}
      <section className='py-24 px-8 bg-brand-dark text-white relative overflow-hidden animate-fade-in-up'>
        <div
          className='absolute inset-0 opacity-20 bg-cover bg-center'
          style={{ backgroundImage: `url(${ctaBg})` }}
        />
        <div className='absolute inset-0 bg-linear-to-b from-brand-dark via-brand-dark/90 to-brand-dark' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-brand-blue/10 via-transparent to-transparent' />

        <div className='max-w-7xl mx-auto relative z-10'>
          <div className='text-center'>
            <h3 className='text-brand-blue font-bold tracking-widest text-2xl uppercase mb-4'>
              Our Blog
            </h3>
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-black uppercase leading-tight mb-6 animate-fade-in-up delay-100'>
              Wedding <span className='text-brand-blue'>Inspiration</span>
            </h1>
            <p className='text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200'>
              Expert advice, real wedding stories, and inspiration for your
              special day.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className='py-16 px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid lg:grid-cols-3 gap-12'>
            {/* Main Blog Posts */}
            <div className='lg:col-span-2'>
              <div className='flex items-center justify-between mb-8 animate-fade-in-left'>
                <h2 className='text-3xl font-bold text-[#212121]'>
                  Recent Posts
                </h2>
                <Link
                  to='/event'
                  className='text-brand-blue hover:text-blue-700 font-semibold flex items-center gap-2 hover:gap-3 transition-all'
                >
                  View All Posts{' '}
                  <ArrowRight className='h-5 w-5 group-hover:rotate-45 transition-transform duration-300' />
                </Link>
              </div>

              <div className='space-y-12'>
                {recentPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className='group animate-fade-in-up'
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className='flex flex-col md:flex-row gap-8'>
                      <div className='w-full md:w-1/3 overflow-hidden rounded-2xl hover:shadow-3d hover:scale-[1.02] transition-all duration-500'>
                        <div
                          className='absolute inset-0 bg-linear-to-tr from-brand-blue/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'
                          style={{ zIndex: 10 }}
                        />
                        <img
                          src={post.image}
                          alt={post.title}
                          className='w-full h-full object-cover transform group-hover:rotate-y-3 transition-transform duration-700'
                          style={{ transformStyle: 'preserve-3d' }}
                        />
                      </div>
                      <div className='flex-1 flex flex-col justify-center'>
                        <div className='flex items-center gap-4 mb-3'>
                          <span className='text-brand-blue font-bold text-sm uppercase tracking-wider'>
                            {post.category}
                          </span>
                          <span className='text-gray-400 text-sm'>•</span>
                          <span className='text-gray-500 text-sm flex items-center gap-1'>
                            <Calendar className='h-4 w-4' />
                            {post.date}
                          </span>
                        </div>
                        <h3 className='text-2xl md:text-3xl font-bold text-[#212121] mb-4 group-hover:text-brand-blue transition-colors'>
                          {post.title}
                        </h3>
                        <p className='text-gray-600 text-lg leading-relaxed mb-4'>
                          {post.excerpt}
                        </p>
                        <div className='flex items-center gap-6 text-sm text-gray-500 mb-4'>
                          <span className='flex items-center gap-1 hover:scale-110 transition-transform'>
                            <Heart className='h-4 w-4' />
                            {post.likes} Likes
                          </span>
                          <span className='flex items-center gap-1 hover:scale-110 transition-transform'>
                            <MessageCircle className='h-4 w-4' />
                            {post.comments} Comments
                          </span>
                          <span className='flex items-center gap-1 hover:scale-110 transition-transform'>
                            <Share2 className='h-4 w-4' />
                            Share
                          </span>
                        </div>
                        <Link
                          to='/event'
                          className='text-brand-blue font-semibold flex items-center gap-2 hover:gap-3 transition-all'
                        >
                          Read More{' '}
                          <ArrowRight className='h-4 w-4 group-hover:rotate-45 transition-transform duration-300' />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              <div className='mt-12 flex justify-center gap-2 animate-fade-in-up'>
                <button className='w-10 h-10 rounded-full bg-brand-blue text-white font-semibold hover:bg-blue-700 hover:scale-110 hover:shadow-lg transition-all'>
                  1
                </button>
                <button className='w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 hover:scale-110 transition-all'>
                  2
                </button>
                <button className='w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 hover:scale-110 transition-all'>
                  3
                </button>
                <button className='w-10 h-10 rounded-full bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 hover:scale-110 transition-all'>
                  Next
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className='space-y-12'>
              {/* Search */}
              <div className='bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all animate-fade-in-right'>
                <h3 className='text-xl font-bold text-[#212121] mb-4'>
                  Search
                </h3>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Search articles...'
                    className='w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:scale-105 transition-all'
                  />
                  <div className='absolute right-3 top-3 text-gray-400'>
                    <svg
                      className='h-5 w-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className='bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all animate-fade-in-right'>
                <h3 className='text-xl font-bold text-[#212121] mb-6'>
                  Categories
                </h3>
                <ul className='space-y-3'>
                  {blogCategories.map((category, index) => (
                    <li
                      key={index}
                      className='flex items-center justify-between group cursor-pointer'
                    >
                      <span className='text-gray-700 group-hover:text-brand-blue transition-colors'>
                        {category.name}
                      </span>
                      <span className='text-gray-400 text-sm bg-gray-200 px-2 py-1 rounded-full group-hover:bg-brand-blue group-hover:text-white group-hover:scale-110 transition-all'>
                        {category.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Posts */}
              <div className='bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-all animate-fade-in-right'>
                <h3 className='text-xl font-bold text-[#212121] mb-6'>
                  Recent Posts
                </h3>
                <div className='space-y-6'>
                  {recentPosts.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      className='flex gap-4 group cursor-pointer hover:-translate-y-1 transition-all duration-300'
                    >
                      <div className='w-20 h-20 shrink-0 overflow-hidden rounded-lg'>
                        <img
                          src={post.image}
                          alt={post.title}
                          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3'
                        />
                      </div>
                      <div>
                        <h4 className='font-semibold text-[#212121] group-hover:text-brand-blue transition-colors line-clamp-2'>
                          {post.title}
                        </h4>
                        <p className='text-xs text-gray-500 mt-1'>
                          {post.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className='bg-brand-blue p-8 rounded-2xl text-white text-center hover:shadow-3d transition-all animate-fade-in-up'>
                <h3 className='text-2xl font-bold mb-4'>
                  Subscribe to Our Blog
                </h3>
                <p className='text-white/90 mb-6'>
                  Get the latest wedding planning tips and inspiration delivered
                  to your inbox.
                </p>
                <input
                  type='email'
                  placeholder='Your email address'
                  className='w-full px-4 py-3 rounded-xl mb-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50 focus:scale-105 transition-all'
                />
                <button className='w-full bg-[#212121] hover:bg-black text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg'>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-24 px-8 bg-brand-dark text-white relative overflow-hidden animate-fade-in-up'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-brand-blue/10 via-transparent to-transparent' />
        <div className='max-w-7xl mx-auto text-center relative z-10'>
          <h2 className='text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-tight mb-6'>
            Share Your Wedding Story
          </h2>
          <p className='text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto'>
            Having a beautiful wedding story to share? We'd love to feature your
            special day!
          </p>
          <Link
            to='/contact'
            className='bg-brand-blue hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold transition-all hover:shadow-xl hover:-translate-y-1 inline-block'
          >
            Submit Your Story
          </Link>
        </div>
      </section>
    </div>
  );
}
