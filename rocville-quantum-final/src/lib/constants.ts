export const COLORS = {
  primary: '#1E3A8A', // Deep Blue
  secondary: '#10B981', // Emerald Green
  accent: '#F59E0B', // Amber
  neutralDark: '#1F2937', // Slate Gray
  neutralLight: '#F9FAFB', // Off White
  error: '#EF4444', // Red
  success: '#10B981', // Green
  warning: '#F59E0B', // Amber
};

export const FONTS = {
  heading: '"Montserrat", sans-serif',
  body: '"Inter", sans-serif',
  accent: '"Playfair Display", serif',
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px',
};

export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  pill: '9999px',
};

export const SHADOWS = {
  subtle: '0 1px 2px rgba(0, 0, 0, 0.05)',
  medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};

export const BREAKPOINTS = {
  mobile: '0px',
  tablet: '640px',
  desktop: '1024px',
  largeDesktop: '1280px',
};

export const COMPANY = {
  name: 'RocVille Media House',
  tagline: 'Crafting Digital Experiences That Inspire',
  description: 'We are a full-service digital agency specializing in web development, branding, and digital marketing solutions that drive results.',
  foundedYear: 2015,
  location: 'New York, NY',
  email: 'contact@rocvillemedia.com',
  phone: '+1 (555) 123-4567',
  address: '123 Creative Avenue, Suite 500, New York, NY 10001',
  socialMedia: {
    twitter: 'https://twitter.com/rocvillemedia',
    facebook: 'https://facebook.com/rocvillemedia',
    instagram: 'https://instagram.com/rocvillemedia',
    linkedin: 'https://linkedin.com/company/rocvillemedia',
    github: 'https://github.com/rocvillemedia',
  },
};

export const SERVICES = [
  {
    id: 'web-development',
    title: 'Web Development',
    shortDescription: 'Custom websites and web applications built with modern technologies.',
    icon: 'Code',
    features: [
      'Responsive Design',
      'E-commerce Solutions',
      'Content Management Systems',
      'Progressive Web Apps',
      'API Development & Integration',
    ],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    shortDescription: 'Strategic marketing campaigns that drive traffic and conversions.',
    icon: 'BarChart',
    features: [
      'Search Engine Optimization',
      'Pay-Per-Click Advertising',
      'Social Media Marketing',
      'Email Marketing Campaigns',
      'Analytics & Reporting',
    ],
  },
  {
    id: 'branding',
    title: 'Branding & Identity',
    shortDescription: 'Distinctive brand identities that resonate with your audience.',
    icon: 'Palette',
    features: [
      'Logo Design',
      'Brand Strategy',
      'Visual Identity Systems',
      'Brand Guidelines',
      'Rebranding Services',
    ],
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    shortDescription: 'Engaging content that tells your story and connects with customers.',
    icon: 'FileText',
    features: [
      'Copywriting',
      'Blog Content',
      'Video Production',
      'Photography',
      'Infographics & Visual Content',
    ],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    shortDescription: 'Intuitive user experiences that delight and convert.',
    icon: 'Layout',
    features: [
      'User Research',
      'Wireframing & Prototyping',
      'Usability Testing',
      'Interface Design',
      'User Journey Mapping',
    ],
  },
  {
    id: 'app-development',
    title: 'App Development',
    shortDescription: 'Native and cross-platform mobile applications for iOS and Android.',
    icon: 'Smartphone',
    features: [
      'iOS Development',
      'Android Development',
      'Cross-Platform Solutions',
      'App Store Optimization',
      'Maintenance & Support',
    ],
  },
];

export const PORTFOLIO_ITEMS = [
  {
    id: 'eco-commerce',
    title: 'EcoShop E-Commerce Platform',
    category: 'web-development',
    client: 'EcoShop Inc.',
    description: 'A sustainable e-commerce platform with advanced filtering, wishlist functionality, and seamless checkout experience.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
    imageUrl: '/assets/portfolio/ecoshop.jpg',
    results: [
      '35% increase in conversion rate',
      '42% reduction in cart abandonment',
      '128% growth in mobile sales',
    ],
    featured: true,
  },
  {
    id: 'finance-dashboard',
    title: 'FinTrack Dashboard',
    category: 'ui-ux-design',
    client: 'FinTrack Solutions',
    description: 'An intuitive financial dashboard that visualizes complex data and provides actionable insights for investment decisions.',
    technologies: ['Figma', 'React', 'D3.js', 'TypeScript', 'Firebase'],
    imageUrl: '/assets/portfolio/fintrack.jpg',
    results: [
      'Reduced data analysis time by 65%',
      'Improved user satisfaction score from 3.2 to 4.8/5',
      'Decreased onboarding time by 40%',
    ],
    featured: true,
  },
  {
    id: 'health-app',
    title: 'VitalTrack Health App',
    category: 'app-development',
    client: 'VitalTrack Health',
    description: 'A comprehensive health tracking mobile application that integrates with wearable devices and provides personalized insights.',
    technologies: ['React Native', 'Firebase', 'HealthKit', 'Google Fit API', 'Node.js'],
    imageUrl: '/assets/portfolio/vitaltrack.jpg',
    results: [
      '100,000+ downloads in first month',
      '4.8/5 average rating on app stores',
      '78% daily active user retention',
    ],
    featured: true,
  },
  {
    id: 'restaurant-brand',
    title: 'Harvest Table Rebrand',
    category: 'branding',
    client: 'Harvest Table Restaurants',
    description: 'Complete rebranding for a farm-to-table restaurant chain, including logo, visual identity, menus, and website design.',
    technologies: ['Adobe Creative Suite', 'WordPress', 'Print Design', 'Photography Direction'],
    imageUrl: '/assets/portfolio/harvesttable.jpg',
    results: [
      '28% increase in new customer visits',
      '45% boost in social media engagement',
      'Featured in 3 major design publications',
    ],
    featured: false,
  },
  {
    id: 'tech-campaign',
    title: 'NexGen Product Launch',
    category: 'digital-marketing',
    client: 'NexGen Technologies',
    description: 'Integrated digital marketing campaign for a flagship product launch, including PPC, social media, and influencer partnerships.',
    technologies: ['Google Ads', 'Meta Ads Platform', 'HubSpot', 'Mailchimp', 'Google Analytics'],
    imageUrl: '/assets/portfolio/nexgen.jpg',
    results: [
      '320% ROI on marketing spend',
      '15,000+ pre-orders generated',
      '1.2M campaign impressions',
    ],
    featured: false,
  },
  {
    id: 'travel-content',
    title: 'Wanderlust Content Series',
    category: 'content-creation',
    client: 'Wanderlust Travel Co.',
    description: 'A multi-format content series showcasing exotic destinations through blog posts, videos, and social media content.',
    technologies: ['Adobe Premiere Pro', 'Content Strategy', 'SEO Optimization', 'Social Media Management'],
    imageUrl: '/assets/portfolio/wanderlust.jpg',
    results: [
      '215% increase in organic traffic',
      '18:42 average time spent with video content',
      '32% growth in booking conversions',
    ],
    featured: false,
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    position: 'CEO',
    company: 'EcoShop Inc.',
    quote: 'RocVille transformed our online presence with a stunning e-commerce platform that perfectly captures our brand essence while delivering exceptional results. Their attention to detail and strategic approach exceeded our expectations.',
    imageUrl: '/assets/testimonials/sarah-johnson.jpg',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    position: 'Marketing Director',
    company: 'FinTrack Solutions',
    quote: 'Working with RocVille on our dashboard redesign was a game-changer. They took the time to understand our complex data visualization needs and delivered an intuitive interface that our clients love. The results speak for themselves.',
    imageUrl: '/assets/testimonials/michael-chen.jpg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Elena Rodriguez',
    position: 'Founder',
    company: 'Wanderlust Travel Co.',
    quote: 'The content strategy and execution by RocVille completely revitalized our brand storytelling. Their team created compelling narratives that resonated with our audience and significantly increased our engagement metrics.',
    imageUrl: '/assets/testimonials/elena-rodriguez.jpg',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Thompson',
    position: 'CTO',
    company: 'VitalTrack Health',
    quote: "RocVille's app development expertise was instrumental in bringing our vision to life. They navigated complex technical challenges with ease and delivered a polished product that our users absolutely love.",
    imageUrl: '/assets/testimonials/david-thompson.jpg',
    rating: 5,
  },
];

export const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Alex Rivera',
    position: 'Founder & Creative Director',
    bio: 'With over 15 years of experience in digital design and branding, Alex leads our creative vision and ensures every project meets our high standards of excellence.',
    imageUrl: '/assets/team/alex-rivera.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexrivera',
      twitter: 'https://twitter.com/alexrivera',
    },
  },
  {
    id: 2,
    name: 'Jordan Taylor',
    position: 'Technical Director',
    bio: 'Jordan brings deep expertise in web and application development, with a passion for creating scalable, performant digital experiences using cutting-edge technologies.',
    imageUrl: '/assets/team/jordan-taylor.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jordantaylor',
      github: 'https://github.com/jordantaylor',
    },
  },
  {
    id: 3,
    name: 'Maya Patel',
    position: 'UX/UI Design Lead',
    bio: 'Maya combines user-centered design principles with a keen aesthetic sense to create interfaces that are both beautiful and highly functional.',
    imageUrl: '/assets/team/maya-patel.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/mayapatel',
      dribbble: 'https://dribbble.com/mayapatel',
    },
  },
  {
    id: 4,
    name: 'Liam Wilson',
    position: 'Digital Marketing Strategist',
    bio: 'Liam develops data-driven marketing strategies that help our clients reach their target audiences and achieve measurable business results.',
    imageUrl: '/assets/team/liam-wilson.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/liamwilson',
      twitter: 'https://twitter.com/liamwilson',
    },
  },
  {
    id: 5,
    name: 'Sophia Kim',
    position: 'Content Director',
    bio: 'Sophia crafts compelling narratives across various media formats, helping brands tell their stories in ways that engage and inspire their audiences.',
    imageUrl: '/assets/team/sophia-kim.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sophiakim',
      instagram: 'https://instagram.com/sophiakim',
    },
  },
  {
    id: 6,
    name: 'Marcus Johnson',
    position: 'Frontend Developer',
    bio: 'Marcus specializes in creating responsive, accessible, and performant user interfaces using modern frontend frameworks and best practices.',
    imageUrl: '/assets/team/marcus-johnson.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/marcusjohnson',
      github: 'https://github.com/marcusjohnson',
    },
  },
];

export const BLOG_POSTS = [
  {
    id: 'design-trends-2025',
    title: 'Web Design Trends to Watch in 2025',
    excerpt: 'Explore the cutting-edge design trends that will shape the digital landscape in the coming year, from immersive 3D experiences to sustainable design practices.',
    author: 'Maya Patel',
    date: '2025-05-15',
    category: 'Design',
    imageUrl: '/assets/blog/design-trends.jpg',
    featured: true,
  },
  {
    id: 'seo-strategies',
    title: "SEO Strategies That Actually Work in Today's Algorithm Landscape",
    excerpt: 'Cut through the noise with proven SEO techniques that align with the latest search engine algorithms and deliver sustainable organic traffic growth.',
    author: 'Liam Wilson',
    date: '2025-05-08',
    category: 'Digital Marketing',
    imageUrl: '/assets/blog/seo-strategies.jpg',
    featured: true,
  },
  {
    id: 'react-performance',
    title: 'Optimizing React Applications for Peak Performance',
    excerpt: 'Learn practical techniques to significantly improve the speed and responsiveness of your React applications, from code splitting to memoization.',
    author: 'Jordan Taylor',
    date: '2025-04-22',
    category: 'Development',
    imageUrl: '/assets/blog/react-performance.jpg',
    featured: false,
  },
  {
    id: 'brand-storytelling',
    title: 'The Art of Brand Storytelling in a Digital Age',
    excerpt: 'Discover how to craft authentic brand narratives that resonate with modern audiences across multiple digital touchpoints and platforms.',
    author: 'Sophia Kim',
    date: '2025-04-10',
    category: 'Branding',
    imageUrl: '/assets/blog/brand-storytelling.jpg',
    featured: false,
  },
  {
    id: 'accessibility-guide',
    title: 'A Comprehensive Guide to Web Accessibility',
    excerpt: 'Why accessibility matters and how to implement WCAG guidelines to create inclusive digital experiences that work for everyone.',
    author: 'Marcus Johnson',
    date: '2025-03-28',
    category: 'Development',
    imageUrl: '/assets/blog/accessibility-guide.jpg',
    featured: false,
  },
  {
    id: 'mobile-first-design',
    title: 'Mobile-First Design: Beyond the Basics',
    excerpt: 'Take your mobile design strategy to the next level with advanced techniques that prioritize the smartphone user experience without compromising desktop functionality.',
    author: 'Maya Patel',
    date: '2025-03-15',
    category: 'Design',
    imageUrl: '/assets/blog/mobile-first.jpg',
    featured: false,
  },
];
