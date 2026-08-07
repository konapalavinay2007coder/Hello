export const formTemplates = [
  {
    id: 'pm_kisan',
    name: 'PM-KISAN Samman Nidhi Farmer Registration',
    department: 'Ministry of Agriculture & Farmers Welfare',
    benefit: '₹6,000 per year in 3 equal installments of ₹2,000 via DBT',
    stepsCount: 4,
    fields: [
      { id: 'applicantName', label: 'Farmer Full Name (as on Aadhaar)', type: 'text', required: true },
      { id: 'aadhaarNumber', label: '12-Digit Aadhaar Number', type: 'text', placeholder: 'XXXX-XXXX-XXXX', required: true },
      { id: 'district', label: 'District & State', type: 'text', placeholder: 'Nagaur, Rajasthan', required: true },
      { id: 'bankAccount', label: 'Bank Account Number & IFSC', type: 'text', placeholder: 'SBIN0001234', required: true },
      { id: 'landSizeAcres', label: 'Total Land Holding Area (in Acres)', type: 'number', placeholder: 'e.g. 2.5', required: true }
    ]
  },
  {
    id: 'shahu_ebc',
    name: 'Rajarshi Chhatrapati Shahu Maharaj EBC Fee Concession',
    department: 'Higher & Technical Education Dept, Govt of Maharashtra',
    benefit: '50% Tuition & Exam Fee Concession for Degree/Diploma Courses',
    stepsCount: 4,
    fields: [
      { id: 'studentName', label: 'Student Full Name', type: 'text', required: true },
      { id: 'collegeName', label: 'Admitted College Name', type: 'text', placeholder: 'COEP / PICT Pune', required: true },
      { id: 'cetScore', label: 'MHT-CET Percentile Score', type: 'number', placeholder: 'e.g. 94.5', required: true },
      { id: 'incomeCertificateNo', label: 'Annual Income Certificate Number (< ₹8L)', type: 'text', required: true },
      { id: 'bankAccount', label: 'Aadhaar Seeded Bank Account Number', type: 'text', required: true }
    ]
  }
];
