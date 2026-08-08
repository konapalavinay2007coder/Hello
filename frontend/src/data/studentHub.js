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
  // PAGE 1: Top Maharashtra State & National Schemes
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
  },
  {
    id: 'panjabrao_hostel',
    name: 'Dr. Punjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna',
    amount: 'Hostel Maintenance Allowance ₹30,000/yr',
    deadline: '15 October 2026',
    category: 'ebc',
    eligibilityText: 'Children of registered small farmers / EBC admitted to professional courses',
    helpline: '022-49150800',
    link: 'https://mahadbt.maharashtra.gov.in'
  },
  {
    id: 'central_csss',
    name: 'Central Sector Scheme of Scholarships (CSSS)',
    amount: '₹12,000 to ₹20,000 per year',
    deadline: '31 October 2026',
    category: 'general',
    eligibilityText: 'Students above 80th percentile in 12th Board exams, family income < ₹4.5L',
    helpline: '0120-6619540',
    link: 'https://scholarships.gov.in'
  },

  // PAGE 2: Technical, Girl Child & Tribal Schemes
  {
    id: 'aicte_pragati',
    name: 'AICTE Pragati Scholarship for Girls in Technical Education',
    amount: '₹50,000 per year for course duration',
    deadline: '31 October 2026',
    category: 'general',
    eligibilityText: 'Female students admitted to 1st year Degree/Diploma engineering, income < ₹8L',
    helpline: '011-29581000',
    link: 'https://www.aicte-india.org'
  },
  {
    id: 'aicte_saksham',
    name: 'AICTE Saksham Scholarship for Differently-Abled',
    amount: '₹50,000 per year for technical degree/diploma',
    deadline: '31 October 2026',
    category: 'general',
    eligibilityText: 'Specially-abled students (> 40% disability) pursuing AICTE approved technical courses',
    helpline: '011-29581000',
    link: 'https://www.aicte-india.org'
  },
  {
    id: 'swayam_st',
    name: 'Pandit Deendayal Upadhyay Swayam Yojna (ST Tribal)',
    amount: 'Hostel & Food Allowance up to ₹60,000/yr',
    deadline: '15 November 2026',
    category: 'sc_st',
    eligibilityText: 'ST Category tribal students studying in non-governmental hostel facilities',
    helpline: '1800-267-0007',
    link: 'https://tribal.maharashtra.gov.in'
  },
  {
    id: 'obc_vjnt_tuition',
    name: 'Post-Matric Tuition & Exam Fee for OBC / VJNT / SBC',
    amount: '100% Tuition & Exam Fee Refund',
    deadline: '30 November 2026',
    category: 'sc_st',
    eligibilityText: 'OBC/VJNT/SBC category students admitted via CAP round, income < ₹1.5L',
    helpline: '022-49150800',
    link: 'https://mahadbt.maharashtra.gov.in'
  },
  {
    id: 'cm_fellowship',
    name: 'Chief Minister Fellowship Program Maharashtra',
    amount: '₹45,000 Monthly Stipend + ₹5,000 Travel',
    deadline: '15 July 2026',
    category: 'general',
    eligibilityText: 'Graduates aged 21-26 with > 60% marks and minimum 1 year work experience',
    helpline: '022-22025251',
    link: 'https://cmfellowship.maharashtra.gov.in'
  },
  {
    id: 'pmss_capf',
    name: 'Prime Minister’s Scholarship Scheme (PMSS CAPF)',
    amount: '₹3,000/mo for Girls, ₹2,500/mo for Boys',
    deadline: '30 November 2026',
    category: 'general',
    eligibilityText: 'Wards of deceased/ex-servicemen of Central Armed Police Forces & Assam Rifles',
    helpline: '011-24367800',
    link: 'https://warb-mha.gov.in'
  },

  // PAGE 3: Corporate Foundations & Merit Scholarships
  {
    id: 'lila_poonawalla',
    name: 'Lila Poonawalla Foundation Merit Scholarship for Girls',
    amount: 'Up to ₹1,00,000 per year for Engineering & Pharmacy',
    deadline: '31 August 2026',
    category: 'general',
    eligibilityText: 'Girls admitted to 1st year Engineering/Pharmacy in Pune, Wardha, Amravati, income < ₹3.5L',
    helpline: '020-27224265',
    link: 'https://www.lilapoonawallafoundation.com'
  },
  {
    id: 'tata_pankh',
    name: 'TATA Capital Pankh Scholarship for Professional Degrees',
    amount: 'Up to 80% of Tuition Fees (Max ₹50,000)',
    deadline: '15 October 2026',
    category: 'general',
    eligibilityText: 'Students in 1st/2nd year Degree/Diploma, scoring > 60% marks, income < ₹4L',
    helpline: '011-43092248',
    link: 'https://www.tatacapital.com'
  },
  {
    id: 'hdfc_parivartan',
    name: 'HDFC Bank Parivartan ECSS Educational Crisis Scholarship',
    amount: 'Up to ₹75,000 per year',
    deadline: '31 December 2026',
    category: 'general',
    eligibilityText: 'Students facing personal/family financial distress, scoring > 55% marks',
    helpline: '011-43092248',
    link: 'https://www.hdfcbank.com'
  },
  {
    id: 'sbi_asha',
    name: 'SBI Asha Scholarship for School & Higher Education',
    amount: 'Up to ₹50,000 per year',
    deadline: '30 November 2026',
    category: 'general',
    eligibilityText: 'Meritorious students from low-income families (income < ₹3L) studying in top institutes',
    helpline: '022-22740525',
    link: 'https://www.sbifoundation.in'
  },
  {
    id: 'colgate_keep_smiling',
    name: 'Keep India Smiling Foundational Scholarship (Colgate)',
    amount: '₹30,000 per year for 3-4 years',
    deadline: '31 December 2026',
    category: 'general',
    eligibilityText: 'Students pursuing BDS, Engineering, or Vocational courses with Class 12 > 60%',
    helpline: '011-43092248',
    link: 'https://www.colgate.co.in'
  },
  {
    id: 'nmms_national',
    name: 'National Means-cum-Merit Scholarship Scheme (NMS)',
    amount: '₹12,000 per year (Class 9 to 12)',
    deadline: '30 October 2026',
    category: 'general',
    eligibilityText: 'Students studying in Government/Aided schools, scoring > 55% in Class 7/8 exam',
    helpline: '0120-6619540',
    link: 'https://scholarships.gov.in'
  },

  // PAGE 4: Industry Giants & Special Foundation Grants
  {
    id: 'ongc_scholarship',
    name: 'ONGC Scholarship for SC/ST & General OBC Students',
    amount: '₹48,000 per year for Engineering & MBBS',
    deadline: '15 November 2026',
    category: 'sc_st',
    eligibilityText: 'Students enrolled in 1st year Engineering/MBBS/Geology, family income < ₹4.5L',
    helpline: '0135-2792630',
    link: 'https://ongcscholar.org'
  },
  {
    id: 'lic_hfl_vidyadhan',
    name: 'LIC HFL Vidyadhan Scholarship for Higher Education',
    amount: 'Up to ₹25,000 per year for Graduation/Post-Graduation',
    deadline: '31 October 2026',
    category: 'general',
    eligibilityText: 'Students scoring > 60% in Class 12/Graduation, family income < ₹3,60,000',
    helpline: '022-22860860',
    link: 'https://www.lichousing.com'
  },
  {
    id: 'aditya_birla',
    name: 'Aditya Birla Capital Scholarship for Professional Students',
    amount: 'Up to ₹60,000 one-time educational grant',
    deadline: '15 November 2026',
    category: 'general',
    eligibilityText: 'Students enrolled in undergraduate professional degree programs with income < ₹6L',
    helpline: '011-43092248',
    link: 'https://www.adityabirlacapital.com'
  },
  {
    id: 'siemens_dual_vet',
    name: 'Siemens India Dual VET & Engineering Scholarship',
    amount: '100% Tuition Fee + Laptop + Industrial Internship',
    deadline: '31 August 2026',
    category: 'general',
    eligibilityText: '1st year Diploma/Degree Engineering students in Govt Polytechnics, income < ₹2.5L',
    helpline: '022-39663000',
    link: 'https://www.siemens.co.in'
  },
  {
    id: 'kotak_kanya',
    name: 'Kotak Kanya Scholarship for Female Engineers',
    amount: '₹1,50,000 per year till completion of Engineering',
    deadline: '30 September 2026',
    category: 'general',
    eligibilityText: 'Meritorious girl students admitted to premier engineering institutes (IIT/NIT/COEP)',
    helpline: '011-43092248',
    link: 'https://www.kotakeducation.org'
  },
  {
    id: 'reliance_undergrad',
    name: 'Reliance Foundation Undergraduate Scholarship',
    amount: 'Up to ₹2,00,000 over course duration',
    deadline: '15 October 2026',
    category: 'general',
    eligibilityText: 'First-year undergraduate students in any stream scoring > 60% in Class 12, income < ₹15L',
    helpline: '022-79691456',
    link: 'https://www.reliancefoundation.org'
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
