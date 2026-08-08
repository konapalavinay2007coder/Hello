export const careerPaths = [
  {
    id: 'software',
    title: 'Software & Web Engineering',
    category: 'tech',
    avgSalary: '₹6.5 LPA',
    growth: 'High (+24% YoY)',
    story: 'Ramesh from Nagaur studied basic Python online, cleared CET, and got placed as a Full-Stack developer in Pune.',
    skillsNeeded: ['Python', 'HTML/CSS/JS', 'SQL Database'],
    topColleges: ['COEP Pune', 'PICT Pune', 'VIT Pune']
  },
  {
    id: 'bsc_agri',
    title: 'B.Sc Agriculture & Agribusiness',
    category: 'agri',
    avgSalary: '₹4.8 LPA',
    growth: 'Very High (Government push)',
    story: 'Geeta from Jaipur completed B.Sc Agri and became a certified Soil Health Officer with KVK.',
    skillsNeeded: ['Soil Science', 'Crop Pathology', 'Organic Farming'],
    topColleges: ['MPKV Rahuri', 'SKN Agriculture University Jobner', 'College of Agriculture Pune']
  },
  {
    id: 'iti_electrician',
    title: 'ITI Electrical & Industrial Technician',
    category: 'vocational',
    avgSalary: '₹3.6 LPA',
    growth: 'Steady',
    story: 'Suresh from Nashik completed 2-year ITI and works with MSEDCL Power distribution.',
    skillsNeeded: ['Transformer Wiring', 'Solar Panel Maintenance', 'Circuit Safety'],
    topColleges: ['Government ITI Aundh Pune', 'Government ITI Nagaur']
  }
];

export const scholarships = [
  {
    id: 'shahu_maharaj',
    name: 'Rajarshi Chhatrapati Shahu Maharaj Fee Concession',
    amount: '50% Tuition Fee Waiver (up to ₹50,000/yr)',
    deadline: '15 September 2026',
    category: 'ebc',
    eligibilityText: 'EBC / General category students, annual family income < ₹8,00,000',
    helpline: '022-49150800',
    link: 'https://mahadbt.maharashtra.gov.in'
  },
  {
    id: 'post_matric_sc',
    name: 'Government Post-Matric Scholarship (SC/ST)',
    amount: '100% Tuition & Maintenance Allowance',
    deadline: '30 October 2026',
    category: 'sc_st',
    eligibilityText: 'SC/ST category students, family income < ₹2,50,000',
    helpline: '1800-102-8000',
    link: 'https://scholarships.gov.in'
  },
  {
    id: 'pm_vidyalaxmi',
    name: 'PM Vidyalaxmi Higher Education Education Loan Scheme',
    amount: 'Collateral-Free Loan up to ₹7,50,000 @ 3% Subsidized Interest',
    deadline: 'Open All Year',
    category: 'general',
    eligibilityText: 'All students admitted to recognized Degree/Diploma programs in India',
    helpline: '1800-180-5522',
    link: 'https://vidyalakshmi.co.in'
  },
  {
    id: 'nsp_minority',
    name: 'Merit-cum-Means Scholarship for Minority Students',
    amount: '₹20,000 per year + Course fee waiver',
    deadline: '20 September 2026',
    category: 'minority',
    eligibilityText: 'Minority students scoring > 50% in Class 12, income < ₹2.5L',
    helpline: '0120-6619540',
    link: 'https://scholarships.gov.in'
  }
];

export const colleges = [
  // PAGE 1: Top Engineering Institutes (Pune)
  {
    id: 'coep',
    name: 'College of Engineering Pune (COEP Technological University)',
    type: 'Government Autonomous',
    fees: '₹85,000 / year',
    concession: '₹42,500 via EBC',
    cutoff: '99.2 Percentile (MHT-CET)',
    placementRate: '96%',
    topRecruiters: 'TATA Motors, Bajaj, Microsoft, Infosys',
    location: 'Shivajinagar, Pune',
    hostel: 'Available'
  },
  {
    id: 'pict',
    name: 'Pune Institute of Computer Technology (PICT)',
    type: 'Private Autonomous',
    fees: '₹1,25,000 / year',
    concession: '₹62,500 via EBC',
    cutoff: '98.6 Percentile (MHT-CET)',
    placementRate: '94%',
    topRecruiters: 'PhonePe, Rakuten, TCS, Deutsche Bank',
    location: 'Dhankawadi, Pune',
    hostel: 'Available'
  },
  {
    id: 'vit_pune',
    name: 'Vishwakarma Institute of Technology (VIT Pune)',
    type: 'Private Autonomous',
    fees: '₹1,40,000 / year',
    concession: '₹70,000 via EBC',
    cutoff: '97.4 Percentile (MHT-CET)',
    placementRate: '91%',
    topRecruiters: 'Nvidia, Whirlpool, Cognizant, Wipro',
    location: 'Bibwewadi, Pune',
    hostel: 'Available'
  },
  {
    id: 'mit_wpu',
    name: 'MIT World Peace University (MIT-WPU)',
    type: 'Private University',
    fees: '₹3,10,000 / year',
    concession: 'Merit Scholarship up to 50%',
    cutoff: '92.5 Percentile (MHT-CET / JEE)',
    placementRate: '89%',
    topRecruiters: 'Amazon, Deloitte, IBM, Amdocs',
    location: 'Kothrud, Pune',
    hostel: 'Available'
  },
  {
    id: 'pccoe',
    name: 'Pimpri Chinchwad College of Engineering (PCCOE)',
    type: 'Private Autonomous',
    fees: '₹1,35,000 / year',
    concession: '₹67,500 via EBC',
    cutoff: '96.8 Percentile (MHT-CET)',
    placementRate: '92%',
    topRecruiters: 'Capgemini, Accenture, KPIT, Hyundai',
    location: 'Akurdi, Pimpri-Chinchwad Pune',
    hostel: 'Available'
  },
  {
    id: 'cummins',
    name: 'MKSSS Cummins College of Engineering for Women',
    type: 'Private Autonomous (Women)',
    fees: '₹1,45,000 / year',
    concession: '₹72,500 via EBC / Lila Poonawalla',
    cutoff: '95.5 Percentile (MHT-CET)',
    placementRate: '95%',
    topRecruiters: 'Cummins India, Google, Cisco, Eaton',
    location: 'Karvenagar, Pune',
    hostel: 'Available'
  },

  // PAGE 2: Top Engineering & Chemical Institutes (Mumbai & Regional)
  {
    id: 'vjti',
    name: 'Veermata Jijabai Technological Institute (VJTI Mumbai)',
    type: 'Government Autonomous',
    fees: '₹82,000 / year',
    concession: '₹41,000 via EBC',
    cutoff: '99.5 Percentile (MHT-CET)',
    placementRate: '98%',
    topRecruiters: 'Morgan Stanley, Texas Instruments, L&T',
    location: 'Matunga, Mumbai',
    hostel: 'Available'
  },
  {
    id: 'ict_mumbai',
    name: 'Institute of Chemical Technology (ICT Mumbai)',
    type: 'Deemed University (Govt)',
    fees: '₹95,000 / year',
    concession: 'Full Merit Cum Means Support',
    cutoff: '99.1 Percentile (MHT-CET / JEE)',
    placementRate: '95%',
    topRecruiters: 'Reliance, Asian Paints, Unilever, BPCL',
    location: 'Matunga, Mumbai',
    hostel: 'Available'
  },
  {
    id: 'spit',
    name: 'Sardar Patel Institute of Technology (SPIT)',
    type: 'Private Autonomous',
    fees: '₹1,70,000 / year',
    concession: '₹85,000 via EBC',
    cutoff: '98.9 Percentile (MHT-CET)',
    placementRate: '96%',
    topRecruiters: 'Goldman Sachs, Barclays, J.P. Morgan',
    location: 'Andheri West, Mumbai',
    hostel: 'Available'
  },
  {
    id: 'walchand',
    name: 'Walchand College of Engineering (WCE Sangli)',
    type: 'Government Aided Autonomous',
    fees: '₹87,000 / year',
    concession: '₹43,500 via EBC',
    cutoff: '96.2 Percentile (MHT-CET)',
    placementRate: '90%',
    topRecruiters: 'Atlas Copco, TATA Power, John Deere',
    location: 'Vishrambag, Sangli',
    hostel: 'Available'
  },
  {
    id: 'gce_karad',
    name: 'Government College of Engineering Karad',
    type: 'Government Autonomous',
    fees: '₹75,000 / year',
    concession: '₹37,500 via EBC',
    cutoff: '93.4 Percentile (MHT-CET)',
    placementRate: '86%',
    topRecruiters: 'TATA Elxsi, Kirloskar, Cognizant',
    location: 'Vidyanagar, Karad Satara',
    hostel: 'Available'
  },
  {
    id: 'gce_aurangabad',
    name: 'Government College of Engineering Chhatrapati Sambhajinagar',
    type: 'Government Autonomous',
    fees: '₹78,000 / year',
    concession: '₹39,000 via EBC',
    cutoff: '94.1 Percentile (MHT-CET)',
    placementRate: '87%',
    topRecruiters: 'Endress+Hauser, Siemens, Endurance',
    location: 'Station Road, Chhatrapati Sambhajinagar',
    hostel: 'Available'
  },

  // PAGE 3: Agriculture, Veterinary & Allied Sciences
  {
    id: 'agri_pune',
    name: 'College of Agriculture Pune (MPKV Rahuri)',
    type: 'Government University',
    fees: '₹38,000 / year',
    concession: 'Full Rajarshi Shahu Maharaj Waiver',
    cutoff: 'MHT-CET Agri PCB/PCM Rank < 2500',
    placementRate: '91%',
    topRecruiters: 'Mahyco, Syngenta, NABARD, Jain Irrigation',
    location: 'Shivajinagar, Pune',
    hostel: 'Available'
  },
  {
    id: 'skn_agri',
    name: 'SKN College of Agriculture Jobner',
    type: 'Government University',
    fees: '₹22,000 / year',
    concession: 'Full ST/SC Exemption',
    cutoff: 'JET Exam Rank < 1200',
    placementRate: '88%',
    topRecruiters: 'IFFCO, National Seeds Corp, NABARD',
    location: 'Jobner, Jaipur District',
    hostel: 'Available'
  },
  {
    id: 'pdkv_akola',
    name: 'Dr. Panjabrao Deshmukh Krishi Vidyapeeth (PDKV)',
    type: 'Government Agricultural University',
    fees: '₹32,000 / year',
    concession: 'Full ST/SC/EBC Scholarship',
    cutoff: 'MHT-CET Agri Percentile > 88%',
    placementRate: '86%',
    topRecruiters: 'Bayer CropScience, UPL, Godrej Agrovet',
    location: 'Krishi Nagar, Akola',
    hostel: 'Available'
  },
  {
    id: 'vnmkv_parbhani',
    name: 'Vasantrao Naik Marathwada Krishi Vidyapeeth',
    type: 'Government Agricultural University',
    fees: '₹30,000 / year',
    concession: 'Full Fee Concession for Rural Farmers',
    cutoff: 'MHT-CET Agri Percentile > 86%',
    placementRate: '85%',
    topRecruiters: 'Nuziveedu Seeds, Coromandel, RCF',
    location: 'Basmath Road, Parbhani',
    hostel: 'Available'
  },
  {
    id: 'fisheries_ratnagiri',
    name: 'College of Fisheries Ratnagiri (DBSKKV Dapoli)',
    type: 'Government Fishery Science College',
    fees: '₹28,000 / year',
    concession: 'Full EBC Support',
    cutoff: 'MHT-CET PCB Percentile > 82%',
    placementRate: '89%',
    topRecruiters: 'MPEDA, Coastal Aquaculture, CP Aqua',
    location: 'Shirgaon, Ratnagiri',
    hostel: 'Available'
  },
  {
    id: 'dairy_udgir',
    name: 'College of Dairy Technology Udgir (MAFSU Nagpur)',
    type: 'Government Dairy Technology College',
    fees: '₹34,000 / year',
    concession: '50% EBC Concession',
    cutoff: 'MHT-CET PCM Percentile > 85%',
    placementRate: '93%',
    topRecruiters: 'Amul, Mahanand, Mother Dairy, Dynamix',
    location: 'Udgir, Latur District',
    hostel: 'Available'
  },

  // PAGE 4: Pharmacy, Polytechnic & Skill Development
  {
    id: 'pcp_pune',
    name: 'Poona College of Pharmacy (BVDU Pune)',
    type: 'Deemed University Autonomous',
    fees: '₹1,85,000 / year',
    concession: 'Merit Cum Means Waiver',
    cutoff: 'MHT-CET Pharmacy Percentile > 96%',
    placementRate: '94%',
    topRecruiters: 'Cipla, Lupin, Sun Pharma, Serum Institute',
    location: 'Erandwane, Pune',
    hostel: 'Available'
  },
  {
    id: 'bcp_mumbai',
    name: 'Bombay College of Pharmacy (BCP Mumbai)',
    type: 'Government Aided Autonomous',
    fees: '₹48,000 / year',
    concession: '₹24,000 via EBC',
    cutoff: 'MHT-CET Pharmacy Percentile > 98.2%',
    placementRate: '97%',
    topRecruiters: 'Dr. Reddy’s, Pfizer, Abbott, Novartis',
    location: 'Kalina, Santacruz Mumbai',
    hostel: 'Available'
  },
  {
    id: 'gp_pune',
    name: 'Government Polytechnic Pune (GP Pune)',
    type: 'Government Autonomous Polytechnic',
    fees: '₹7,800 / year',
    concession: 'Full SC/ST/TFWS Exemption',
    cutoff: '10th Board Marks > 88%',
    placementRate: '92%',
    topRecruiters: 'TATA Motors, Mahindra, Thermax',
    location: 'Ganeshkhind, Pune',
    hostel: 'Available'
  },
  {
    id: 'gp_mumbai',
    name: 'Government Polytechnic Mumbai',
    type: 'Government Autonomous Polytechnic',
    fees: '₹8,200 / year',
    concession: 'TFWS 100% Tuition Fee Waiver',
    cutoff: '10th Board Marks > 89%',
    placementRate: '90%',
    topRecruiters: 'L&T Construction, Godrej, Siemens',
    location: 'Bandra East, Mumbai',
    hostel: 'Available'
  },
  {
    id: 'gcp_karad',
    name: 'Government College of Pharmacy Karad',
    type: 'Government Institute',
    fees: '₹36,000 / year',
    concession: '₹18,000 via EBC',
    cutoff: 'MHT-CET Pharmacy Percentile > 94.5%',
    placementRate: '89%',
    topRecruiters: 'Alkem Labs, Glenmark, Macleods',
    location: 'Vidyanagar, Karad Satara',
    hostel: 'Available'
  },
  {
    id: 'sinhgad_pune',
    name: 'Sinhgad College of Engineering (SCOE Pune)',
    type: 'Private Autonomous',
    fees: '₹1,38,000 / year',
    concession: '₹69,000 via EBC',
    cutoff: '91.2 Percentile (MHT-CET)',
    placementRate: '88%',
    topRecruiters: 'Cognizant, Accenture, LTI, Persistent',
    location: 'Vadgaon Budruk, Pune',
    hostel: 'Available'
  },
  {
    id: 'gce_amravati',
    name: 'Government College of Engineering Amravati (GCOEA)',
    type: 'Government Autonomous',
    fees: '₹76,000 / year',
    concession: '₹38,000 via EBC',
    cutoff: '94.8 Percentile (MHT-CET)',
    placementRate: '87%',
    topRecruiters: 'TCS, Tech Mahindra, L&T Infotech',
    location: 'VMV Road, Amravati',
    hostel: 'Available'
  },
  {
    id: 'gce_jalgaon',
    name: 'Government College of Engineering Jalgaon',
    type: 'Government Autonomous',
    fees: '₹74,000 / year',
    concession: '₹37,000 via EBC',
    cutoff: '92.3 Percentile (MHT-CET)',
    placementRate: '84%',
    topRecruiters: 'Jain Irrigation, Wipro, Infosys',
    location: 'NH-6, Jalgaon',
    hostel: 'Available'
  },
  {
    id: 'dypatil_pune',
    name: 'D.Y. Patil College of Engineering Akurdi Pune',
    type: 'Private Autonomous',
    fees: '₹1,30,000 / year',
    concession: '₹65,000 via EBC',
    cutoff: '95.1 Percentile (MHT-CET)',
    placementRate: '90%',
    topRecruiters: 'Veritas, Hexaware, Capgemini',
    location: 'Akurdi, Pune',
    hostel: 'Available'
  }
];
