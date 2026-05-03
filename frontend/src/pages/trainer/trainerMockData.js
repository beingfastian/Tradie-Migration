export const MOCK_TRAINER_USER = {
  full_name: 'John Smith',
  email: 'john@tradesacademy.edu.au',
  role: 'training_provider',
}

export const MOCK_PROVIDER = {
  id: 'mock-provider-id',
  institution_name: 'Trades Academy Australia',
  rto_code: '12345',
  main_campus_location: 'Parramatta, NSW',
  phone_number: '+61 2 9000 1234',
  primary_training_sector: 'Electrical & Energy',
  cricos_registered: true,
  years_in_education: '10+',
  accreditation_type: 'Government Funded',
  secondary_campus_locations: ['Melbourne, VIC', 'Brisbane, QLD'],
  description: 'Specializing in Australian Standards certification and trade skills assessment for international workers.',
  profile_pct: 98,
  active_courses: 12,
}

export const MOCK_COURSES = [
  { id:'c1', title:'Cert III Electrotechnology', delivery:'On-Campus (Sydney)', enrollment:'18 / 20 Students', next_intake:'15 Nov 2026', status:'Enrolling' },
  { id:'c2', title:'Senior Electrician',         delivery:'On-Campus (Sydney)', enrollment:'18 / 20 Students', next_intake:'15 Nov 2026', status:'Closing Soon' },
  { id:'c3', title:'Cert III Electrotechnology', delivery:'On-Campus (Sydney)', enrollment:'18 / 20 Students', next_intake:'15 Nov 2026', status:'On Hold' },
  { id:'c4', title:'Cert III Electrotechnology', delivery:'On-Campus (Sydney)', enrollment:'18 / 20 Students', next_intake:'15 Nov 2026', status:'Enrolling' },
  { id:'c5', title:'Senior Electrician',         delivery:'On-Campus (Sydney)', enrollment:'18 / 20 Students', next_intake:'15 Nov 2026', status:'Closing Soon' },
  { id:'c6', title:'Cert III Electrotechnology', delivery:'On-Campus (Sydney)', enrollment:'18 / 20 Students', next_intake:'15 Nov 2026', status:'On Hold' },
  { id:'c7', title:'Senior Electrician',         delivery:'On-Campus (Sydney)', enrollment:'18 / 20 Students', next_intake:'15 Nov 2026', status:'Enrolling' },
]

export const MOCK_STUDENTS = [
  { id:'s1', name:'John Doe', email:'john.doe@gmail.com', course:'Solar Tech Certification', progress:25,  last_activity:'Today, 10:45 AM', status:'In Bad Standing' },
  { id:'s2', name:'John Doe', email:'john.doe@gmail.com', course:'Solar Tech Certification', progress:85,  last_activity:'Today, 10:45 AM', status:'In Good Standing' },
  { id:'s3', name:'John Doe', email:'john.doe@gmail.com', course:'Solar Tech Certification', progress:25,  last_activity:'Today, 10:45 AM', status:'In Bad Standing' },
  { id:'s4', name:'John Doe', email:'john.doe@gmail.com', course:'Solar Tech Certification', progress:85,  last_activity:'Today, 10:45 AM', status:'In Good Standing' },
  { id:'s5', name:'John Doe', email:'john.doe@gmail.com', course:'Solar Tech Certification', progress:45,  last_activity:'Today, 10:45 AM', status:'In Average Standing' },
  { id:'s6', name:'John Doe', email:'john.doe@gmail.com', course:'Solar Tech Certification', progress:85,  last_activity:'Today, 10:45 AM', status:'In Good Standing' },
  { id:'s7', name:'John Doe', email:'john.doe@gmail.com', course:'Solar Tech Certification', progress:85,  last_activity:'Today, 10:45 AM', status:'In Good Standing' },
]

export const MOCK_INQUIRIES = [
  { id:'i1', name:'Samuel Rivera', sub:'Cert II Electrotechnology',    inquiry:'Inquiry: Cert II Electrotechnology',       starred:false },
  { id:'i2', name:'John Doe',      sub:'Solar Grid-Connect Short Course', inquiry:'Inquiry: Solar Installation Gap Training', starred:true  },
  { id:'i3', name:'Samuel Rivera', sub:'Cert II Electrotechnology',    inquiry:'Inquiry: Cert II Electrotechnology',       starred:false },
  { id:'i4', name:'Samuel Rivera', sub:'Cert II Electrotechnology',    inquiry:'Inquiry: Cert II Electrotechnology',       starred:false },
  { id:'i5', name:'Samuel Rivera', sub:'Cert II Electrotechnology',    inquiry:'Inquiry: Cert II Electrotechnology',       starred:false },
  { id:'i6', name:'Samuel Rivera', sub:'Cert II Electrotechnology',    inquiry:'Inquiry: Cert II Electrotechnology',       starred:false },
]
