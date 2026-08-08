export const communityPosts = [
  {
    id: 'post-1',
    authorName: 'Ramlal Choudhary',
    authorDistrict: 'Nagaur, Rajasthan',
    domain: 'agriculture',
    questionText: 'Which crop is best for Kharif season in Nagaur with limited canal water?',
    postedTime: '2 hours ago',
    upvotes: 18,
    answers: [
      {
        id: 'ans-101',
        authorName: 'KVK Agronomist Dr. Sharma',
        text: 'Moong (Green Gram - MH 421) or Bajra (HHB 67) are best for low rain in Nagaur. They mature in 65 days and require 40% less water than cotton.',
        upvotes: 14,
        isExpert: true
      },
      {
        id: 'ans-102',
        authorName: 'Suresh Patel (Farmer)',
        text: 'I grew Moong last year in Merta with just 2 irrigations and got 6 quintals per acre. Good market price at Merta APMC.',
        upvotes: 8,
        isExpert: false
      }
    ]
  },
  {
    id: 'post-2',
    authorName: 'Devendra Patil',
    authorDistrict: 'Pune, Maharashtra',
    domain: 'education',
    questionText: 'What is the best Engineering College in Pune under 95 MHT-CET percentile?',
    postedTime: '5 hours ago',
    upvotes: 24,
    answers: [
      {
        id: 'ans-201',
        authorName: 'Prof. Deshmukh (Education Counselor)',
        text: 'With 94-95 percentile, consider VIT Pune (Instrumentation/Chemical), AISSMS COE Pune (Computer/IT), or MIT Academy of Engineering Alandi. Apply for Shahu Maharaj EBC concession for 50% fee waiver.',
        upvotes: 19,
        isExpert: true
      }
    ]
  },
  {
    id: 'post-3',
    authorName: 'Meena Devi',
    authorDistrict: 'Jaipur, Rajasthan',
    domain: 'schemes',
    questionText: 'Has the 17th installment of PM-KISAN (₹2,000) been credited to Rajasthan bank accounts?',
    postedTime: '1 day ago',
    upvotes: 31,
    answers: [
      {
        id: 'ans-301',
        authorName: 'CSC Digital Seva Kendra Operator',
        text: 'Yes! The 17th installment was released via Direct Benefit Transfer (DBT). Make sure your Aadhaar is seeded with your bank account and e-KYC is completed on pmkisan.gov.in.',
        upvotes: 27,
        isExpert: true
      }
    ]
  }
];
