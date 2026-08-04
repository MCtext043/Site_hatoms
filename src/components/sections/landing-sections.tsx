import { ArrowRight, ExternalLink, GitBranch, GraduationCap, Mail, Send, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { events, primaryTechnologies, projects, technologies, technologyCategories } from '@/constants/content'
import { Button, SectionHeading } from '@/components/ui/primitives'
import { TechnologyLogo } from '@/components/ui/technology-logo'
import teamLogo from '@/assets/hatoms-wordmark.png'

const reveal = { initial: { opacity: 0, y: 24, filter: 'blur(8px)' }, whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' }, viewport: { once: true, amount: 0.2 }, transition: { duration: 0.7 } }

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
          <div className="absolute inset-[15%] grid place-items-center"><img src={teamLogo} alt="Логотип команды Hatoms" className="h-full w-full object-contain drop-shadow-[0_0_35px_rgba(124,58,237,.45)]" /></div>
          <div className="absolute left-0 top-1/3 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-cyan-100 backdrop-blur-md">Build / 01</div>
          <div className="absolute bottom-1/4 right-0 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 text-xs text-violet-100 backdrop-blur-md">Future ready</div>
        </motion.div>
      </div>
    </section>
  )
}

export function Projects() {
  return <section id="projects" className="mx-auto max-w-6xl px-5 py-32 sm:px-8"><motion.div {...reveal}><SectionHeading eyebrow="Selected work" title={<>Наши <span className="text-gradient">проекты</span></>} description="Идеи, которым мы придали форму, логику и заметный результат." /></motion.div><div className="mt-14 grid gap-5 md:grid-cols-3">{projects.map((project, i) => <motion.article key={project.number} {...reveal} transition={{ duration: .65, delay: i * .08 }} className="group overflow-hidden rounded-[1.75rem] border border-white/[.09] bg-white/[.035] p-3 transition duration-500 hover:-translate-y-2 hover:border-violet-200/30 hover:bg-white/[.06]"><div className={`relative aspect-[1.08] overflow-hidden rounded-[1.25rem] bg-gradient-to-br ${project.tone}`}><span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/25 font-mono text-xs text-white/75 backdrop-blur">{project.number}</span><div className="absolute inset-x-6 bottom-6 h-px origin-left bg-white/70 transition duration-500 group-hover:scale-x-150" /></div><div className="px-3 pb-3 pt-6"><h3 className="text-xl font-medium text-white">{project.title}</h3><p className="mt-3 text-sm leading-6 text-zinc-400">{project.description}</p><div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag => <span key={tag} className="rounded-full bg-white/[.06] px-3 py-1.5 text-[11px] text-zinc-300">{tag}</span>)}</div><button className="mt-7 flex items-center gap-2 text-sm font-medium text-[#c8fff4]">Открыть кейс <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></button></div></motion.article>)}</div></section>
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {primaryTechnologies.map(tech => (
            <div key={tech} className="group relative flex min-h-20 items-center justify-center overflow-hidden rounded-xl border border-cyan-200/20 bg-cyan-300/[.045] px-3 py-4 text-center text-sm text-zinc-200 transition hover:scale-[1.025] hover:border-cyan-200/50 hover:bg-cyan-300/[.1] hover:text-white">
              <span className="transition-all duration-300 group-hover:translate-y-2 group-hover:opacity-0">{tech}</span>
              <span className="pointer-events-none absolute inset-0 grid place-items-center translate-y-3 opacity-0 text-3xl text-cyan-100 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgba(0,212,255,.65)]"><TechnologyLogo name={tech} /></span>
            </div>
          ))}
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

export function Footer() {
  return <footer id="contacts" className="border-t border-white/10 px-5 py-14 sm:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-end md:justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Let’s make an impact</p><h2 className="mt-3 text-3xl font-semibold tracking-[-.05em] text-white">Placeholder contact.</h2><a className="mt-5 inline-block text-zinc-400 transition hover:text-white" href="mailto:hello@example.com">hello@example.com</a></div><div className="flex gap-3">{[{ icon: Send, label: 'Telegram' }, { icon: GitBranch, label: 'GitHub' }, { icon: Mail, label: 'Email' }].map(({ icon: Icon, label }) => <a key={label} href="#contacts" aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-cyan-200/40 hover:bg-cyan-300/10 hover:text-cyan-100"><Icon className="h-4 w-4" /></a>)}</div></div><div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-5 text-xs text-zinc-600">© {new Date().getFullYear()} HATOMS. Placeholder portfolio.</div></footer>
}
