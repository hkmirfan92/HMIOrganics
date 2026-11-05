import React, { useState } from 'react';
import { CustomerReview, INITIAL_TESTIMONIALS } from '../data/testimonialsData';
import { Star, ShieldCheck, CheckCircle2, MessageSquarePlus, X, Heart, ThumbsUp } from 'lucide-react';

interface TestimonialsSectionProps {
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ className = '' }) => {
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('hmi_organics_customer_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_TESTIMONIALS;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'personal-care' | 'home-care'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [cityName, setCityName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('Herbal Hair Growth & Scalp Oil');
  const [selectedCategory, setSelectedCategory] = useState<'personal-care' | 'home-care'>('personal-care');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>({});

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === 'all') return true;
    return r.category === activeTab;
  });

  const handleHelpfulClick = (id: string) => {
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewText.trim()) return;

    const newReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: authorName.trim(),
      city: cityName.trim() || 'Pakistan',
      productName: selectedProduct,
      category: selectedCategory,
      rating: userRating,
      reviewTitle: reviewTitle.trim() || 'Verified Customer Review',
      reviewText: reviewText.trim(),
      verified: true,
      date: 'Just now',
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem('hmi_organics_customer_reviews', JSON.stringify(updated));
    } catch {}

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsModalOpen(false);
      // Reset form
      setAuthorName('');
      setCityName('');
      setReviewTitle('');
      setReviewText('');
      setUserRating(5);
    }, 1800);
  };

  return (
    <section className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 ${className}`} aria-labelledby="testimonials-heading">
      
      {/* 1. Header & Overall Score Summary */}
      <div className="bg-[#FAFDFB] rounded-3xl border border-[#DFECE2] p-8 sm:p-10 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E7EFE9]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
              <ShieldCheck className="w-4 h-4 text-[#2C5E43]" />
              <span>Real Customer Feedback</span>
            </div>
            <h2 id="testimonials-heading" className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#112F1C] tracking-tight">
              Trusted by Pakistani Households
            </h2>
            <p className="text-sm text-[#4A6A54] max-w-2xl">
              Authentic reviews from families who switched to HMI Organics natural herbal formulations for their home, hair, and body.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Aggregate Score Pill */}
            <div className="bg-white p-3.5 px-5 rounded-2xl border border-[#DFECE2] shadow-xs flex items-center gap-4">
              <div className="text-left">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-sm font-bold text-slate-800 font-mono tabular-nums">4.9 / 5.0</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Over <span className="font-semibold text-slate-700 tabular-nums">350+</span> verified customer ratings
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 bg-[#1B4D2E] hover:bg-[#153D24] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Proof Points Strip (Unboxed Clean Typography) */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#3E5C47]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2C5E43] shrink-0" />
            <span>100% Genuine Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2C5E43] shrink-0" />
            <span>98.4% Repeat Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2C5E43] shrink-0" />
            <span>Chemical & Acid Free</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2C5E43] shrink-0" />
            <span>Nationwide COD Delivery</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Category Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-[#EEF4F0] rounded-xl border border-[#DFE8E2]">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-white text-[#163824] shadow-xs'
                : 'text-[#4F6C58] hover:text-[#163824]'
            }`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setActiveTab('personal-care')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'personal-care'
                ? 'bg-white text-[#163824] shadow-xs'
                : 'text-[#4F6C58] hover:text-[#163824]'
            }`}
          >
            Personal Care ({reviews.filter((r) => r.category === 'personal-care').length})
          </button>
          <button
            onClick={() => setActiveTab('home-care')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'home-care'
                ? 'bg-white text-[#163824] shadow-xs'
                : 'text-[#4F6C58] hover:text-[#163824]'
            }`}
          >
            Home & Car Care ({reviews.filter((r) => r.category === 'home-care').length})
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-800 tabular-nums">{filteredReviews.length}</span> reviews
        </div>
      </div>

      {/* 3. Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((review) => (
          <article
            key={review.id}
            className="bg-white p-6 rounded-2xl border border-[#E3ECE5] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Star Rating and Product Indicator */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-0.5 text-amber-400" aria-label={`${review.rating} out of 5 stars`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-xs font-bold text-slate-700 tabular-nums">
                    {review.rating}.0
                  </span>
                </div>
                
                <span className="text-[11px] font-medium text-[#2C5E43] text-right truncate max-w-[160px]">
                  {review.productName}
                </span>
              </div>

              {/* Title & Testimonial Prose */}
              <div>
                <h3 className="font-bold text-sm text-[#143721] leading-snug">
                  "{review.reviewTitle}"
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-4">
                  {review.reviewText}
                </p>
              </div>
            </div>

            {/* Author Metadata (Zero-Pill Discipline) */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div>
                <div className="font-bold text-[#143721] flex items-center gap-1.5">
                  <span>{review.author}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-[#2C5E43] font-semibold" title="Verified Order">
                      <CheckCircle2 className="w-3 h-3 text-[#2C5E43]" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  <span>{review.city}</span>
                  <span className="mx-1" aria-hidden="true">·</span>
                  <span>{review.date}</span>
                </div>
              </div>

              {/* Helpful vote button */}
              <button
                onClick={() => handleHelpfulClick(review.id)}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-[#2C5E43] transition-colors p-1 rounded-md cursor-pointer"
                title="Mark this review as helpful"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="tabular-nums">{(helpfulCounts[review.id] || 0) > 0 ? helpfulCounts[review.id] : 'Helpful'}</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* 4. Write a Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#DFE7E1] relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              aria-label="Close review modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2C5E43]">
                Share Your Experience
              </span>
              <h3 className="font-display text-xl font-extrabold text-[#112F1C]">
                Write a Customer Review
              </h3>
              <p className="text-xs text-slate-500">
                Help other families choose pure, natural, and trusted formulations for their home and body.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-[#112F1C]">Shukriya! Review Published</h4>
                <p className="text-xs text-slate-600">
                  Aapka review website par live shamil kar diya gaya hai.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                {/* Rating selection */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= userRating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-700 ml-2">
                      {userRating === 5 ? '5.0 — Excellent' : `${userRating}.0 Stars`}
                    </span>
                  </div>
                </div>

                {/* Product Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        const cat = e.target.value as 'personal-care' | 'home-care';
                        setSelectedCategory(cat);
                        setSelectedProduct(
                          cat === 'personal-care'
                            ? 'Herbal Hair Growth & Scalp Oil'
                            : 'Heavy Kitchen Degreaser Spray'
                        );
                      }}
                      className="w-full text-xs px-3 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                    >
                      <option value="personal-care">Personal Care</option>
                      <option value="home-care">Home & Car Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Product Name
                    </label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                    >
                      {selectedCategory === 'personal-care' ? (
                        <>
                          <option value="Herbal Hair Growth & Scalp Oil">Herbal Hair Growth & Scalp Oil</option>
                          <option value="Natural Herbal Tooth Powder">Natural Herbal Tooth Powder</option>
                          <option value="Restorative Herbal Hair Shampoo">Restorative Herbal Hair Shampoo</option>
                          <option value="Wild Rose & Sandal Herbal Soap">Wild Rose & Sandal Herbal Soap</option>
                        </>
                      ) : (
                        <>
                          <option value="Heavy Kitchen Degreaser Spray">Heavy Kitchen Degreaser Spray</option>
                          <option value="Bio-Enzyme Sparkling Dishwash Gel">Bio-Enzyme Sparkling Dishwash Gel</option>
                          <option value="Concentrated pH-Neutral Car Wash Shampoo">Concentrated Car Wash Shampoo</option>
                          <option value="Streak-Free Organic Glass & Mirror Cleaner">Glass & Mirror Cleaner</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sana Farooq"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. DHA Phase 5, Lahore"
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                    />
                  </div>
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Review Headline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Solved my hair fall in 3 weeks!"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                  />
                </div>

                {/* Review Text */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Detailed Review *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share how the product performed, fragrance, results, and delivery experience..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 bg-[#FAFDFB] border border-[#CCDCD0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C5E43]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#1B4D2E] hover:bg-[#153D24] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </section>
  );
};
