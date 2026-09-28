/**
 * Mock data used when no auth token is present (preview / demo mode).
 */
export const MOCK_USER = {
  full_name: 'Joshua Co',
  email: 'joshua.co@example.com',
  role: 'candidate',
  trade_type: 'Licensed Electrician',
}

export const MOCK_DASH = {
  documents: { uploaded: 3 },
  expressions_of_interest: { received: 2 },
}

export const MOCK_PROFILE = {
  id: 'mock-profile-id',
  trade_type: 'Licensed Electrician',
  years_experience: 7,
  is_electrical_worker: true,
  english_level: 'IELTS 7.0+',
  other_languages: ['Arabic', 'Hindi'],
  bio: 'Licensed electrician with 7 years of experience in industrial wiring and motor controls. Seeking opportunities in Australia.',
  published: false,
}

export const MOCK_EOIS = [
  { id:'e1', employer_company:'BuildCore Australia',   employer_name:'BuildCore Australia',   trade_type:'Licensed Electrician', status:'active',               sponsorship_offered:true  },
  { id:'e2', employer_company:'Sydney Solar Group',    employer_name:'Sydney Solar Group',    trade_type:'Licensed Electrician', status:'interview_scheduled',  sponsorship_offered:false },
  { id:'e3', employer_company:'BuildCore Australia',   employer_name:'BuildCore Australia',   trade_type:'Licensed Electrician', status:'active',               sponsorship_offered:true  },
  { id:'e4', employer_company:'Pacific Constructions', employer_name:'Pacific Constructions', trade_type:'Licensed Electrician', status:'active',               sponsorship_offered:true  },
]
