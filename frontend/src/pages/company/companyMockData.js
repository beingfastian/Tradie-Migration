export const MOCK_COMPANY_USER = {
  full_name: 'Acme Electrical Pty Ltd',
  email: 'acme@example.com',
  role: 'employer',
}

export const MOCK_COMPANY = {
  id: 'mock-company-id',
  company_name: 'Acme Electrical Pty Ltd',
  trade_type: 'Licensed Electrical Contractor & Sponsor',
  country_of_registration: 'Australia',
  headquarters_location: 'Parramatta, NSW',
  phone_number: '+61 2 9999 0000',
  primary_industry: 'Licensed Electrical Contractor',
  is_approved_sponsor: true,
  years_in_operation: '10+',
  business_type: 'Pty Ltd',
  abn: '12 345 678 901',
  description: 'Specializing in industrial infrastructure and large-scale residential projects across NSW',
  verification_status: 'approved',
  roles_filled: 3,
  roles_total: 5,
}

export const MOCK_CANDIDATES = Array.from({ length: 7 }, (_, i) => ({
  id: `c${i+1}`,
  full_name: 'John Doe',
  email: 'john.doe@gmail.com',
  trade_type: 'Industrial Electrician',
  years_experience: 8,
  visa_status: ['482 Eligible', 'Skilled Ind.', 'Sponsor Required'][i % 3],
  status: ['Shortlisted', 'Verified'][i % 2],
}))

export const MOCK_JOBS = [
  { id:'j1', title:'Senior Electrician',  location:'Sydney, NSW',   applicants:'12 New / 45 Total', status:'Hiring' },
  { id:'j2', title:'Solar Installer',     location:'Perth, WA',     applicants:'5 New / 18 Total',  status:'Closing Soon' },
  { id:'j3', title:'HVAC Technician',     location:'Brisbane, QLD', applicants:'0 New / 10 Total',  status:'On Hold' },
  { id:'j4', title:'Senior Electrician',  location:'Sydney, NSW',   applicants:'12 New / 45 Total', status:'Hiring' },
  { id:'j5', title:'Solar Installer',     location:'Perth, WA',     applicants:'5 New / 18 Total',  status:'Closing Soon' },
  { id:'j6', title:'HVAC Technician',     location:'Brisbane, QLD', applicants:'0 New / 10 Total',  status:'On Hold' },
  { id:'j7', title:'Senior Electrician',  location:'Sydney, NSW',   applicants:'12 New / 45 Total', status:'Hiring' },
]

export const MOCK_SENT_EOIS = [
  { id:'e1', candidate_name:'Joshua Co - Electrician',  sub:'Re: Senior Role - Sydney',       status:'Sponsorship Offered', starred:false },
  { id:'e2', candidate_name:'Samuel R. - Solar Tech',   sub:'Technical interview pending',    status:'Interview: Pending',  starred:true  },
  { id:'e3', candidate_name:'Joshua Co - Electrician',  sub:'Re: Senior Role - Sydney',       status:'Sponsorship Offered', starred:false },
  { id:'e4', candidate_name:'Joshua Co - Electrician',  sub:'Re: Senior Role - Sydney',       status:'Sponsorship Offered', starred:false },
  { id:'e5', candidate_name:'Joshua Co - Electrician',  sub:'Re: Senior Role - Sydney',       status:'Sponsorship Offered', starred:false },
  { id:'e6', candidate_name:'Joshua Co - Electrician',  sub:'Re: Senior Role - Sydney',       status:'Sponsorship Offered', starred:false },
]
