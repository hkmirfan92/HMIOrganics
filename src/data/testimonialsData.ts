export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  productName: string;
  category: 'personal-care' | 'home-care';
  rating: number;
  reviewTitle: string;
  reviewText: string;
  verified: boolean;
  date: string;
}

export const INITIAL_TESTIMONIALS: CustomerReview[] = [
  {
    id: 'rev-1',
    author: 'Sana Farooq',
    city: 'DHA Phase 6, Karachi',
    productName: 'Herbal Hair Growth & Scalp Oil',
    category: 'personal-care',
    rating: 5,
    reviewTitle: 'Significantly reduced post-partum hair fall',
    reviewText: 'This oil genuinely helped control my hair fall within 3 to 4 weeks of consistent use. The texture is non-sticky and smells naturally of amla, rosemary, and cold-pressed coconut oil without synthetic perfumes. Will definitely reorder!',
    verified: true,
    date: '3 days ago'
  },
  {
    id: 'rev-2',
    author: 'Tariq Mehmood',
    city: 'Gulberg III, Lahore',
    productName: 'Heavy Kitchen Degreaser Spray',
    category: 'home-care',
    rating: 5,
    reviewTitle: 'Stove & exhaust cleaned without choking fumes',
    reviewText: 'Most market degreasers have strong caustic acid fumes that make breathing hard. HMI Organics degreaser melted heavy oil crust on our kitchen chimney in 5 minutes with a pleasant citrus smell. Highly recommended for every Pakistani kitchen.',
    verified: true,
    date: '1 week ago'
  },
  {
    id: 'rev-3',
    author: 'Dr. Ayesha Siddiqui',
    city: 'Sector F-7/2, Islamabad',
    productName: 'Natural Herbal Tooth Powder',
    category: 'personal-care',
    rating: 5,
    reviewTitle: 'Healthy gums and long-lasting freshness',
    reviewText: 'As a healthcare enthusiast, I wanted to move away from fluoride and artificial color dyes. This tooth powder has authentic clove, babool, and rock salt. My sensitive gums feel noticeably firmer and mouth stays fresh all day.',
    verified: true,
    date: '2 weeks ago'
  },
  {
    id: 'rev-4',
    author: 'Usman Ali',
    city: 'Satellite Town, Rawalpindi',
    productName: 'Concentrated pH-Neutral Car Wash Shampoo',
    category: 'home-care',
    rating: 5,
    reviewTitle: 'Super slick foam that does not strip ceramic wax',
    reviewText: 'I wash my Civic myself every Sunday. This shampoo gives rich, clingy foam and rinses streak-free with zero water spots. The pH-neutral formula keeps the protective wax completely safe. 500ml lasts for months!',
    verified: true,
    date: '2 weeks ago'
  },
  {
    id: 'rev-5',
    author: 'Mariam Qureshi',
    city: 'Cantt, Multan',
    productName: 'Restorative Herbal Hair Shampoo',
    category: 'personal-care',
    rating: 5,
    reviewTitle: 'Leaves hair silky without sulfate dryness',
    reviewText: 'My scalp used to get dry and itchy with commercial supermarket shampoos. HMI restorative shampoo leaves my hair soft, bouncy, and hydrated. Also safe for my 8-year-old daughter.',
    verified: true,
    date: '3 weeks ago'
  },
  {
    id: 'rev-6',
    author: 'Kamran Raza',
    city: 'Model Town, Faisalabad',
    productName: 'Bio-Enzyme Sparkling Dishwash Gel',
    category: 'home-care',
    rating: 5,
    reviewTitle: 'Cuts through oily biryani plates effortlessly',
    reviewText: 'Just 1 teaspoon cleans an entire sink of greasy curry and biryani cookware. The best part is it is completely non-toxic and gentle on hands without causing peeling or allergic reactions.',
    verified: true,
    date: '1 month ago'
  }
];
