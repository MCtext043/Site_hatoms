export const navigation = [
  { label: 'Главная', href: '#home' },
  { label: 'Наши проекты', href: '#projects' },
  { label: 'Наш стек', href: '#stack' },
  { label: 'Мероприятия', href: '#events' },
  { label: 'Контакты', href: '#contacts' },
] as const

export const projects = [
  { number: '01', title: 'Placeholder One', description: 'Placeholder description for a digital product with a distinct visual system.', tags: ['React', 'TypeScript', 'AI'], tone: 'from-cyan-400/35 via-blue-500/10 to-transparent' },
  { number: '02', title: 'Placeholder Two', description: 'Placeholder description for a platform built to feel precise, fast and effortless.', tags: ['Next.js', 'Python', 'Cloud'], tone: 'from-violet-500/35 via-fuchsia-500/10 to-transparent' },
  { number: '03', title: 'Placeholder Three', description: 'Placeholder description for an interface where every interaction has a purpose.', tags: ['Mobile', 'Node.js', 'Data'], tone: 'from-emerald-400/30 via-cyan-500/10 to-transparent' },
] as const

export const technologies = ['Python', 'FastAPI', 'Django', 'Flask', 'React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Redis', 'RabbitMQ', 'Celery', 'Nginx', 'Git', 'GitHub Actions', 'Linux', 'AWS', 'Yandex Cloud', 'TensorFlow', 'PyTorch', 'OpenCV']

export const events = [
  { date: '00 / 00', title: 'Placeholder Event', description: 'Placeholder text about an upcoming talk, meetup or product session.' },
  { date: '00 / 00', title: 'Placeholder Session', description: 'Placeholder text about a workshop for people shaping digital products.' },
  { date: '00 / 00', title: 'Placeholder Launch', description: 'Placeholder text about a future event with the team and community.' },
] as const
