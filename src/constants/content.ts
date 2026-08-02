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
  { slug: 'neimark-hackathon-academy', date: '13.08.2023 — 26.08.2023', title: 'НЕЙМАРК.Академия Хакатонщиков', subtitle: '', summary: 'Интенсив для развития навыков и создания IT-проектов', description: 'Интенсив по прокачке hard & soft skills в сфере Frontend/Backend-разработки, дизайна, менеджмента и маркетинга. Программа включает лекции от экспертов IT-отрасли и итоговый хакатон. В рамках академии совместно с Министерством культуры Нижегородской области было разработано мобильное приложение — единая платформа для творческих людей города, объединяющая возможность делиться своими работами и посещать актуальные выставки и мероприятия.', gallery: ['/events/neimark-hackathon/screen-1.png', '/events/neimark-hackathon/screen-2.png', '/events/neimark-hackathon/screen-3.png', '/events/neimark-hackathon/screen-4.png', '/events/neimark-hackathon/screen-5.png', '/events/neimark-hackathon/screen-6.png', '/events/neimark-hackathon/screen-7.png', '/events/neimark-hackathon/screen-8.png'], photos: ['/events/neimark-hackathon/moments/group-on-stage.jpg', '/events/neimark-hackathon/moments/opening.jpg', '/events/neimark-hackathon/moments/team-at-neimark.jpg', '/events/neimark-hackathon/moments/team-outdoors.jpg', '/events/neimark-hackathon/moments/memories-and-merch.jpg', '/events/neimark-hackathon/moments/development.jpg'] },
  { slug: 'phystech-lyceum-intensive', date: '25.01.2024 — 04.02.2024', title: 'Междисциплинарная школа в Физтех-лицее имени Капицы', summary: 'Компьютерное зрение в обычной жизни', description: 'Участники школы выбрали один из двух треков — «ИТ-технологии» или «Биотехнологии» — и совместили теоретические занятия с практикой и разработкой командных проектов. Наша команда работала с Arduino, Python, OpenCV, датчиками и биологическими установками; программу дополнили лекции экспертов и экскурсии в лаборатории МФТИ. Результат нашей смены — прототип видеоаналитики для «Умного дома», распознающий людей, животных и жесты и управляющий Arduino и адресной лентой.', presentation: ['/events/phystech-school/presentation/slide-1.png', '/events/phystech-school/presentation/slide-2.png', '/events/phystech-school/presentation/slide-3.png', '/events/phystech-school/presentation/slide-4.png', '/events/phystech-school/presentation/slide-5.png', '/events/phystech-school/presentation/slide-6.png', '/events/phystech-school/presentation/slide-7.png', '/events/phystech-school/presentation/slide-8.png', '/events/phystech-school/presentation/slide-9.png', '/events/phystech-school/presentation/slide-10.png', '/events/phystech-school/presentation/slide-11.png'], demo: '/events/phystech-school/demo-web.mp4' },
  { slug: 'neimark-cybersecurity-academy', date: '09.08.2024 — 19.08.2024', title: 'НЕЙМАРК.Академия по информационной безопасности', subtitle: '1 место на CTF', summary: '' },
  { slug: 'big-challenges', date: '01.07.2025 — 25.07.2025', title: '«Большие вызовы»', subtitle: 'Большие данные, искусственный интеллект, автоматизированные системы и безопасность', summary: '' },
  { slug: 'nto', date: '01.04.2024 — 06.04.2024 / 16.02.2026 — 21.02.2026 / 23.02.2026 — 01.03.2026', title: 'НТО', subtitle: 'Призёры трека «Технологии компьютерного зрения и цифровые сервисы», финалисты треков «Разработка мобильных приложений» и «Автономные транспортные системы»', summary: '' },
  { slug: 'prod-olympiad', date: '13.03.2026 — 18.03.2026', title: 'Международная олимпиада PROD', subtitle: '', summary: '' },
  { slug: 'deadline-case-championship', date: '26.04.2026 — 30.04.2026', title: 'Кейс-чемпионат Deadline', subtitle: '', summary: '' },
] as const
