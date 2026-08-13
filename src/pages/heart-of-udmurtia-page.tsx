import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Images, Layers3, MapPinned, MonitorPlay, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDialogFocusTrap } from '@/hooks/use-dialog-focus-trap'

const figmaUrl = 'https://www.figma.com/design/W4ibJ1CC8pT5rEqZ5FdxzU/Heart_of_UDM?node-id=0-1&p=f&t=pgWnfg5Es8AuReic-0'
const projectSiteUrl = 'https://hearthofudmurtia.tilda.ws/page18000'
const screencast = Array.from({ length: 14 }, (_, index) => `/projects/heart-udm/screencast/screen-${String(index + 1).padStart(2, '0')}.webp`)
const presentation = Array.from({ length: 27 }, (_, index) => `/projects/heart-udm/presentation/slide-${String(index + 1).padStart(2, '0')}.webp`)
const technologies = [
  { label: 'Android', value: 'Kotlin', detail: 'Нативное Android-приложение' },
  { label: 'iOS', value: 'Swift', detail: 'Нативное iOS-приложение' },
  { label: 'Backend', value: 'FastAPI', detail: 'API и серверная логика' },
] as const
const publications = [
  { source: 'Правительство Удмуртии', title: 'Школьная команда «Хатомс» представила свои ИТ-проекты главе Удмуртии', url: 'https://udmurt.ru/press_center/news/shkolnaya-komanda-khatoms-predstavila-svoi-it-proekty-glave-udmurtii-aleksandru-brechalovu/' },
  { source: 'РИА Новости', title: 'Школьники из Удмуртии представили собственные ИТ-разработки', url: 'https://ria.ru/20260331/shkolniki-2084112402.html?ysclid=mnhtk90pcr130038826' },
] as const
const gallery = [
  { type: 'image', src: '/projects/heart-udm/gallery/meeting-01.webp', alt: 'Презентация проекта на встрече' },
  { type: 'image', src: '/projects/heart-udm/gallery/meeting-02.webp', alt: 'Команда проекта на встрече' },
  { type: 'image', src: '/projects/heart-udm/gallery/meeting-03.webp', alt: 'Команда Hatoms с презентацией приложения' },
  { type: 'image', src: '/projects/heart-udm/gallery/meeting-04.webp', alt: 'Команда проекта на групповой фотографии' },
  { type: 'video', src: '/projects/heart-udm/gallery/project-demo.mp4', alt: 'Видео с презентации проекта' },
] as const

type GalleryKind = 'screencast' | 'presentation' | 'gallery'

function ArrowButton({ direction, onClick, label, disabled = false }: { direction: 'left' | 'right', onClick: () => void, label: string, disabled?: boolean }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  return <button type="button" onClick={(event) => { event.stopPropagation(); onClick() }} disabled={disabled} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-black/25 text-white transition hover:border-cyan-200/70 hover:bg-cyan-300/10 disabled:cursor-default disabled:opacity-20" aria-label={label}><Icon className="h-7 w-7" /></button>
}

export default function HeartOfUdmurtiaPage() {
  const navigate = useNavigate()
  const [screencastSlide, setScreencastSlide] = useState(0)
  const [presentationSlide, setPresentationSlide] = useState(0)
  const [lightbox, setLightbox] = useState<{ type: GalleryKind, index: number } | null>(null)
  useDialogFocusTrap(Boolean(lightbox))
  const previous = (value: number, length: number) => (value - 1 + length) % length
  const next = (value: number, length: number) => (value + 1) % length
  const previousScreencastSlide = screencastSlide > 0 ? screencastSlide - 1 : null
  const nextScreencastSlide = screencastSlide < screencast.length - 1 ? screencastSlide + 1 : null
  const goToPreviousScreencastSlide = () => setScreencastSlide((current) => Math.max(0, current - 1))
  const goToNextScreencastSlide = () => setScreencastSlide((current) => Math.min(screencast.length - 1, current + 1))
  const lightboxSlides = lightbox?.type === 'screencast' ? screencast : presentation

  useEffect(() => {
    if (!lightbox) return
    const handleKeyDown = (event: KeyboardEvent) => {
      const length = lightbox.type === 'screencast' ? screencast.length : lightbox.type === 'presentation' ? presentation.length : gallery.length
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowLeft') setLightbox((current) => current ? { ...current, index: previous(current.index, length) } : null)
      if (event.key === 'ArrowRight') setLightbox((current) => current ? { ...current, index: next(current.index, length) } : null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightbox])

  const moveLightbox = (direction: -1 | 1) => setLightbox((current) => {
    if (!current) return null
    const length = current.type === 'screencast' ? screencast.length : current.type === 'presentation' ? presentation.length : gallery.length
    return { ...current, index: direction === -1 ? previous(current.index, length) : next(current.index, length) }
  })

  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
    <button type="button" onClick={() => navigate('/', { state: { scrollTo: 'projects' } })} className="inline-flex items-center gap-2 text-sm text-white transition hover:text-white/75"><ArrowLeft className="h-4 w-4" />Вернуться к проектам</button>
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="mt-10">
      <p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Mobile product · Travel tech</p>
      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="max-w-4xl text-4xl font-semibold tracking-[-.05em] text-white sm:text-6xl">Сердце Удмуртии</h1><p className="mt-5 max-w-3xl text-lg leading-7 text-zinc-300">Цифровой навигатор для туристов: интересные места, готовые маршруты, события и аудиогид в одном мобильном приложении.</p></div>
        <div className="flex shrink-0 flex-wrap gap-2"><a href={projectSiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200/25 bg-violet-300/[.08] px-4 py-3 text-sm font-medium text-violet-100 transition hover:-translate-y-0.5 hover:border-violet-200/60 hover:bg-violet-300/[.14]">Сайт проекта <ExternalLink className="h-4 w-4" /></a><a href={figmaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200/25 bg-cyan-300/[.08] px-4 py-3 text-sm font-medium text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-200/60 hover:bg-cyan-300/[.14]">Открыть Figma <ExternalLink className="h-4 w-4" /></a></div>
      </div>

      <section className="mt-16" aria-labelledby="screencast-heading">
        <div className="flex items-center gap-3"><MonitorPlay className="h-5 w-5 text-cyan-200" /><div><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Интерфейс приложения</p><h2 id="screencast-heading" className="mt-1 text-2xl font-medium text-white">Скринкаст</h2></div></div>
        <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-300/[.08] via-[#11131c] to-violet-500/[.12] px-4 py-6 sm:px-12 sm:py-10"><div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_center,rgba(0,212,255,.16),transparent_52%)]" /><div className="relative flex flex-col items-center"><div className="grid w-full grid-cols-[auto_auto_auto_auto_auto] items-center justify-center gap-5 md:gap-8 lg:gap-[60px]"><ArrowButton direction="left" onClick={goToPreviousScreencastSlide} label="Предыдущий экран" disabled={previousScreencastSlide === null} />{previousScreencastSlide === null ? <div className="hidden w-[min(20vw,205px)] md:block" aria-hidden="true" /> : <button type="button" onClick={() => setScreencastSlide(previousScreencastSlide)} aria-label={`Показать предыдущий экран ${previousScreencastSlide + 1}`} className="group hidden w-[min(20vw,205px)] overflow-hidden rounded-[1.7rem] border-4 border-zinc-700 bg-zinc-900 p-1.5 shadow-[0_16px_45px_rgba(0,0,0,.35)] transition hover:-translate-y-1 hover:border-cyan-200/50 md:block"><span className="mx-auto mb-1.5 block h-1 w-10 rounded-full bg-zinc-600" /><img src={screencast[previousScreencastSlide]} alt="Предпросмотр предыдущего экрана" className="block w-full rounded-[1.15rem] bg-black opacity-55 brightness-50 saturate-50 transition duration-300 group-hover:opacity-85 group-hover:brightness-75" /></button>}<button type="button" onClick={() => setLightbox({ type: 'screencast', index: screencastSlide })} className="group rounded-[2rem] border-[6px] border-zinc-700 bg-zinc-900 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.5)] transition hover:-translate-y-1 hover:border-cyan-200/70 focus:outline-none focus:ring-2 focus:ring-cyan-300"><span className="mx-auto mb-1.5 block h-1 w-12 rounded-full bg-zinc-600" /><img src={screencast[screencastSlide]} alt={`Экран мобильного приложения ${screencastSlide + 1}`} className="block w-[min(52vw,225px)] rounded-[1.45rem] bg-black transition duration-500 group-hover:scale-[1.015]" /></button>{nextScreencastSlide === null ? <div className="hidden w-[min(20vw,205px)] md:block" aria-hidden="true" /> : <button type="button" onClick={() => setScreencastSlide(nextScreencastSlide)} aria-label={`Показать следующий экран ${nextScreencastSlide + 1}`} className="group hidden w-[min(20vw,205px)] overflow-hidden rounded-[1.7rem] border-4 border-zinc-700 bg-zinc-900 p-1.5 shadow-[0_16px_45px_rgba(0,0,0,.35)] transition hover:-translate-y-1 hover:border-cyan-200/50 md:block"><span className="mx-auto mb-1.5 block h-1 w-10 rounded-full bg-zinc-600" /><img src={screencast[nextScreencastSlide]} alt="Предпросмотр следующего экрана" className="block w-full rounded-[1.15rem] bg-black opacity-55 brightness-50 saturate-50 transition duration-300 group-hover:opacity-85 group-hover:brightness-75" /></button>}<ArrowButton direction="right" onClick={goToNextScreencastSlide} label="Следующий экран" disabled={nextScreencastSlide === null} /></div><div className="mt-6 flex items-center gap-3"><div className="flex max-w-48 flex-wrap justify-center gap-1.5">{screencast.map((image, index) => <button key={image} type="button" onClick={() => setScreencastSlide(index)} aria-label={`Показать экран ${index + 1}`} className={`h-1.5 rounded-full transition-all ${screencastSlide === index ? 'w-6 bg-cyan-200' : 'w-1.5 bg-white/30 hover:bg-white/70'}`} />)}</div><span className="text-xs text-zinc-400">{screencastSlide + 1} / {screencast.length}</span></div><p className="mt-3 text-sm text-zinc-400">Нажмите на экран, чтобы открыть его полностью</p></div></div>
      </section>

      <section className="mt-20" aria-labelledby="technology-heading"><div className="flex items-center gap-3"><Layers3 className="h-5 w-5 text-violet-200" /><div><p className="text-xs uppercase tracking-[.2em] text-violet-200/70">Разработка</p><h2 id="technology-heading" className="mt-1 text-2xl font-medium text-white">Программное обеспечение</h2></div></div><div className="mt-6 grid gap-3 md:grid-cols-3">{technologies.map((technology) => <article key={technology.label} className="rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:-translate-y-1 hover:border-cyan-200/30 hover:bg-cyan-300/[.045]"><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">{technology.label}</p><h3 className="mt-3 text-2xl font-medium text-white">{technology.value}</h3><p className="mt-1 text-sm leading-6 text-zinc-400">{technology.detail}</p></article>)}</div></section>

      <section className="mt-20" aria-labelledby="presentation-heading"><div className="flex items-center gap-3"><Images className="h-5 w-5 text-cyan-200" /><div><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Проект команды</p><h2 id="presentation-heading" className="mt-1 text-2xl font-medium text-white">Презентация</h2></div></div><div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-300/[.08] via-[#11131c] to-violet-500/[.12] px-4 py-6 sm:px-12 sm:py-10"><div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_center,rgba(0,212,255,.16),transparent_52%)]" /><div className="relative flex items-center justify-center gap-3 sm:gap-8"><ArrowButton direction="left" onClick={() => setPresentationSlide((current) => previous(current, presentation.length))} label="Предыдущий слайд" /><button type="button" onClick={() => setLightbox({ type: 'presentation', index: presentationSlide })} className="group w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,.45)] focus:outline-none focus:ring-2 focus:ring-cyan-300"><img src={presentation[presentationSlide]} alt={`Презентация проекта, слайд ${presentationSlide + 1}`} className="block aspect-video w-full object-contain transition duration-500 group-hover:scale-[1.015]" /></button><ArrowButton direction="right" onClick={() => setPresentationSlide((current) => next(current, presentation.length))} label="Следующий слайд" /></div><div className="relative mt-6 flex items-center justify-center"><span className="text-xs text-zinc-400">Слайд {presentationSlide + 1} / {presentation.length}</span></div></div></section>

      <section className="mt-20" aria-labelledby="press-heading"><div className="flex items-center gap-3"><ExternalLink className="h-5 w-5 text-violet-200" /><div><p className="text-xs uppercase tracking-[.2em] text-violet-200/70">Медиа</p><h2 id="press-heading" className="mt-1 text-2xl font-medium text-white">Официальные публикации</h2></div></div><div className="mt-6 grid gap-3 md:grid-cols-2">{publications.map((publication) => <a key={publication.url} href={publication.url} target="_blank" rel="noreferrer" className="group rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-cyan-300/[.05]"><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">{publication.source}</p><h3 className="mt-3 text-base font-medium leading-6 text-white transition group-hover:text-cyan-100">{publication.title}</h3><span className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-400 transition group-hover:text-cyan-100">Открыть публикацию <ExternalLink className="h-4 w-4" /></span></a>)}</div></section>

      <section className="mt-20 pb-12" aria-labelledby="gallery-heading"><div className="flex items-center gap-3"><MapPinned className="h-5 w-5 text-cyan-200" /><div><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Команда и разработка</p><h2 id="gallery-heading" className="mt-1 text-2xl font-medium text-white">Фотогалерея</h2></div></div><div className="mt-6 grid auto-rows-[190px] gap-3 sm:grid-cols-2 sm:auto-rows-[250px] md:grid-cols-3">{gallery.map((item, index) => <button key={item.src} type="button" onClick={() => setLightbox({ type: 'gallery', index })} className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.03] text-left focus:outline-none focus:ring-2 focus:ring-violet-300 ${index === 0 ? 'md:col-span-2' : ''}`}><>{item.type === 'video' ? <video src={item.src} muted preload="metadata" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <img src={item.src} alt={item.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}</><span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" /><span className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-4 pb-3 text-sm text-white/90">{item.type === 'video' && <MonitorPlay className="h-4 w-4 text-cyan-200" />}{item.type === 'video' ? 'Открыть видео' : 'Открыть фото'}</span></button>)}</div></section>
    </motion.article>

    {lightbox && <div role="dialog" aria-modal="true" aria-label="Полноэкранный просмотр" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setLightbox(null)}><button type="button" onClick={(event) => { event.stopPropagation(); setLightbox(null) }} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20" aria-label="Закрыть просмотр"><X className="h-5 w-5" /></button><ArrowButton direction="left" onClick={() => moveLightbox(-1)} label="Предыдущий элемент" /><div onClick={(event) => event.stopPropagation()}>{lightbox.type === 'gallery' && gallery[lightbox.index].type === 'video' ? <video controls autoPlay playsInline preload="metadata" className="mx-4 max-h-[86svh] max-w-[78vw] rounded-2xl bg-black shadow-2xl"><source src={gallery[lightbox.index].src} type="video/mp4" />Ваш браузер не поддерживает видео.</video> : <img src={lightbox.type === 'gallery' ? gallery[lightbox.index].src : lightboxSlides[lightbox.index]} alt={lightbox.type === 'gallery' ? gallery[lightbox.index].alt : 'Материалы проекта Сердце Удмуртии'} className="mx-4 max-h-[86svh] max-w-[78vw] rounded-2xl object-contain shadow-2xl" />}</div><ArrowButton direction="right" onClick={() => moveLightbox(1)} label="Следующий элемент" /></div>}
  </main>
}
