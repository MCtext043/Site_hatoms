import { ArrowLeft, ArrowRight, Braces, ChevronDown, Cpu, Database, ExternalLink, GraduationCap, Send, Sparkles, Terminal, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { events, primaryTechnologies, projects, technologies, technologyCategories } from '@/constants/content'
import { Button, SectionHeading } from '@/components/ui/primitives'
import { TechnologyLogo } from '@/components/ui/technology-logo'
import teamLogo from '@/assets/hatoms-wordmark.png'

const reveal = { initial: { opacity: 0, y: 24, filter: 'blur(8px)' }, whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.7 } }

type CursorPoint = { x: number; y: number; id: number }
const cursorObjects = [Terminal, Cpu, Database, Braces]

function LogoCursorField() {
  const [cursor, setCursor] = useState({ x: 50, y: 50, visible: false })
  const [trail, setTrail] = useState<CursorPoint[]>([])
  const lastTrailAt = useRef(0)

  const moveCursor = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    setCursor({ x, y, visible: true })
    if (event.timeStamp - lastTrailAt.current > 48) {
      lastTrailAt.current = event.timeStamp
      setTrail((points) => [...points, { x, y, id: event.timeStamp }].slice(-7))
    }
  }

  return (
    <div className="hero-logo-cursor-field absolute -inset-[8%]" onPointerEnter={moveCursor} onPointerMove={moveCursor} onPointerLeave={() => { setCursor((current) => ({ ...current, visible: false })); setTrail([]) }}>
      <img src={teamLogo} alt="Логотип команды Hatoms" className="absolute inset-[20%] z-10 h-[60%] w-[60%] object-contain drop-shadow-[0_0_35px_rgba(124,58,237,.45)]" />
      <div className="pointer-events-none absolute inset-0 z-20 hidden overflow-visible md:block" aria-hidden="true">
        {trail.map((point, index) => <span key={point.id} className="hero-logo-cursor-trail" style={{ left: point.x, top: point.y, opacity: (index + 1) / (trail.length + 2) }} />)}
        {cursor.visible && <div className="hero-logo-cursor" style={{ left: cursor.x, top: cursor.y }}>
          <span className="hero-logo-cursor-core"><Sparkles className="h-4 w-4" /></span>
          {cursorObjects.map((Icon, index) => <span key={index} className={`hero-logo-cursor-object hero-logo-cursor-object--${index}`}><Icon className="h-3.5 w-3.5" /></span>)}
        </div>}
      </div>
    </div>
  )
}

function LegacyHero() {
  const scroll = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  return <section id="home" className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-6xl items-center px-5 pb-20 pt-24 sm:px-8"><div className="grid w-full items-center gap-12 lg:grid-cols-[1.15fr_.85fr]"><motion.div {...reveal}><p className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[.24em] text-cyan-200/70"><Sparkles className="h-3.5 w-3.5" /> Digital product studio</p><h1 className="max-w-3xl text-balance text-6xl font-semibold leading-[.93] tracking-[-.075em] text-white sm:text-7xl lg:text-8xl">Placeholder <span className="text-gradient">Title</span></h1><p className="mt-7 max-w-xl text-pretty text-base leading-7 text-zinc-400 sm:text-lg">We create digital experiences for ideas that refuse to stay ordinary. Placeholder copy for a future team story.</p><div className="mt-9 flex flex-wrap gap-3"><Button onClick={() => scroll('#projects')}>Подробнее</Button><Button variant="secondary" onClick={() => scroll('#projects')}>Наши проекты</Button></div></motion.div><motion.div initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }} className="relative mx-auto aspect-square w-full max-w-md"><div className="absolute inset-[13%] rounded-full border border-cyan-200/15 bg-cyan-400/[.03] shadow-[0_0_100px_rgba(0,212,255,.15)]" /><div className="absolute inset-[23%] rounded-[2rem] border border-violet-300/30 bg-gradient-to-br from-cyan-300/20 via-transparent to-violet-500/30 backdrop-blur-sm motion-safe:animate-[spin_18s_linear_infinite]" /><div className="absolute inset-[33%] grid place-items-center rounded-full bg-gradient-to-br from-cyan-200 to-violet-500 text-4xl text-black shadow-[0_0_70px_rgba(124,58,237,.45)]">✦</div><div className="absolute left-0 top-1/3 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-cyan-100 backdrop-blur-md">Build / 01</div><div className="absolute bottom-1/4 right-0 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-violet-100 backdrop-blur-md">Future ready</div></motion.div></div></section>
}

export function Hero() {
  const scroll = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-6xl items-center px-5 pb-20 pt-24 sm:px-8">
      <div className="grid w-full items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
        <motion.div {...reveal}>
          <p className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[.22em] text-cyan-200/65 sm:text-xs"><Sparkles className="h-3 w-3" /> Минимум вопросов. Максимум действий</p>
          <h1 className="max-w-3xl text-balance text-6xl font-semibold leading-[.93] tracking-[-.075em] text-white sm:text-7xl lg:text-8xl">Hatoms <span className="text-gradient">company</span></h1>
          <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-8">Превращаем идеи в работающие продукты,<br className="hidden sm:block" /> воплощая самые смелые задумки клиентов и заказчиков.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Button onClick={() => scroll('#projects')}>Подробнее</Button><Button variant="secondary" onClick={() => scroll('#projects')}>Наши проекты</Button></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }} className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-[10%] rounded-full border border-cyan-200/15 bg-cyan-400/[.03] shadow-[0_0_100px_rgba(0,212,255,.15)]" />
          <div className="absolute inset-[18%] rounded-[2rem] border border-violet-300/30 bg-gradient-to-br from-cyan-300/20 via-transparent to-violet-500/30 backdrop-blur-sm motion-safe:animate-[spin_18s_linear_infinite]" />
          <LogoCursorField />
          <div className="absolute left-0 top-1/3 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-cyan-100 backdrop-blur-md">Build / 01</div>
          <div className="absolute bottom-1/4 right-0 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-violet-100 backdrop-blur-md">Future ready</div>
        </motion.div>
      </div>
    </section>
  )
}

type ProjectCardProps = { index: number; position: number; cardOffset: number; cardWidth: number; isHovered: boolean; dimmed: boolean; onHover: (index: number | null) => void; onSelect: (index: number) => void; onDragProgress: (offset: number) => void; onDragEnd: (offset: number, velocity: number) => void }

const carouselSpring = { type: 'spring' as const, stiffness: 300, damping: 29, mass: 0.82 }

function ProjectCard({ index, position, cardOffset, cardWidth, isHovered, dimmed, onHover, onSelect, onDragProgress, onDragEnd }: ProjectCardProps) {
  const project = projects[index]
  const isActive = position === 0
  const isPreview = Math.abs(position) === 1
  const direction = position < 0 ? -1 : 1
  const isFar = Math.abs(position) >= 2
  const coveredWidth = Math.max(0, cardWidth - cardOffset)
  const defaultPreviewMask = direction < 0 ? `inset(0 ${coveredWidth}px 0 0)` : `inset(0 0 0 ${coveredWidth}px)`
  const motionState = isActive
    ? { x: 0, scale: dimmed ? 0.97 : 1, opacity: 1, filter: dimmed ? 'blur(2px) brightness(.72)' : 'blur(0px) brightness(1)', rotateY: 0, zIndex: 30, clipPath: 'inset(0 0 0 0)' }
    : isPreview
      ? { x: direction * cardOffset * (isHovered ? 0.6 : 1), scale: isHovered ? 0.96 : 0.84, opacity: isHovered ? 1 : 0.5, filter: isHovered ? 'blur(0px) brightness(1.08)' : 'blur(4px) brightness(.72)', rotateY: direction * (isHovered ? 1 : 4), zIndex: isHovered ? 50 : 10, clipPath: isHovered ? 'inset(0 0 0 0)' : defaultPreviewMask, borderColor: isHovered ? 'rgba(165, 243, 252, .7)' : 'rgba(255, 255, 255, .10)', boxShadow: isHovered ? '0 22px 70px rgba(34, 211, 238, .24)' : '0 0 0 rgba(0, 0, 0, 0)' }
      : { x: direction * cardOffset * 1.72, scale: 0.72, opacity: 0, filter: 'blur(8px) brightness(.55)', rotateY: direction * 7, zIndex: 0, clipPath: 'inset(0 50% 0 50%)' }

  return (
    <motion.article
      initial={false}
      animate={motionState}
      transition={isPreview && isHovered ? { ...carouselSpring, clipPath: { duration: 0.16, ease: 'easeOut' } } : carouselSpring}
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.16}
      dragMomentum={false}
      onDrag={(_, info) => onDragProgress(info.offset.x)}
      onDragEnd={(_, info) => onDragEnd(info.offset.x, info.velocity.x)}
      onMouseEnter={() => isPreview && onHover(index)}
      onMouseLeave={() => isPreview && onHover(null)}
      onFocus={() => isPreview && onHover(index)}
      onBlur={() => isPreview && onHover(null)}
      onClick={() => isPreview && onSelect(index)}
      onKeyDown={(event) => { if (isPreview && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); onSelect(index) } }}
      tabIndex={isPreview ? 0 : -1}
      aria-hidden={isFar}
      className={`project-card group absolute left-1/2 top-0 w-[min(88vw,48rem)] -translate-x-1/2 overflow-hidden rounded-[1.75rem] border p-3 text-left ${isActive ? 'project-card--active cursor-grab border-cyan-200/30 shadow-[0_26px_80px_rgba(0,212,255,.16)] active:cursor-grabbing' : 'project-card--preview border-white/[.10] bg-[#0b0e18]/85'} ${isPreview ? 'cursor-pointer' : 'pointer-events-none'}`}
      style={isActive ? { touchAction: 'pan-y' } : undefined}
    >
      {isActive && <div className="project-card__active-backing" aria-hidden="true" />}
      <div className="project-card__content relative z-20">
        <div className={`relative aspect-[2.05] overflow-hidden rounded-[1.2rem] bg-[#111827] bg-gradient-to-br ${project.tone}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_20%,rgba(255,255,255,.25),transparent_24%),linear-gradient(135deg,transparent_35%,rgba(5,8,16,.6))]" />
          <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-black/20 font-mono text-[11px] tracking-widest text-white/80 backdrop-blur">{project.number}</span>
          <span className="absolute bottom-4 left-5 text-[10px] uppercase tracking-[.24em] text-white/70">Selected work</span>
          <div className="absolute inset-x-5 bottom-3 h-px bg-gradient-to-r from-cyan-100 via-white/80 to-transparent" />
        </div>
        <div className="relative px-3 pb-3 pt-5">
          <p className="text-[10px] uppercase tracking-[.22em] text-cyan-100/65">Проект {project.number} · Digital product</p>
          <h3 className="mt-2 text-2xl font-medium tracking-[-.035em] text-white sm:text-[1.7rem]">{project.title}</h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{project.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full border border-white/[.08] bg-white/[.055] px-3 py-1.5 text-[10px] font-medium tracking-wide text-zinc-200">{tag}</span>)}</div>
          {isActive && <button type="button" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-cyan-100 transition hover:text-white">Открыть кейс <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>}
        </div>
      </div>
    </motion.article>
  )
}

export function Projects() {
  const [activeProject, setActiveProject] = useState(0)
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(() => typeof window === 'undefined' ? 1280 : window.innerWidth)
  const previousProject = (activeProject - 1 + projects.length) % projects.length
  const nextProject = (activeProject + 1) % projects.length
  const changeProject = (direction: -1 | 1) => {
    setHoveredProject(null)
    setDragOffset(0)
    setActiveProject((current) => (current + direction + projects.length) % projects.length)
  }
  const showProject = (index: number) => {
    const forward = (index - activeProject + projects.length) % projects.length
    changeProject(forward === 0 ? 1 : forward <= projects.length / 2 ? 1 : -1)
  }
  const relativePosition = (index: number) => {
    const forward = (index - activeProject + projects.length) % projects.length
    return forward > projects.length / 2 ? forward - projects.length : forward
  }
  const cardOffset = Math.min(viewportWidth < 768 ? viewportWidth * 0.62 : viewportWidth * 0.36, 470)
  const cardWidth = Math.min(viewportWidth * (viewportWidth < 768 ? 0.9 : 0.88), 768)
  const dragProgress = Math.min(Math.abs(dragOffset) / 180, 1)
  const draggedTowards = dragOffset === 0 ? null : dragOffset < 0 ? nextProject : previousProject
  const updateHoveredProject = (clientX: number, stage: HTMLDivElement) => {
    if (viewportWidth < 768) return
    const bounds = stage.getBoundingClientRect()
    const offsetFromCenter = clientX - bounds.left - bounds.width / 2
    setHoveredProject(offsetFromCenter < -cardWidth / 2 ? previousProject : offsetFromCenter > cardWidth / 2 ? nextProject : null)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') changeProject(-1)
      if (event.key === 'ArrowRight') changeProject(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <section id="projects" className="relative overflow-visible px-5 py-28 sm:px-8 sm:py-32">
      <motion.div {...reveal} className="mx-auto max-w-6xl"><SectionHeading eyebrow="Selected work" title={<>Наши <span className="text-gradient">проекты</span></>} description="Идеи, которым мы придали форму, логику и заметный результат." /></motion.div>
      <motion.div {...reveal} className="project-stage mx-auto mt-12 w-full sm:mt-14">
        <div className="project-stage__halo" aria-hidden="true" />
        <div className="project-stage__viewport">
          <div className="project-stage__scene" onMouseMove={(event) => updateHoveredProject(event.clientX, event.currentTarget)} onMouseLeave={() => setHoveredProject(null)}>
            {projects.map((project, index) => {
              const position = relativePosition(index)
              const isDraggedPreview = draggedTowards === index && Math.abs(position) === 1
              return <ProjectCard key={project.number} index={index} position={position} cardOffset={cardOffset} cardWidth={cardWidth} isHovered={hoveredProject === index || isDraggedPreview} dimmed={hoveredProject !== null || (position === 0 && dragProgress > 0.04)} onHover={setHoveredProject} onSelect={showProject} onDragProgress={setDragOffset} onDragEnd={(offset, velocity) => { const direction = offset < 0 || velocity < -650 ? 1 : offset > 0 || velocity > 650 ? -1 : 0; if (Math.abs(offset) > 100 || Math.abs(velocity) > 650) changeProject(direction as -1 | 1); else setDragOffset(0) }} />
            })}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between gap-4 sm:mt-8">
          <div className="flex items-center gap-2" role="tablist" aria-label="Выбор проекта">{projects.map((project, index) => <button key={project.number} type="button" role="tab" onClick={() => showProject(index)} aria-label={`Показать проект ${index + 1}`} aria-selected={activeProject === index} className={`h-1.5 rounded-full transition-all duration-300 ${activeProject === index ? 'w-9 bg-cyan-200 shadow-[0_0_12px_rgba(165,243,252,.65)]' : 'w-1.5 bg-white/30 hover:bg-white/70'}`} />)}</div>
          <div className="flex items-center gap-2"><span className="mr-2 hidden font-mono text-[11px] tracking-[.16em] text-zinc-500 sm:inline">{String(activeProject + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span><button type="button" onClick={() => changeProject(-1)} className="project-nav-button" aria-label="Предыдущий проект"><ArrowLeft className="h-4 w-4" /></button><button type="button" onClick={() => changeProject(1)} className="project-nav-button" aria-label="Следующий проект"><ArrowRight className="h-4 w-4" /></button></div>
        </div>
      </motion.div>
    </section>
  )
}

/* function ProviderIcon({ provider }: { provider: 'yandex' | 'samsung' | 't' }) {
  if (provider === 'yandex') return <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fc3f1d] text-lg font-bold text-white">Я</span>
  if (provider === 'samsung') return <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#1428a0] text-xl text-white"><SiSamsung /></span>
  return <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffdd2d] text-xl font-bold text-black">Т</span>
}

function LegacyTechStack() {
  const certifications = [
    { title: 'Samsung Innovation Campus', provider: 'samsung' as const, documents: [{ label: 'Александр Дерендяев', url: '/certificates/samsung/derendyaev' }, { label: 'Виктор Мироненко', url: '/certificates/samsung/mironenko' }] },
    { title: 'Яндекс Лицей', provider: 'yandex' as const, documents: [{ label: 'Александр Дерендяев', url: 'https://lms.yandex.ru/certificate/check/?certNumber=2501190050&lastName=Дерендяев' }, { label: 'Виктор Мироненко', url: 'https://lms.yandex.ru/certificate/check/?certNumber=2502208312&lastName=Мироненко' }] },
    { title: 'Т-Образование', provider: 't' as const, courses: ['Алгоритмы и структуры данных', 'Android для начинающих'] },
  ]

  return <section id="stack" className="mx-auto max-w-6xl px-5 py-28 sm:px-8"><motion.div {...reveal}><SectionHeading eyebrow="Crafted with precision" title={<>Наш <span className="text-gradient">стек</span></>} description="Инструменты, которые станут основой для будущих продуктов и экспериментов." /></motion.div><div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{technologies.map((tech, i) => <motion.div key={tech} {...reveal} transition={{ duration: .45, delay: Math.min(i * .025, .35) }} className="group relative flex min-h-20 items-center overflow-hidden rounded-xl border border-white/10 bg-white/[.025] px-4 py-4 text-sm text-zinc-300 transition hover:scale-[1.025] hover:border-cyan-200/30 hover:bg-cyan-300/[.05] hover:text-white"><span className="transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-0"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-violet-400 transition group-hover:bg-cyan-300 group-hover:shadow-[0_0_9px_#00d4ff]" />{tech}</span><span className="pointer-events-none absolute inset-0 grid place-items-center translate-y-3 opacity-0 text-3xl text-cyan-100 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,.65)]"><TechnologyLogo name={tech} /></span></motion.div>)}</div><motion.div {...reveal} className="mt-16"><div className="mb-6 flex items-center gap-3"><GraduationCap className="h-5 w-5 text-cyan-200" /><h3 className="text-2xl font-medium tracking-[-0.03em] text-white">Сертифицированное образование</h3></div><div className="grid gap-3 md:grid-cols-3">{certifications.map((certification, i) => <motion.article key={certification.title} {...reveal} transition={{ duration: .45, delay: i * .08 }} className="flex min-h-48 flex-col justify-between rounded-2xl border border-white/10 bg-white/[.025] p-5 transition hover:border-cyan-200/30 hover:bg-cyan-300/[.05]"><div><ProviderIcon provider={certification.provider} /><h4 className="mt-4 text-base font-medium leading-6 text-white">{certification.title}</h4>{certification.courses && <ul className="mt-3 space-y-1.5 text-sm leading-5 text-zinc-400">{certification.courses.map(course => <li key={course}>— {course}</li>)}</ul>}</div>{certification.documents && <details className="group mt-5"><summary className="flex w-fit list-none items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-300/[.07] px-3 py-2 text-xs text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/20"><span>Проверить документы</span><ExternalLink className="h-3.5 w-3.5" /></summary><div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-black/20 p-3">{certification.documents.map(document => <a key={document.label} href={document.url} target={document.url.startsWith('http') ? '_blank' : undefined} rel={document.url.startsWith('http') ? 'noreferrer' : undefined} className="flex items-center justify-between gap-3 text-xs text-zinc-300 transition hover:text-cyan-100"><span>{document.label}</span><ExternalLink className="h-3.5 w-3.5 shrink-0" /></a>)}</div></details>}</motion.article>)}</div></motion.div></section>
} */

function LegacyTechStack() {
  const providers = [
    { title: 'Samsung Innovation Campus', logo: '/logos/education/samsung.svg', documentsUrl: '/certificates/samsung' },
    { title: 'Яндекс Лицей', logo: '/logos/education/yandex.svg', documentsUrl: '/certificates/yandex' },
    { title: 'Т-Образование', logo: '/logos/education/t-education.jpg', courses: ['Алгоритмы и структуры данных', 'Android для начинающих'] },
  ]
  return <section id="stack" className="mx-auto max-w-6xl px-5 py-28 sm:px-8"><motion.div {...reveal}><SectionHeading eyebrow="Crafted with precision" title={<>Наш <span className="text-gradient">стек</span></>} description="Инструменты, которые станут основой для будущих продуктов и экспериментов." /></motion.div><div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{technologies.map((tech, i) => <motion.div key={tech} {...reveal} transition={{ duration: .45, delay: Math.min(i * .025, .35) }} className="group relative flex min-h-20 items-center overflow-hidden rounded-xl border border-white/10 bg-white/[.025] px-4 py-4 text-sm text-zinc-300 transition hover:scale-[1.025] hover:border-cyan-200/30 hover:bg-cyan-300/[.05] hover:text-white"><span className="transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-0"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />{tech}</span><span className="pointer-events-none absolute inset-0 grid place-items-center translate-y-3 opacity-0 text-3xl text-cyan-100 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"><TechnologyLogo name={tech} /></span></motion.div>)}</div><motion.div {...reveal} className="mt-16"><div className="mb-6 flex items-center gap-3"><GraduationCap className="h-5 w-5 text-cyan-200" /><h3 className="text-2xl font-medium tracking-[-0.03em] text-white">Сертифицированное образование</h3></div><div className="grid gap-3 md:grid-cols-3">{providers.map((provider, i) => <motion.article key={provider.title} {...reveal} transition={{ duration: .45, delay: i * .08 }} className="relative flex min-h-48 flex-col justify-between rounded-2xl border border-white/10 bg-white/[.025] p-5 transition hover:border-cyan-200/30 hover:bg-cyan-300/[.05]"><span className="absolute left-5 top-5 h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_#8b5cf6]" /><img src={provider.logo} alt={`Логотип ${provider.title}`} className="mt-5 h-10 w-24 object-contain object-left" /><div><h4 className="text-base font-medium leading-6 text-white">{provider.title}</h4>{provider.courses && <ul className="mt-3 space-y-1.5 text-sm leading-5 text-zinc-400">{provider.courses.map(course => <li key={course}>— {course}</li>)}</ul>}</div>{provider.documentsUrl && <a href={provider.documentsUrl} className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/25 bg-cyan-300/[.07] px-3 py-2 text-xs text-cyan-100 transition hover:border-cyan-200/60 hover:bg-cyan-300/20">Проверить документы <ExternalLink className="h-3.5 w-3.5" /></a>}</motion.article>)}</div></motion.div></section>
}

function AllCategoriesTechStack() {
  return (
    <section id="stack" className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
      <motion.div {...reveal}>
        <SectionHeading
          eyebrow="Crafted with precision"
          title={<>Наш <span className="text-gradient">стек</span></>}
          description="Инструменты и подходы, которые используем для создания продуктов. Наведите курсор на технологию, чтобы увидеть её логотип."
        />
      </motion.div>

      <div className="mt-12 space-y-12">
        {technologyCategories.map((category, categoryIndex) => (
          <motion.div key={category.title} {...reveal} transition={{ duration: .45, delay: Math.min(categoryIndex * .06, .35) }}>
            <h3 className="mb-5 text-lg font-medium tracking-[-.02em] text-white sm:text-xl">{category.title}</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {category.technologies.map((tech, index) => (
                <motion.div
                  key={`${category.title}-${tech}`}
                  {...reveal}
                  transition={{ duration: .4, delay: Math.min(index * .02, .25) }}
                  className="group relative flex min-h-20 items-center overflow-hidden rounded-xl border border-white/10 bg-white/[.025] px-4 py-4 text-sm text-zinc-300 transition hover:scale-[1.025] hover:border-cyan-200/30 hover:bg-cyan-300/[.05] hover:text-white"
                >
                  <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-0">
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-violet-400 transition group-hover:bg-cyan-300 group-hover:shadow-[0_0_9px_#00d4ff]" />
                    {tech}
                  </span>
                  <span className="pointer-events-none absolute inset-0 grid place-items-center translate-y-3 opacity-0 text-3xl text-cyan-100 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,.65)]">
                    <TechnologyLogo name={tech} />
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export function TechStack() {
  const [activeCategoryTitle, setActiveCategoryTitle] = useState<string>(technologyCategories[0].title)
  const activeCategory = technologyCategories.find(category => category.title === activeCategoryTitle) ?? technologyCategories[0]

  return (
    <section id="stack" className="mx-auto max-w-6xl px-5 py-28 sm:px-8">
      <motion.div {...reveal}>
        <SectionHeading
          eyebrow="Crafted with precision"
          title={<>Наш <span className="text-gradient">стек</span></>}
          description="Ключевые технологии команды и полный стек по направлениям."
        />
      </motion.div>

      <motion.div {...reveal} className="mt-12">
        <h3 className="mb-5 text-lg font-medium tracking-[-.02em] text-white sm:text-xl">Основные технологии</h3>
        <div className="technology-marquee group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="technology-marquee-track flex w-max gap-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[...primaryTechnologies, ...primaryTechnologies].map((tech, index) => <article key={`${tech}-${index}`} aria-hidden={index >= primaryTechnologies.length} className="flex min-w-60 items-center gap-4 rounded-full border border-white/10 bg-gradient-to-r from-white/[.055] to-transparent px-5 py-4 transition hover:border-violet-300/40"><span className="h-2 w-2 shrink-0 rounded-full bg-violet-400 shadow-[0_0_13px_#8b5cf6]" /><span className="text-3xl text-cyan-100"><TechnologyLogo name={tech} /></span><span className="h-6 w-px bg-white/15" /><span className="min-w-0 text-sm text-zinc-200">{tech}</span></article>)}
          </div>
        </div>
      </motion.div>

      <motion.div {...reveal} className="mt-14">
        <div className="flex flex-wrap gap-2">
          {technologyCategories.map(category => {
            const isActive = category.title === activeCategory.title
            return <button key={category.title} type="button" onClick={() => setActiveCategoryTitle(category.title)} aria-pressed={isActive} className={`rounded-full border px-4 py-2 text-sm transition ${isActive ? 'border-cyan-200/60 bg-cyan-300/15 text-cyan-100 shadow-[0_0_18px_rgba(0,212,255,.14)]' : 'border-white/10 bg-white/[.025] text-zinc-400 hover:border-violet-200/35 hover:bg-white/[.06] hover:text-white'}`}>{category.title}</button>
          })}
        </div>

        <motion.div key={activeCategory.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }} className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {activeCategory.technologies.map(tech => (
            <div key={tech} className="group relative flex min-h-20 items-center overflow-hidden rounded-xl border border-white/10 bg-white/[.025] px-4 py-4 text-sm text-zinc-300 transition hover:scale-[1.025] hover:border-cyan-200/30 hover:bg-cyan-300/[.05] hover:text-white">
              <span className="transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-0"><span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-violet-400 transition group-hover:bg-cyan-300 group-hover:shadow-[0_0_9px_#00d4ff]" />{tech}</span>
              <span className="pointer-events-none absolute inset-0 grid place-items-center translate-y-3 opacity-0 text-3xl text-cyan-100 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,.65)]"><TechnologyLogo name={tech} /></span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

export function Events() {
  return <section id="events" className="mx-auto max-w-6xl px-5 py-28 sm:px-8"><motion.div {...reveal}><SectionHeading eyebrow="In motion" title={<>Мероприятия и <span className="text-gradient">события</span></>} /></motion.div><div className="mt-12 border-l border-white/10 pl-6 sm:pl-10">{events.map((event, i) => <motion.article key={event.slug} {...reveal} transition={{ duration: .6, delay: i * .1 }} className="relative mb-10 last:mb-0"><span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-[#05060a] bg-cyan-300 shadow-[0_0_14px_#00d4ff] sm:-left-[47px]" /><p className="font-mono text-xs tracking-wider text-cyan-200/70">{event.date}</p><Link to={`/events/${event.slug}`} className="group mt-3 block rounded-2xl border border-white/10 bg-white/[.025] p-5 transition hover:border-violet-300/30 hover:bg-white/[.04] focus:outline-none focus:ring-2 focus:ring-cyan-300/70"><h3 className="text-lg font-medium text-white">{event.title}</h3>{(event.summary || event.subtitle) && <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{event.summary || event.subtitle}</p>}<span className="mt-4 inline-flex items-center gap-2 text-sm text-violet-200">Подробнее <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span></Link></motion.article>)}</div></section>
}

export function ProjectRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [requestType, setRequestType] = useState<'idea' | 'help'>('idea')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!open) return
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [open])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const contacts = ['phone', 'email', 'telegram'].map((name) => form.elements.namedItem(name) as HTMLInputElement | null)
    const hasContact = contacts.some((field) => field?.value.trim())
    contacts.forEach((field) => field?.setCustomValidity(hasContact ? '' : 'Укажите хотя бы один способ связи.'))

    if (!form.checkValidity()) return

    const data = new FormData(form)
    const services = data.getAll('services').filter((value): value is string => typeof value === 'string')
    const emptyToNull = (value: FormDataEntryValue | null) => {
      if (typeof value !== 'string') return null
      const trimmed = value.trim()
      return trimmed || null
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      const { createApplication } = await import('@/lib/api')
      await createApplication({
        request_type: requestType,
        project_name: emptyToNull(data.get('projectName')),
        organization: emptyToNull(data.get('organization')),
        idea: emptyToNull(data.get('idea')),
        services,
        other_service: emptyToNull(data.get('otherService')),
        challenge: emptyToNull(data.get('challenge')),
        phone: emptyToNull(data.get('phone')),
        email: emptyToNull(data.get('email')),
        telegram: emptyToNull(data.get('telegram')),
      })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Не удалось отправить заявку')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6" role="dialog" aria-modal="true" aria-labelledby="request-title" onMouseDown={onClose}>
      <div data-lenis-prevent className="request-modal-scroll relative max-h-[90svh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-[1.75rem] border border-white/10 bg-[#090b11] p-5 shadow-2xl sm:p-7" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Закрыть заявку" className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-cyan-200/40 hover:text-white"><X className="h-5 w-5" /></button>
        <div className="max-w-2xl pr-12">
        <p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Оставить заявку</p>
        <h2 id="request-title" className="mt-3 text-3xl font-semibold tracking-[-.05em] text-white sm:text-4xl">Давайте обсудим ваш будущий проект</h2>
        <p className="mt-4 text-sm leading-6 text-zinc-400 sm:text-base">Выберите подходящий формат — детали можно уточнить позже.</p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => { setRequestType('idea'); setSubmitted(false); setSubmitError('') }} aria-pressed={requestType === 'idea'} className={`rounded-2xl border p-5 text-left transition ${requestType === 'idea' ? 'border-cyan-200/50 bg-cyan-300/[.08]' : 'border-white/10 bg-white/[.025] hover:border-white/25'}`}>
          <span className="text-base font-medium text-white">У меня есть идея</span>
          <span className="mt-2 block text-sm leading-5 text-zinc-400">Знаю, что хочу создать, и готов рассказать о проекте.</span>
        </button>
        <button type="button" onClick={() => { setRequestType('help'); setSubmitted(false); setSubmitError('') }} aria-pressed={requestType === 'help'} className={`rounded-2xl border p-5 text-left transition ${requestType === 'help' ? 'border-cyan-200/50 bg-cyan-300/[.08]' : 'border-white/10 bg-white/[.025] hover:border-white/25'}`}>
          <span className="text-base font-medium text-white">Нужна помощь с идеей</span>
          <span className="mt-2 block text-sm leading-5 text-zinc-400">Есть задача или желание сделать что-то новое, но пока без точного решения.</span>
        </button>
      </div>

      <form onSubmit={submit} className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/[.025] p-5 sm:p-7">
        {requestType === 'idea' ? <div className="grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2"><span className="text-sm text-zinc-300">Название проекта</span><input name="projectName" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50" placeholder="Например, сервис доставки" /></label>
          <label className="md:col-span-2"><span className="text-sm text-zinc-300">Чем занимается организация</span><input name="organization" required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50" placeholder="Коротко расскажите о вашей сфере" /></label>
          <label className="md:col-span-2"><span className="text-sm text-zinc-300">Опишите идею</span><textarea name="idea" required rows={5} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50" placeholder="Какую задачу должен решать проект?" /></label>
          <fieldset className="md:col-span-2"><legend className="text-sm text-zinc-300">Что вам нужно?</legend><div className="mt-3 flex flex-wrap gap-2">{['Сайт', 'Мобильное приложение', 'Telegram-бот', 'Telegram Mini App', 'Desktop-приложение', 'Робототехника'].map((service) => <label key={service} className="cursor-pointer rounded-full border border-white/10 px-3 py-2 text-sm text-zinc-300 transition has-[:checked]:border-cyan-200/50 has-[:checked]:bg-cyan-300/10 has-[:checked]:text-cyan-100"><input type="checkbox" name="services" value={service} className="sr-only" />{service}</label>)}</div><input name="otherService" className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50" placeholder="Другое — напишите, что требуется" /></fieldset>
        </div> : <div className="grid gap-5"><label><span className="text-sm text-zinc-300">Расскажите, что вам хотелось бы сделать или какую задачу решить</span><textarea name="challenge" required rows={5} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50" placeholder="Например, хочу улучшить работу с клиентами, но пока не понимаю, какой продукт нужен" /></label><label><span className="text-sm text-zinc-300">Чем занимается организация — если она уже есть</span><input name="organization" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50" placeholder="Сфера, аудитория или краткий контекст" /></label></div>}

        <fieldset className="mt-7 border-t border-white/10 pt-6"><legend className="text-sm text-zinc-300">Как с вами связаться? <span className="text-zinc-500">Заполните хотя бы одно поле</span></legend><div className="mt-3 grid gap-3 md:grid-cols-3"><input name="phone" type="tel" onInput={(event) => event.currentTarget.setCustomValidity('')} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50" placeholder="Телефон" /><input name="email" type="email" onInput={(event) => event.currentTarget.setCustomValidity('')} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50" placeholder="Почта" /><input name="telegram" onInput={(event) => event.currentTarget.setCustomValidity('')} className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50" placeholder="Telegram" /></div></fieldset>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={submitting || submitted}>{submitting ? 'Отправка…' : 'Отправить заявку'}</Button>
          {submitted && <p className="text-sm text-cyan-100">Спасибо! Заявка заполнена — мы свяжемся с вами по указанному контакту.</p>}
          {submitError && <p className="text-sm text-rose-300">{submitError}</p>}
        </div>
      </form>
      </div>
    </div>
  )
}

export function Footer({ onOpenRequest }: { onOpenRequest: () => void }) {
  return (
    <footer id="contacts" className="border-t border-white/10 px-5 py-14 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center gap-3 text-3xl font-semibold tracking-[-.05em] text-white sm:text-4xl">
              <span>Связаться с нами</span>
              <ChevronDown className="h-6 w-6 text-cyan-200 transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">Все вопросы ведёт наш менеджер. Напишите ему напрямую или оставьте заявку на сайте — мы свяжемся с вами и обсудим ваш проект.</p>
          </details>
          <a className="mt-5 inline-block text-zinc-400 transition hover:text-white" href="mailto:mail@suyakov.ru">mail@suyakov.ru</a>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <button type="button" onClick={onOpenRequest} className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-cyan-200 to-violet-300 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-[0_0_28px_rgba(139,92,246,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(0,212,255,.38)]"><span>Оставить заявку</span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></button>
          <a href="https://t.me/suyakov_egor" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 rounded-full border border-cyan-200/35 bg-cyan-300/[.08] px-5 py-3 text-sm font-medium text-cyan-100 transition hover:border-cyan-200/70 hover:bg-cyan-300/[.16]"><Send className="h-5 w-5" />Написать в Telegram<span className="text-cyan-200/65">@suyakov_egor</span></a>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-5 text-xs text-zinc-600">© {new Date().getFullYear()} HATOMS. Создаём цифровые продукты, которые решают задачи.</div>
    </footer>
  )
}
