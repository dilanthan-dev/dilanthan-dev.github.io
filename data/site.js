// Everything on the page reads from this file.
// Change the text here and the site updates everywhere.

export const site = {
  name: 'Dilanthan Sounthararasa',
  firstName: 'Dilanthan',
  lastName: 'Sounthararasa',
  nickname: 'Dark',
  // The loader spells D4RK, then opens each letter into its word.
  mark: [
    { lead: 'D', rest: 'riven' },
    { lead: '4', rest: '' },
    { lead: 'R', rest: 'eal' },
    { lead: 'K', rest: 'nowledge', accent: true },
  ],
  role: 'Software engineering student at Ontario Tech University.',
  pitch: 'I build 3D websites and online stores.',
  email: 'dilanthan.sounthararasa@gmail.com',
  linkedin: 'https://www.linkedin.com/in/dilanthan-sounthararasa/',
  github: 'https://github.com/dilanthan-dev',
  // Put your resume PDF in the "public" folder and set this to '/resume.pdf'.
  resume: '',
  timezone: 'America/Toronto',
  city: 'Toronto',
}

// The short facts beside the bio in the About panel.
export const facts = [
  { label: 'Name', value: 'Dilanthan Sounthararasa' },
  { label: 'Goes by', value: 'Dark' },
  { label: 'Studying', value: 'Software Engineering, Ontario Tech University' },
  { label: 'Status', value: 'Open to summer 2027 software engineering internships' },
]

// The words that scroll along the angled seam.
export const ticker = ['Three.js', 'React Three Fiber', 'Next.js', 'GSAP', 'GLSL', 'Shopify', 'MySQL', 'Figma']

// The first project gets the full-width card.
// To show a real screenshot in a frame, put the image in "public/projects"
// and set image: '/projects/your-file.jpg' (16:10 works best).
export const projects = [
  {
    id: 'aura-infotech',
    title: 'Aura Infotech',
    kind: '3D company website',
    role: 'Design and development for a registered business',
    year: '2025 to now',
    builtWith: 'Next.js 14, React Three Fiber, Three.js, GLSL shaders',
    description:
      'A company website that runs as a live 3D scene. A glass logo sits in a field of stars over an aurora shader, and a five-part scroll sequence breaks the logo into particles that rebuild as the service cards.',
    points: [
      'Wrote the particle starfield and the aurora background shader',
      'Built the scroll sequence and the opening intro',
      'Fixed rendering bugs and added layouts for tablets and phones',
    ],
    links: [{ label: 'Visit aurainfotech.ca', href: 'https://aurainfotech.ca' }],
    art: 'aura',
    hue: '#63d6c6',
    image: '',
  },
  {
    id: 'genz-electronics',
    title: 'GenZ Electronics',
    kind: 'Shopify store',
    role: 'Sole developer for a retail client',
    year: '2025 to now',
    builtWith: 'Shopify, Liquid, HTML, CSS, JavaScript',
    description:
      'An online store for an electronics retailer that sells new and open-box TVs. I built and launched it alone, and I still look after it every month.',
    points: [
      'Customised the theme, product pages and collections',
      'Shipped a seasonal Christmas version of the store',
      'Do the monthly search engine optimisation work',
    ],
    links: [{ label: 'Visit genzelectronics.ca', href: 'https://genzelectronics.ca' }],
    art: 'genz',
    hue: '#ff8f52',
    image: '',
  },
  {
    id: 'devtrack',
    title: 'DevTrack',
    kind: 'Client and project tracker',
    role: 'Team of four, Data Management Systems course',
    year: '2026, in progress',
    builtWith: 'MySQL, SQL, HTML, CSS, JavaScript',
    description:
      'A database and web app that lets a web agency keep track of its clients, projects and deadlines in one place.',
    points: [
      'Designed the relational schema and the ER diagrams',
      'Writing the SQL queries behind each screen',
      'Building the web front end that reads and updates the records',
    ],
    links: [],
    art: 'devtrack',
    hue: '#a3b8ff',
    image: '',
  },
]

export const about = {
  paragraphs: [
    'I am in my third year of Software Engineering (co-op) at Ontario Tech University. Outside class I build websites for real businesses, from first design to launch and the upkeep after it.',
    'Most of my recent work is in real-time 3D for the web. I also work with databases and back-end code, and I do my own design work in Figma, Photoshop and Illustrator.',
    'I am looking for a software or web developer co-op placement.',
  ],
  skills: [
    { label: 'Languages', value: 'JavaScript, Java, C++, Python, SQL' },
    { label: 'Front end', value: 'React, Next.js, Three.js, React Three Fiber, GSAP' },
    { label: 'Back end and data', value: 'Node.js, PHP, MySQL' },
    { label: 'Stores and CMS', value: 'Shopify, WordPress, WooCommerce' },
    { label: 'Design', value: 'Figma, Photoshop, Illustrator, After Effects' },
  ],
}

// PLACEHOLDERS: replace these with your real certificates.
// image: put the certificate image in "public/certificates" and set '/certificates/file.jpg'.
// verify: the public link where someone can check the certificate.
export const certificates = [
  { title: 'Certificate name', issuer: 'Issuer', date: '2026', image: '', verify: '' },
  { title: 'Certificate name', issuer: 'Issuer', date: '2026', image: '', verify: '' },
  { title: 'Certificate name', issuer: 'Issuer', date: '2025', image: '', verify: '' },
  { title: 'Certificate name', issuer: 'Issuer', date: '2025', image: '', verify: '' },
  { title: 'Certificate name', issuer: 'Issuer', date: '2025', image: '', verify: '' },
]
