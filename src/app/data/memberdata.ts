// src/data/members/member1.ts

const member1Data = {
  requiredInfo: {
    id: 'member1',
    firstName: 'Henok',
    lastName: 'Doe',
    email: 'Henok@example.com',
    phone: '(+251)-955-012-234',
    birth: 'July 15, 2000',
    github: 'shifta123',
    gender:'male',
    telegram : '@Henok123',
    graduation : '2026',  
    specialization: 'Full-stack development, UI/UX design',
    cgpa: '3.8',
    department: 'Computer Science And Engineering',
    mentor : 'Kiya Kebe'
  },
    


  optionalInfo: {
    uniId : '123456789',
    insta : 'www.instagram.com/henok123',
    linkedin : 'www.linkedin.com/in/henok123',
    codeforces : 'www.codeforces.com/henok123',
    leetcode : 'www.leetcode.com/henok123',
    joinedDate: '2023-01-15',
    cv : 'https://example.com/cv.pdf',
    birthdate :'15-07-2000',
    shortbio : `I am a full-stack developer and UI/UX designer with a strong background in Next.js, React, 
              Tailwind CSS, Redux Toolkit, and ShadCN on the frontend, as well as Node.js, Express, Prisma, 
              and databases like MongoDB & PostgreSQL on the backend. I have experience developing 
              high-performance web applications, focusing on clean architecture, scalability, and modern 
              UI/UX principles.`

  },

  resources: [
    {
      name: "Data science & AI challenges",
      link: "https://googlecodejam.com/challenges"
    },
    {
      name: "Math-based programming problems",
      link: "https://googlecodejam.com/challenges"
    },
    {
      name: "Cybersecurity & hacking challenges",
      link: "https://googlecodejam.com/challenges"
    },
    {
      name: "Smart contract security challenges",
      link: "https://googlecodejam.com/challenges"
    },
    {
      name: "CP contests for beginners & intermediates",
      link: "https://googlecodejam.com/challenges"
    }
  ],

  headsUp: [
    {
      title: 'A Quick Heads-Up',
      message:
        "Hey everyone, just wanted to let you know I won’t be joining the contest this time around...",
    },
    {
      title: 'Note',
      message: "I'll be offline for the weekend.",
    },
  ],

  progressData: [
    { label: '0', percent: 0, count: 0, color: '#003087', par: 'Heads up' },
    { label: '3', percent: 25, count: 3, color: '#003087', par: 'Absent' },
    { label: '7', percent: 75, count: 7, color: '#003087', par: 'Present' },
  ],
  
};

export default member1Data;
