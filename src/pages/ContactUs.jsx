import React, { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle } from 'lucide-react';
import { useContact } from '@/hooks/useContact';
import { useContactInfo } from '@/hooks/useContactInfo';

const ContactUs = () => {
  const { loading: submitting, error: submitError, submitContact } = useContact();
  const { contactInfo, loading: infoLoading, fetchContactInfo } = useContactInfo();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchContactInfo();
  }, [fetchContactInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContact({
        fullName: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      // submitError is already set inside useContact
    }
  };

  // Map API fields -> the { icon, label, value, href } shape the UI expects
  const contactItems = useMemo(() => {
    if (!contactInfo) return [];
    return [
      {
        icon: Mail,
        label: 'Email',
        value: contactInfo.email,
        href: contactInfo.email ? `mailto:${contactInfo.email}` : null,
      },
      {
        icon: Phone,
        label: 'Phone',
        value: contactInfo.phone,
        href: contactInfo.phone ? `tel:${contactInfo.phone.replace(/[^\d+]/g, '')}` : null,
      },
      {
        icon: MapPin,
        label: 'Address',
        value: contactInfo.address,
        href: null,
      },
      {
        icon: Clock,
        label: 'Business Hours',
        value: contactInfo.businessHours,
        href: null,
      },
    ].filter((item) => Boolean(item.value));
  }, [contactInfo]);

  const hasCoords =
    contactInfo?.latitude != null &&
    contactInfo?.longitude != null &&
    !Number.isNaN(parseFloat(contactInfo.latitude)) &&
    !Number.isNaN(parseFloat(contactInfo.longitude));

  const mapsUrl = hasCoords
    ? contactInfo.mapUrl || `https://maps.google.com/?q=${contactInfo.latitude},${contactInfo.longitude}`
    : null;

  if (submitted) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Send size={32} />
          </div>
          <h2 className="text-3xl font-bold text-[#212121] mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-[#1877F2] text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-8 max-sm:px-6 pt-16 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-[#212121] tracking-tight">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl">
          Have questions about our events? Want to partner with us? 
          We'd love to hear from you.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-8 max-sm:px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-xl font-bold text-[#212121] mb-6">Send us a Message</h2>
            
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Failed to send message</p>
                  <p className="text-sm">{submitError}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#212121] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1877F2] focus:border-transparent outline-none transition-all bg-white disabled:opacity-50"
                  placeholder="Juan Dela Cruz"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#212121] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1877F2] focus:border-transparent outline-none transition-all bg-white disabled:opacity-50"
                  placeholder="juan@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-[#212121] mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1877F2] focus:border-transparent outline-none transition-all bg-white disabled:opacity-50"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="vendor">Vendor Partnership</option>
                  <option value="venue">Venue Booking</option>
                  <option value="ticket">Ticket Support</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-[#212121] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1877F2] focus:border-transparent outline-none transition-all resize-none bg-white disabled:opacity-50"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1877F2] text-white py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? 'Sending...' : <>Send Message <Send size={18} /></>}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-bold text-[#212121] mb-6">Get in Touch</h2>
            
            <div className="space-y-6 mb-10">
              {infoLoading ? (
                <p className="text-sm text-gray-400">Loading contact info...</p>
              ) : (
                contactItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#1877F2]/10 text-[#1877F2] rounded-xl flex items-center justify-center shrink-0">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#212121] text-sm uppercase tracking-wide mb-1">
                        {item.label}
                      </h3>
                      {item.href ? (
                        <a 
                          href={item.href}
                          className="text-gray-600 hover:text-[#1877F2] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-600">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Map */}
            {hasCoords ? (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block rounded-2xl overflow-hidden h-64 group"
              >
                <iframe
                  title="Event location map"
                  src={`https://maps.google.com/maps?q=${contactInfo.latitude},${contactInfo.longitude}&z=16&output=embed`}
                  className="w-full h-full border-0 pointer-events-none"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-end justify-end p-3">
                  <span className="bg-white text-[#1877F2] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Open in Google Maps
                  </span>
                </div>
              </a>
            ) : (
              <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-400">
                  <MapPin size={48} className="mx-auto mb-2" />
                  <p>Map location not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;