import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const contactInfo = [
  {
    icon: 'FaPhone',
    label: 'Phone/WhatsApp',
    value: '+91 XXXXXXXXXX',
    link: 'tel:+91XXXXXXXXXX',
  },
  {
    icon: 'FaEnvelope',
    label: 'Email',
    value: 'yourmail@email.com',
    link: 'mailto:yourmail@email.com',
  },
  {
    icon: 'FaMapMarkerAlt',
    label: 'Address',
    value: 'Your institute address here',
    link: null,
  },
  {
    icon: 'FaClock',
    label: 'Hours',
    value: 'Mon–Sat, 10:00 AM – 7:00 PM',
    link: null,
  },
];

const reviewsData = [
  {
    text: 'I learned Excel properly and now I can make reports easily.',
    author: 'Student',
    rating: 5,
  },
  {
    text: 'Best for beginners, teaching is simple and practical.',
    author: 'Student',
    rating: 5,
  },
  {
    text: 'I built my first website and portfolio in the course.',
    author: 'Student',
    rating: 5,
  },
];

const whyChooseUsData = [
  {
    icon: 'FaLaptopCode',
    title: 'Practical Learning',
    description: 'Work on real tasks and projects',
  },
  {
    icon: 'FaBriefcase',
    title: 'Career Support',
    description: 'CV/Resume + interview guidance',
  },
  {
    icon: 'FaClock',
    title: 'Flexible Timing',
    description: 'Weekday & weekend batches',
  },
  {
    icon: 'FaRupeeSign',
    title: 'Affordable Fees',
    description: 'Value-focused courses',
  },
  {
    icon: 'FaQuestionCircle',
    title: 'Doubt Clearing',
    description: 'Extra support when needed',
  },
];

const aboutFeaturesData = [
  {
    icon: 'FaUserFriends',
    text: 'Friendly trainers',
  },
  {
    icon: 'FaHandsHelping',
    text: 'Hands-on practice',
  },
  {
    icon: 'FaUsers',
    text: 'Small batches for better attention',
  },
  {
    icon: 'FaCertificate',
    text: 'Certificate after completion',
  },
];

const heroContent = [
  {
    key: 'hero_title_prefix',
    title: 'Learn Computer & Digital Skills — ',
    subtitle: '',
    section: 'hero_content'
  },
  {
    key: 'hero_title_suffix',
    title: 'Become Job Ready',
    subtitle: '',
    section: 'hero_content'
  },
  {
    key: 'hero_subtitle',
    title: '',
    subtitle: 'AY Digital Institute is a computer training center that helps students and professionals learn practical skills with projects, guidance, and career support.',
    section: 'hero_content'
  }
];

const aboutContent = [
  {
    key: 'about_description',
    title: '',
    subtitle: 'AY Digital Institute provides practical computer education for students, job seekers, and working professionals. We focus on step-by-step learning, real assignments, and personal support so you can confidently use skills in real life or at work.',
    section: 'about_content'
  },
  {
    key: 'nielit_title',
    title: 'NIELIT Certified Courses',
    subtitle: '',
    section: 'about_content'
  },
  {
    key: 'nielit_description',
    title: '',
    subtitle: 'We offer <strong>NIELIT (National Institute of Electronics & Information Technology)</strong> courses — a Government of India organisation under the Ministry of Electronics & Information Technology (MeitY). Our courses range from basic digital literacy (ACC, BCC, CCC) to advanced professional certifications (O/A/B/C Level) and short-term skill boost programs. All certifications are <strong>government-recognized and nationally valid</strong>, making them valuable for job applications and career advancement.',
    section: 'about_content'
  }
];

const coursesContent = [
  {
    key: 'courses_description',
    title: '',
    subtitle: 'Choose from basic to advanced courses — NIELIT certified courses (ACC, BCC, CCC, O/A/B/C Level), professional diplomas (DCA, ADCA), and modern skill courses (Python, AI, IoT, Digital Marketing). Perfect for beginners, job seekers, and professionals. All NIELIT certifications are government-recognized and nationally valid.',
    section: 'courses_content'
  }
];

const themeContent = [
  {
    key: 'primary_color',
    title: 'Primary Color',
    subtitle: '#0ea5e9',
    section: 'theme'
  },
  {
    key: 'brand_name',
    title: 'Brand Name',
    subtitle: 'AY Digital Institute',
    section: 'theme'
  },
  {
    key: 'brand_logo',
    title: 'Brand Logo URL',
    subtitle: '',
    section: 'theme'
  }
];

const heroHighlights = ['Practical Training', 'Beginner Friendly', 'Portfolio Projects'];

const heroStats = [
  { value: '1000+', label: 'Students Trained' },
  { value: '50+', label: 'Projects / Assignments' },
  { value: '✓', label: 'Weekday & Weekend Batches' },
];

const coursesData = [
  {
    title: 'ACC – Awareness in Computer Concepts',
    category: 'Basic & Foundational',
    icon: 'FaDesktop',
    topics: [
      'Introductory level computer awareness',
      'Basic concepts before CCC',
      'Foundation for computer literacy',
    ],
    duration: 'Short',
    level: 'Very Basic',
  },
  {
    title: 'BCC – Basic Computer Course',
    category: 'Basic & Foundational',
    icon: 'FaLaptop',
    topics: [
      'Windows, files, internet, email',
      'MS Office basics',
      'Typing practice & basic troubleshooting',
    ],
    duration: '~3 months',
    level: 'Beginner',
  },
  {
    title: 'CCC – Course on Computer Concepts',
    category: 'Basic & Foundational',
    icon: 'FaCertificate',
    topics: [
      'Computer fundamentals',
      'MS Office applications',
      'Internet & email basics',
      'Government recognized certificate',
    ],
    duration: '~3 months',
    level: 'Basic',
  },
  {
    title: 'CCC Plus – Course on Computer Concepts Plus',
    category: 'Basic & Foundational',
    icon: 'FaGraduationCap',
    topics: [
      'Extended CCC content',
      'Advanced computer concepts',
      'More comprehensive coverage',
    ],
    duration: 'Slightly longer',
    level: 'Intermediate',
  },
  {
    title: 'ECC – Expert Computer Course',
    category: 'Basic & Foundational',
    icon: 'FaGraduationCap',
    topics: [
      'More advanced than CCC/CCC Plus',
      'Deeper computer skills',
      'Expert-level concepts',
    ],
    duration: 'Slightly longer',
    level: 'Intermediate',
  },
  {
    title: "DOEACC 'O' Level (NIELIT O Level)",
    category: 'NIELIT Professional',
    icon: 'FaCode',
    topics: [
      'Foundation course in computer applications',
      'Programming fundamentals',
      'Database management',
      'Web design & development',
      'Government recognized certification',
    ],
    duration: '~1 year',
    level: 'Foundation (Diploma Equivalent)',
  },
  {
    title: 'DCA – Diploma in Computer Applications',
    category: 'Level-Up Courses',
    icon: 'FaFileExcel',
    topics: [
      'MS Office suite (Word, Excel, PowerPoint)',
      'Internet tools & applications',
      'Basic software skills',
      'Perfect for office jobs',
    ],
    duration: '6–12 months',
    level: 'Diploma',
  },
  {
    title: 'ADCA – Advanced Diploma in Computer Applications',
    category: 'Level-Up Courses',
    icon: 'FaGraduationCap',
    topics: [
      'Advanced MS Office skills',
      'Additional software applications',
      'Deeper understanding of computer systems',
      'More comprehensive than DCA',
    ],
    duration: '6–12 months',
    level: 'Advanced Diploma',
  },
  {
    title: 'Hardware & Networking',
    category: 'Other Certifications',
    icon: 'FaNetworkWired',
    topics: [
      'PC assembly & troubleshooting',
      'Network setup & configuration',
      'Hardware maintenance',
      'Basic networking concepts',
    ],
    duration: '3–6 months',
    level: 'Intermediate',
  },
  {
    title: 'Office Automation & Data Entry',
    category: 'Other Certifications',
    icon: 'FaFileExcel',
    topics: [
      'Focused Excel training',
      'Word & PowerPoint mastery',
      'Data entry techniques',
      'Office productivity skills',
    ],
    duration: '2–3 months',
    level: 'Beginner to Intermediate',
  },
  {
    title: 'Web Design / Web Development Basics',
    category: 'Other Certifications',
    icon: 'FaCode',
    topics: [
      'HTML & CSS fundamentals',
      'Website building from scratch',
      'Basic JavaScript',
      'Portfolio development',
    ],
    duration: '3–6 months',
    level: 'Beginner to Intermediate',
  },
  {
    title: 'Tally / Accounting Software',
    category: 'Other Certifications',
    icon: 'FaCalculator',
    topics: [
      'Billing & inventory management',
      'GST basics & filing',
      'Practical business entries',
      'Accounting fundamentals',
    ],
    duration: '2–4 months',
    level: 'Intermediate',
  },
  {
    title: 'Web Development (HTML, CSS, JavaScript, React)',
    category: 'Other Certifications',
    icon: 'FaCode',
    topics: [
      'Website building from scratch',
      'React projects & frameworks',
      'Portfolio + hosting',
      'Full-stack development basics',
    ],
    duration: '6–12 months',
    level: 'Advanced',
  },
  {
    title: 'Graphic Design',
    category: 'Other Certifications',
    icon: 'FaPalette',
    topics: [
      'Design principles & theory',
      'Photoshop & Illustrator basics',
      'Social media posts & flyers',
      'Brand identity design',
    ],
    duration: '3–6 months',
    level: 'Intermediate',
  },
  {
    title: 'Cybersecurity Basics',
    category: 'Other Certifications',
    icon: 'FaShieldAlt',
    topics: [
      'Online safety & privacy',
      'Password management',
      'Phishing awareness',
      'Basic networking security',
    ],
    duration: '2–3 months',
    level: 'Beginner to Intermediate',
  },
  {
    title: "DOEACC 'A' Level (NIELIT A Level)",
    category: 'NIELIT Professional',
    icon: 'FaGraduationCap',
    topics: [
      'Advanced Diploma in Computer Applications',
      'Next step after O Level',
      'Advanced programming & software development',
      'Higher professional certification',
      'Widely recognized by employers',
    ],
    duration: '~1 year',
    level: 'Advanced Diploma',
  },
  {
    title: "DOEACC 'B' Level (NIELIT B Level)",
    category: 'NIELIT Professional',
    icon: 'FaUniversity',
    topics: [
      'Higher professional certification',
      'Advanced software & IT topics',
      'Deep technical knowledge',
      'Professional IT expertise',
      'Industry-recognized certification',
    ],
    duration: '~1.5-2 years',
    level: 'Professional',
  },
  {
    title: "DOEACC 'C' Level (NIELIT C Level)",
    category: 'NIELIT Professional',
    icon: 'FaUniversity',
    topics: [
      'Highest level professional certification',
      'Expert-level IT knowledge',
      'Advanced software engineering',
      'Research & development focus',
      'Top-tier industry recognition',
    ],
    duration: '~2 years',
    level: 'Expert',
  },
  {
    title: 'Python Programming',
    category: 'NIELIT Short-Term',
    icon: 'FaTerminal',
    topics: [
      'Python fundamentals & syntax',
      'Data structures & algorithms',
      'Object-oriented programming',
      'Practical projects & applications',
    ],
    duration: '4–12 weeks',
    level: 'Intermediate',
  },
  {
    title: 'Artificial Intelligence Basics',
    category: 'NIELIT Short-Term',
    icon: 'FaCog',
    topics: [
      'AI fundamentals & concepts',
      'Machine learning basics',
      'Neural networks introduction',
      'Practical AI applications',
    ],
    duration: '6–12 weeks',
    level: 'Intermediate to Advanced',
  },
  {
    title: 'IoT (Internet of Things)',
    category: 'NIELIT Short-Term',
    icon: 'FaWifi',
    topics: [
      'IoT concepts & architecture',
      'Sensor integration',
      'Device connectivity',
      'Smart device development',
    ],
    duration: '6–12 weeks',
    level: 'Intermediate',
  },
  {
    title: 'Digital Marketing',
    category: 'NIELIT Short-Term',
    icon: 'FaBullhorn',
    topics: [
      'SEO & SEM fundamentals',
      'Social media marketing',
      'Content marketing strategies',
      'Analytics & campaign management',
    ],
    duration: '4–8 weeks',
    level: 'Beginner to Intermediate',
  },
];

const navbarItems = [
  { title: 'Home', link: 'home', order: 0 },
  { title: 'Courses', link: 'courses', order: 1 },
  { title: 'About', link: 'about', order: 2 },
  { title: 'Why Us', link: 'why-us', order: 3 },
  { title: 'Reviews', link: 'reviews', order: 4 },
  { title: 'Contact', link: 'contact', order: 5 },
];

const footerItems = [
  { title: 'Courses', link: 'courses', order: 0 },
  { title: 'About', link: 'about', order: 1 },
  { title: 'Why Us', link: 'why-us', order: 2 },
  { title: 'Contact', link: 'contact', order: 3 },
];

const main = async () => {
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);

  // Users
  const users = [
    { email: 'superadmin@aydigital.com', name: 'Super Admin', role: 'SUPER_ADMIN' },
    { email: 'admin@aydigital.com', name: 'Admin User', role: 'ADMIN' },
    { email: 'teacher@aydigital.com', name: 'Teacher User', role: 'TEACHER' },
    { email: 'instructor@aydigital.com', name: 'Instructor User', role: 'INSTRUCTOR' },
    { email: 'hod@aydigital.com', name: 'Head of Dept', role: 'HOD' },
    { email: 'dean@aydigital.com', name: 'Dean User', role: 'DEAN' },
    { email: 'user@aydigital.com', name: 'Standard User', role: 'USER' },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          role: user.role as any,
          provider: 'LOCAL',
          passwordHash: user.role.includes('ADMIN') ? adminPasswordHash : passwordHash,
        },
      });
      console.log(`Created ${user.role}: ${user.email}`);
    } else {
      console.log(`${user.role} already exists: ${user.email}`);
    }
  }

  // Seed Content Items
  console.log('Seeding content items...');

  // Contact Info
  for (const item of contactInfo) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: 'contact', title: item.label },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: 'contact',
          title: item.label,
          subtitle: item.value,
          icon: item.icon,
          link: item.link,
        },
      });
    }
  }

  // Why Choose Us
  for (const item of whyChooseUsData) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: 'why_choose_us', title: item.title },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: 'why_choose_us',
          title: item.title,
          subtitle: item.description,
          icon: item.icon,
        },
      });
    }
  }

  // About Features
  for (const item of aboutFeaturesData) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: 'about_features', title: item.text },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: 'about_features',
          title: item.text,
          icon: item.icon,
        },
      });
    }
  }

  // Hero Content
  for (const item of heroContent) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: item.section, key: item.key },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: item.section,
          key: item.key,
          title: item.title,
          subtitle: item.subtitle,
        },
      });
    }
  }

  // About Content
  for (const item of aboutContent) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: item.section, key: item.key },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: item.section,
          key: item.key,
          title: item.title,
          subtitle: item.subtitle,
        },
      });
    }
  }

  // Courses Content
  for (const item of coursesContent) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: item.section, key: item.key },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: item.section,
          key: item.key,
          title: item.title,
          subtitle: item.subtitle,
        },
      });
    }
  }

  // Theme Content
  for (const item of themeContent) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: item.section, key: item.key },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: item.section,
          key: item.key,
          title: item.title,
          subtitle: item.subtitle,
        },
      });
    }
  }

  // Hero Highlights
  for (const item of heroHighlights) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: 'hero_highlights', title: item },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: 'hero_highlights',
          title: item,
        },
      });
    }
  }

  // Hero Stats
  for (const item of heroStats) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: 'hero_stats', title: item.label },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: 'hero_stats',
          title: item.label,
          subtitle: item.value,
        },
      });
    }
  }

  // Testimonials
  console.log('Seeding testimonials...');
  for (const item of reviewsData) {
    const exists = await prisma.testimonial.findFirst({
      where: { text: item.text },
    });
    if (!exists) {
      await prisma.testimonial.create({
        data: {
          text: item.text,
          author: item.author,
          rating: item.rating,
        },
      });
    }
  }

  // Courses
  console.log('Seeding courses...');
  for (const item of coursesData) {
    const exists = await prisma.course.findFirst({
      where: { title: item.title },
    });
    if (!exists) {
      await prisma.course.create({
        data: {
          title: item.title,
          category: item.category,
          icon: item.icon,
          topics: item.topics,
          duration: item.duration,
          level: item.level,
        },
      });
    }
  }

  // Lesson Plans
  console.log('Seeding lesson plans...');
  const teacherUser = await prisma.user.findUnique({
    where: { email: 'teacher@aydigital.com' },
  });

  if (teacherUser) {
    const lessonPlansData = [
      {
        title: 'Introduction to Computer Basics',
        description: 'A beginner-friendly guide to understanding computer hardware and software.',
        content: '# Computer Basics\n\n## What is a Computer?\nA computer is an electronic device...',
        subject: 'Computer Science',
        gradeLevel: 'Beginner',
      },
      {
        title: 'Microsoft Word Fundamentals',
        description: 'Learn how to create and format documents in MS Word.',
        content: '# MS Word Basics\n\n## Getting Started\nOpen MS Word and select a blank document...',
        subject: 'Office Productivity',
        gradeLevel: 'Intermediate',
      },
      {
        title: 'Web Development 101',
        description: 'Introduction to HTML, CSS, and how the web works.',
        content: '# Web Development\n\n## HTML\nHTML stands for HyperText Markup Language...',
        subject: 'Web Development',
        gradeLevel: 'Advanced',
      },
    ];

    for (const plan of lessonPlansData) {
      const exists = await prisma.lessonPlan.findFirst({
        where: { title: plan.title, authorId: teacherUser.id },
      });

      if (!exists) {
        await prisma.lessonPlan.create({
          data: {
            title: plan.title,
            description: plan.description,
            content: plan.content,
            subject: plan.subject,
            gradeLevel: plan.gradeLevel,
            authorId: teacherUser.id,
          },
        });
      }
    }
  }

  // Navbar Items
  console.log('Seeding navbar items...');
  for (const item of navbarItems) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: 'navbar', title: item.title },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: 'navbar',
          title: item.title,
          link: item.link,
          order: item.order,
        },
      });
    }
  }

  // Footer Items
  console.log('Seeding footer items...');
  for (const item of footerItems) {
    const exists = await prisma.contentItem.findFirst({
      where: { section: 'footer', title: item.title },
    });
    if (!exists) {
      await prisma.contentItem.create({
        data: {
          section: 'footer',
          title: item.title,
          link: item.link,
          order: item.order,
        },
      });
    }
  }

  console.log('Seeding completed.');
};

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
