export const resumeUrl = '/media/images/Kai_Luzniak_Resume.pdf';
export const email = 'kluzniak@ucsc.edu';

export const summary = {
  current: [
    { organization: 'UC Santa Cruz', role: 'Computer Science' },
    { organization: 'Tech4Good Lab', role: 'Developer / Undergraduate Research Assistant' },
    { organization: 'Slug Gaming', role: 'Web Developer / Software Engineer' },
  ],
  previous: [
    { organization: 'Boeing Defense, Space & Security', role: 'Technical Program Management Intern' },
    { organization: 'Northrop Grumman', role: 'Software Developer Mentee' },
  ],
};

export const projects = [
  {
    name: 'osumapscout',
    eyebrow: 'Recommendation system',
    statement: 'Find osu! maps based on how you actually play.',
    description: "A map discovery tool built around a player’s profile, top plays, mods, and map characteristics—not hours spent digging through other players’ profiles.",
    technologies: ['Recommendation systems', 'osu! data', 'Player profiles'],
    href: 'https://github.com/beatopia',
  },
  {
    name: 'Overwatch Queue Monitor',
    eyebrow: 'Desktop utility',
    statement: 'A tiny tool for a very specific problem: missing queue pops while getting food.',
    description: 'It watches the Overwatch interface for a match, then sends a Discord notification to my phone. The detector stays deliberately simple: screen capture, tolerant pixel matching, and a PyQt interface.',
    technologies: ['Python', 'PyQt6', 'Pillow', 'Discord webhooks'],
    href: 'https://github.com/beatopia/ow-queue-monitor',
    article: '/blog/ow-queue-monitor',
    image: '/media/images/projects/owqueuemonitor.jpg',
    imageAlt: 'Overwatch Queue Monitor desktop application',
  },
  {
    name: 'Cata',
    eyebrow: "DVC ’25 Game Jam · 1st place",
    statement: 'A multiplayer game built under game-jam constraints.',
    description: 'I worked across gameplay and networked systems using Unity and Mirror, with an AWS EC2 instance supporting the multiplayer build.',
    technologies: ['Unity', 'C#', 'Mirror', 'AWS EC2'],
    href: 'https://github.com/beatopia/cata',
    image: '/media/images/projects/cata.png',
    imageAlt: 'Gameplay from Cata',
  },
];

export const experience = {
  professional: [
    { organization: 'Tech4Good Lab', role: 'Undergraduate Research Assistant / Developer' },
    { organization: 'Slug Gaming', role: 'Software Engineer / Web Developer' },
    { organization: 'Boeing Defense, Space & Security', role: 'Technical Program Management Intern' },
    { organization: 'Northrop Grumman', role: 'Software Developer Mentee' },
    { organization: 'Code Ninjas', role: 'K–12 Coding Instructor' },
  ],
  extracurricular: [
    { organization: 'UCSC Overwatch', role: 'Division I Hitscan Player' },
    { organization: 'Slug Gaming', role: 'Executive Signer / Community Leadership' },
    { organization: 'Vietnamese Student Association', role: 'Intern' },
    { organization: 'Gen.G Collegiate', role: 'Program Lead / Ambassador' },
    { organization: 'UCSC Computer Lounges', role: 'Systems Administrator' },
  ],
};

export const currentItems = [
  { label: 'Building', value: 'osumapscout' },
  { label: 'Playing', value: 'osu!' },
  { label: 'Learning', value: 'C++' },
  { label: 'Reading', value: 'Shadow Slave' },
  { label: 'Climbing', value: 'when my forearms cooperate' },
];
