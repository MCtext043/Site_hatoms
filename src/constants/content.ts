export const navigation = [
  { label: 'Главная', href: '#home' },
  { label: 'Наши проекты', href: '#projects' },
  { label: 'Наш стек', href: '#stack' },
  { label: 'Мероприятия', href: '#events' },
  { label: 'Контакты', href: '#contacts' },
] as const

export const eventPhotos = {
  nto: [
    '/events/nto/moments/nto-team-at-laptop.jpg',
    '/events/nto/moments/nto-robot-demo.jpg',
    '/events/nto/moments/nto-robot-control.jpg',
  ],
} as const

export const projects = [
  {
    number: '01',
    title: 'Сердце Удмуртии',
    description: 'Мобильный цифровой навигатор: помогает туристу открыть интересные места, построить маршрут и услышать истории города.',
    tags: ['Android + iOS', 'Kotlin + Swift', 'FastAPI'],
    tone: 'from-[#ff3154]/40 via-violet-500/20 to-slate-950',
    coverImage: '/projects/heart-udm/cover.png',
    screenshots: ['/projects/heart-udm/screen-board-01.png', '/projects/heart-udm/screen-board-02.png'],
    caseUrl: '/projects/heart-of-udm',
    figmaUrl: 'https://www.figma.com/design/W4ibJ1CC8pT5rEqZ5FdxzU/Heart_of_UDM?node-id=0-1&p=f&t=pgWnfg5Es8AuReic-0',
  },
  { number: '02', title: 'Swipe CSAT', description: 'Placeholder description for a platform built to feel precise, fast and effortless.', tags: ['Next.js', 'Python', 'Cloud'], tone: 'from-violet-500/35 via-fuchsia-500/10 to-transparent', coverImage: '/projects/swipe-csat-cover.png' },
  { number: '03', title: 'SmartWallet', description: 'Placeholder description for an interface where every interaction has a purpose.', tags: ['Mobile', 'Node.js', 'Data'], tone: 'from-emerald-400/30 via-cyan-500/10 to-transparent', coverImage: '/projects/smart-wallet-cover.png' },
] as const

export const technologyCategories = [
  { title: 'Frontend', technologies: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Next.js', 'TanStack Query', 'Zustand', 'shadcn/ui', 'Framer Motion', 'GSAP', 'Three.js', 'PyQt6'] },
  { title: 'Backend', technologies: ['FastAPI', 'Flask', 'Django', 'SQLAlchemy', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Celery', 'REST API', 'WebSocket', 'JWT', 'OAuth 2.0'] },
  { title: 'Mobile', technologies: ['Kotlin', 'Jetpack Compose', 'Coroutines', 'Retrofit', 'Room', 'Hilt', 'Firebase', 'BLE', 'NFC', 'MVVM', 'Dependency Injection'] },
  { title: 'AI и Data', technologies: ['PyTorch', 'Scikit-learn', 'OpenCV', 'Pandas', 'NumPy', 'Hugging Face', 'LangChain', 'ONNX', 'MLflow', 'Yandex Cloud', 'MinIO'] },
  { title: 'DevOps', technologies: ['Docker', 'Kubernetes', 'Nginx', 'GitHub Actions', 'Linux', 'CI/CD', 'Prometheus', 'Grafana', 'Sentry'] },
  { title: 'Тестирование', technologies: ['Pytest', 'Vitest', 'Playwright', 'JUnit', 'Postman', 'Testcontainers'] },
  { title: 'Архитектура', technologies: ['Clean Architecture', 'SOLID', 'Microservices', 'Event-driven architecture', 'Repository Pattern', 'Dependency Injection', 'Caching', 'Message Brokers'] },
  { title: 'Mechatronics', technologies: ['ESP32', 'Arduino', 'Raspberry Pi', 'ROS 2', 'MQTT'] },
] as const

export const primaryTechnologies = ['FastAPI', 'Kotlin', 'Jetpack Compose', 'TypeScript', 'PostgreSQL', 'Docker', 'OpenCV', 'ROS 2'] as const

// Flat list is retained for the legacy stack component while the grouped view is rendered on the page.
export const technologies = technologyCategories.flatMap(category => category.technologies)

const bigChallengesPresentation = Array.from({ length: 23 }, (_, index) => `/events/big-challenges/presentation/slide-${index + 1}.jpg`)

export const events = [
  { slug: 'neimark-hackathon-academy', date: '13.08.2023 — 26.08.2023', title: 'НЕЙМАРК.Академия Хакатонщиков', subtitle: '', summary: 'Интенсив для развития навыков и создания IT-проектов', description: 'Интенсив по прокачке hard & soft skills в сфере Frontend/Backend-разработки, дизайна, менеджмента и маркетинга. Программа включает лекции от экспертов IT-отрасли и итоговый хакатон. В рамках академии совместно с Министерством культуры Нижегородской области было разработано мобильное приложение — единая платформа для творческих людей города, объединяющая возможность делиться своими работами и посещать актуальные выставки и мероприятия.', gallery: ['/events/neimark-hackathon/screen-1.png', '/events/neimark-hackathon/screen-2.png', '/events/neimark-hackathon/screen-3.png', '/events/neimark-hackathon/screen-4.png', '/events/neimark-hackathon/screen-5.png', '/events/neimark-hackathon/screen-6.png', '/events/neimark-hackathon/screen-7.png', '/events/neimark-hackathon/screen-8.png'], photos: ['/events/neimark-hackathon/moments/group-on-stage.jpg', '/events/neimark-hackathon/moments/opening.jpg', '/events/neimark-hackathon/moments/team-at-neimark.jpg', '/events/neimark-hackathon/moments/team-outdoors.jpg', '/events/neimark-hackathon/moments/memories-and-merch.jpg', '/events/neimark-hackathon/moments/development.jpg'] },
  { slug: 'phystech-lyceum-intensive', date: '25.01.2024 — 04.02.2024', title: 'Междисциплинарная школа в Физтех-лицее имени Капицы', summary: 'Компьютерное зрение в обычной жизни', description: 'Мы выбрали один из двух треков — «ИТ-технологии» или «Биотехнологии» — и совместили теоретические занятия с практикой и разработкой командных проектов. Наша команда работала с Arduino, Python, OpenCV, датчиками и биологическими установками; программу дополнили лекции экспертов и экскурсии в лаборатории МФТИ. Результат нашей смены — прототип видеоаналитики для «Умного дома», распознающий людей, животных и жесты и управляющий Arduino и адресной лентой.', presentation: ['/events/phystech-school/presentation/slide-1.png', '/events/phystech-school/presentation/slide-2.png', '/events/phystech-school/presentation/slide-3.png', '/events/phystech-school/presentation/slide-4.png', '/events/phystech-school/presentation/slide-5.png', '/events/phystech-school/presentation/slide-6.png', '/events/phystech-school/presentation/slide-7.png', '/events/phystech-school/presentation/slide-8.png', '/events/phystech-school/presentation/slide-9.png', '/events/phystech-school/presentation/slide-10.png', '/events/phystech-school/presentation/slide-11.png'], demo: '/events/phystech-school/demo-web.mp4', repositoryUrl: 'https://github.com/hilyyx/Arduino-and-Python' },
  { slug: 'neimark-cybersecurity-academy', date: '09.08.2024 — 19.08.2024', title: 'НЕЙМАРК.Академия по информационной безопасности', subtitle: '1 место на финальном CTF', summary: 'Криптография, веб-безопасность и администрирование', description: 'Мы прошли программу НЕЙМАРК.Академии по информационной безопасности на уровне middle. Вместе с экспертами индустрии и опытными педагогами мы углубили теоретические знания и сразу применяли их на практике. Мы работали в небольшой группе, участвовали в наставничестве, P2P-лекциях и мастер-классах приглашённых специалистов, а также стали частью насыщенной внеучебной программы Академии.\n\nВ блоке криптографии мы разбирали уязвимости шифров типа RSA, основы современной криптографии, white-box-шифры и криптоалгоритмы. В блоке веб-безопасности изучали RCE, XSS, LFI и SSRF. На занятиях по администрированию настраивали серверы и познакомились с Active Directory.\n\nЭтот курс помог нам укрепить базу в информационной безопасности и развить практические навыки работы с технологиями и оборудованием. Завершением программы стал CTF по лигам сложности, где наша команда заняла 1 место.', photos: ['/events/neimark-cybersecurity/moments/academy-stage.jpg', '/events/neimark-cybersecurity/moments/academy-audience.jpg', '/events/neimark-cybersecurity/moments/team-overlook.jpg', '/events/neimark-cybersecurity/moments/team-outdoors.jpg'] },
  { slug: 'big-challenges', date: '01.07.2025 — 25.07.2025', title: 'Большие Вызовы в Сириусе', subtitle: 'Большие данные, искусственный интеллект, автоматизированные системы и безопасность', summary: 'AI-ассистент видеоигрового сценариста на базе больших языковых моделей.', description: 'На направлении «Большие данные, искусственный интеллект, автоматизированные системы и безопасность» мы работали над применением современных цифровых технологий для решения практических задач. Наша команда создала AI-ассистента видеоигрового сценариста, который помогает быстрее проектировать персонажей, игровые механики и диалоги для NPC.\n\nСценарист или гейм-дизайнер задаёт параметры персонажа: имя, роль, характер и дополнительные детали. Затем система строит структуру диалога и генерирует его содержание. Результат можно редактировать и использовать в игровой среде.\n\nВ основе решения - цепочка LLM-агентов: генераторы создают структуру и контент, валидаторы проверяют их на соответствие заданным параметрам и игровой логике, а перегенераторы исправляют результат при необходимости. Мы также разработали редакторы персонажей и диалогов, а также игровые механики: создание персонажей, передачу предметов, условия победы и поражения, лобби и элементы случайности.\n\nКлиентская часть проекта реализована на Unity, backend - на Python и FastAPI, а веб-интерфейс - на Vue.', presentation: bigChallengesPresentation, photos: ['/events/big-challenges/moments/project-merch.jpg', '/events/big-challenges/moments/sirius-stage.jpg', '/events/big-challenges/moments/sirius-evening.jpg', '/events/big-challenges/moments/sirius-hotel.jpg'], demo: '/events/big-challenges/project-demo.mp4', repositories: [{ label: 'Unity-приложение', url: 'https://github.com/MihPopov/ScreenwriterUnity' }, { label: 'Backend', url: 'https://github.com/hilyyx/screenwriter-backend' }] },
  { slug: 'nto', date: '01.04.2024 — 06.04.2024 / 16.02.2026 — 21.02.2026 / 23.02.2026 — 01.03.2026', title: 'НТО', subtitle: 'Призёры трека «Технологии компьютерного зрения и цифровые сервисы», финалисты треков «Разработка мобильных приложений» и «Автономные транспортные системы»', summary: '' },
  { slug: 'prod-olympiad', date: '13.03.2026 — 18.03.2026', title: 'Международная олимпиада PROD', subtitle: 'Заключительный командный тур по промышленной разработке', summary: 'Разработка и защита полноценных ИТ-продуктов в командах.', description: 'На заключительном этапе мы пять дней работали в командах над полноценными ИТ-продуктами: разбирали реальные продуктовые кейсы, проектировали решение, создавали прототип и готовили защиту. В программе были семинары и воркшопы, а над проектами помогали практикующие разработчики и эксперты индустрии.', photos: ['/events/prod-olympiad/moments/prod-team-at-work.jpg', '/events/prod-olympiad/moments/prod-award-ceremony.jpg', '/events/prod-olympiad/moments/prod-team-discussion.jpg', '/events/prod-olympiad/moments/prod-mentor-session.jpg', '/events/prod-olympiad/moments/prod-group-work.jpg', '/events/prod-olympiad/moments/prod-pair-programming.jpg'] },
  { slug: 'deadline-case-championship', date: '26.04.2026 — 30.04.2026', title: 'Кейс-чемпионат Deadline', subtitle: 'Финал кейс-чемпионата от Центрального университета', summary: 'Решение реальных бизнес-задач в команде и защита проекта.', description: 'На кейс-чемпионате мы работали в командах над реальными задачами от компаний: анализировали кейс, формировали продуктовую концепцию, готовили решение и презентовали его экспертам. В рамках смены общались с практиками индустрии, участвовали в лекциях и дорабатывали проект по обратной связи менторов.', photos: ['/events/deadline-case-championship/moments/deadline-team-discussion.jpg', '/events/deadline-case-championship/moments/deadline-presentation.jpg', '/events/deadline-case-championship/moments/deadline-workshop.jpg'] },
] as const
