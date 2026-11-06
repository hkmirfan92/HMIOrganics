import React, { useState } from 'react';
import { BrandSettings, ContactPageContent } from '../types';
import { BRAND_INFO } from '../data/products';
import { DEFAULT_PAGES_CONTENT } from '../data/pagesContent';
import {
  MessageCircle,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Truck
} from 'lucide-react';

interface ContactPageProps {
  settings?: BrandSettings;
  content?: ContactPageContent;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, content }) => {
  const pageData = content || DEFAULT_PAGES_CONTENT.contact;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Product Order / Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);


  const activeWhatsApp = settings?.whatsAppUrl || BRAND_INFO.whatsAppUrl;
  const activePhone = settings?.phone || BRAND_INFO.phone;
  const activePhoneRaw = settings?.phoneRaw || BRAND_INFO.phoneRaw;
  const activeLandline = settings?.landline || BRAND_INFO.landline || '0213-5643937';
  const activeEmail = settings?.email || BRAND_INFO.email;
  const activeDelivery = settings?.deliveryNotice || BRAND_INFO.deliveryNotice;
  const activeAddress = settings?.address || BRAND_INFO.address || 'C 65/29, 2nd Floor, Street 2, Punjab Colony, Karachi.';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    // Send also to WhatsApp if user desires
    setSubmitted(true);
  };

  const handleSendToWhatsAppNow = () => {
    const text = `🌿 *HMI Organics Website Contact Form*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n📌 *Inquiry Topic:* ${subject}\n💬 *Message:* ${message}\n\nPlease respond with details. Thank you!`;
    const targetUrl = `https://wa.me/${activePhoneRaw}?text=${encodeURIComponent(text)}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const faqs = [
    {
      q: 'How do I place an order via WhatsApp?',
      a: 'Simply click any "Order via WhatsApp" button on a product card or use our floating WhatsApp icon. Send us your required products and delivery address, and our team will immediately verify stock and confirm payment/cash on delivery details.'
    },
    {
      q: 'Where do you deliver and what is the delivery timeline?',
      a: 'We deliver nationwide across Pakistan. Major cities like Karachi, Lahore, Islamabad, and Rawalpindi receive deliveries within 24 to 48 hours. Other cities and regions receive orders within 3 to 4 business days via registered courier.'
    },
    {
      q: 'Are your home cleaning products safe around babies and pets?',
      a: 'Yes, 100%! Unlike conventional cleaning solutions that use caustic soda, hydrochloric acid, or harsh black phenyle, our products are made from citrus bio-enzymes, pure pine oil, and plant glucosides. They leave no toxic residues.'
    },
    {
      q: 'Do you offer bulk, wholesale, or salon packages?',
      a: 'Yes, we provide bulk gallon refills for homes, car detailing shops, offices, and salons at special discounted rates. Inquire directly on WhatsApp (+92 305 2211093) with your volume requirement.'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#EEF5F0] to-[#FBFBFA] pt-12 pb-16 border-b border-[#E3ECE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F5433]">
              {pageData.headerBadge}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#112F1C] tracking-tight">
              {pageData.headerTitle}
            </h1>
            <p className="text-base text-[#3E5C48] leading-relaxed">
              {pageData.headerDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid: Form + Direct Contact Information */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Col 1: Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#DFE7E1] shadow-sm">
            <div className="mb-6 space-y-1">
              <h2 className="font-display font-bold text-2xl text-[#143721]">
                {pageData.formTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {pageData.formSubtitle}
              </p>
            </div>


            {submitted ? (
              <div className="py-10 text-center space-y-4 bg-[#F5FAF6] rounded-2xl border border-[#D5EADB] p-6">
                <div className="w-12 h-12 bg-[#2C5E43] text-white rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-[#163824]">Message Prepared!</h3>
                  <p className="text-xs text-[#4F705A] max-w-sm mx-auto">
                    Thank you, <strong>{name}</strong>. Would you like to transmit your message instantly to WhatsApp for the fastest reply?
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleSendToWhatsAppNow}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BC59] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Send to WhatsApp Now</span>
                  </button>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-3 py-2"
                  >
                    Reset Form
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ayesha Khan"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs px-3.5 py-3 bg-[#FBFDFB] border border-[#D2DED5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Phone / WhatsApp Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-3 bg-[#FBFDFB] border border-[#D2DED5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs px-3.5 py-3 bg-[#FBFDFB] border border-[#D2DED5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                  >
                    <option value="Product Order / Inquiry">Product Order / Delivery Inquiry</option>
                    <option value="Personal Care Consultation">Personal Care (Hair, Skin, Tooth Powder)</option>
                    <option value="Home & Car Care Inquiry">Home & Car Care Cleaners</option>
                    <option value="Bulk / Wholesale Pricing">Bulk / Wholesale / Commercial Supply</option>
                    <option value="Other Question">General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what product you are interested in, your city, or any specific requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs px-3.5 py-3 bg-[#FBFDFB] border border-[#D2DED5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-[11px] text-slate-400">
                    Your contact details are strictly kept private.
                  </p>
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#1B4D2E] hover:bg-[#153D24] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Col 2: Direct Contact Info & Highlights */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Callout Card */}
            <div className="bg-[#183925] text-white p-7 rounded-3xl space-y-4 shadow-lg border border-[#275338]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#98EAB0]">
                Fastest Response
              </span>
              <h3 className="font-display font-bold text-xl leading-snug">
                Connect Directly on WhatsApp
              </h3>
              <p className="text-xs text-[#C4DEC9] leading-relaxed">
                Skip waiting for an email. Speak directly with the HMI Organics dispatch and care team for immediate order confirmation.
              </p>
              
              <div className="pt-1">
                <a
                  href={activeWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp: {activePhone}</span>
                </a>
              </div>
            </div>

            {/* Direct Information List */}
            <div className="bg-white p-6 rounded-3xl border border-[#DFE7E1] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
                Contact Coordinates
              </h4>

              <div className="space-y-3.5 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#EEF5EF] text-[#2C5E43] rounded-lg shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Phone & WhatsApp</span>
                    <a href={`tel:${activePhoneRaw}`} className="hover:text-[#1B4D2E] text-slate-600">
                      {activePhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#EEF5EF] text-[#2C5E43] rounded-lg shrink-0 mt-0.5">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">PTCL Landline Helpline</span>
                    <a href={`tel:${activeLandline.replace(/[^0-9]/g, '')}`} className="hover:text-[#1B4D2E] text-slate-600">
                      {activeLandline}
                    </a>
                    <span className="text-[10px] text-slate-400 block">Karachi Office & Inquiries</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#EEF5EF] text-[#2C5E43] rounded-lg shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Email Inquiries</span>
                    <a href={`mailto:${activeEmail}`} className="hover:text-[#1B4D2E] text-slate-600 break-all">
                      {activeEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#EEF5EF] text-[#2C5E43] rounded-lg shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Office & Studio Address</span>
                    <span className="text-slate-700 leading-relaxed block font-medium">
                      {activeAddress}
                    </span>
                    <span className="text-[11px] text-[#2C5E43] font-semibold mt-0.5 block">
                      Punjab Colony, Karachi, Pakistan
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#EEF5EF] text-[#2C5E43] rounded-lg shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Delivery Coverage</span>
                    <span className="text-slate-600 leading-relaxed block">
                      {activeDelivery}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#EEF5EF] text-[#2C5E43] rounded-lg shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 block">Operating Hours</span>
                    <span className="text-slate-600 block">
                      {pageData.operatingHours || 'Monday to Saturday: 9:00 AM – 8:00 PM (PKT)'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      WhatsApp orders accepted 24/7
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
            Common Queries
          </span>
          <h2 className="font-display text-2xl font-bold text-[#143721]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {(pageData.faqs || faqs).map((faq, index) => {
            const isOpen = expandedFaq === index;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#DFE7E1] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-sm text-[#163824] hover:bg-slate-50 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#2C5E43] shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#2C5E43]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#FAFDFB]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
