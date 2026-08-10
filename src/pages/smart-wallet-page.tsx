import { ArrowLeft, ChevronLeft, ChevronRight, Code2, ExternalLink, FileText, MapPinned, MonitorPlay, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDialogFocusTrap } from '@/hooks/use-dialog-focus-trap'

const figmaUrl = 'https://www.figma.com/design/AJwgIoGWhr0TGnjoakth3O/Smart-Wallet-кейс-чемпионат-?node-id=235-317&t=oJK4tn3ovSmpo3KN-0'
const githubUrl = 'https://github.com/hilyyx/SmartWallet'
const publicationUrl = 'https://udmurt.ru/press_center/news/shkolnaya-komanda-khatoms-predstavila-svoi-it-proekty-glave-udmurtii-aleksandru-brechalovu/'
const screens = Array.from({ length: 10 }, (_, index) => `/projects/smart-wallet/screencast/screen-${String(index + 1).padStart(2, '0')}.webp`)
const presentation = Array.from({ length: 13 }, (_, index) => `/projects/smart-wallet/presentation/slide-${String(index + 1).padStart(2, '0')}.webp`)
const gallery = [
  { type: 'image', src: '/projects/smart-wallet/gallery/meeting-01.webp', alt: 'Презентация проекта на встрече' },
  { type: 'image', src: '/projects/smart-wallet/gallery/meeting-02.webp', alt: 'Команда проекта на встрече' },
  { type: 'image', src: '/projects/smart-wallet/gallery/meeting-03.webp', alt: 'Команда Hatoms с презентацией приложения' },
  { type: 'image', src: '/projects/smart-wallet/gallery/meeting-04.webp', alt: 'Команда проекта на групповой фотографии' },
  { type: 'video', src: '/projects/smart-wallet/gallery/project-demo.mp4', alt: 'Видео с презентации проекта' },
  { type: 'image', src: '/projects/smart-wallet/gallery/team.webp', alt: 'Команда Hatoms' },
] as const

type LightboxItem = { kind: 'screen' | 'presentation' | 'gallery', index: number }

function ArrowButton({ direction, onClick, label }: { direction: 'left' | 'right', onClick: () => void, label: string }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  return <button type="button" onClick={(event) => { event.stopPropagation(); onClick() }} aria-label={label} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-black/25 text-white transition hover:border-lime-200/70 hover:bg-lime-300/10"><Icon className="h-6 w-6" /></button>
}

export default function SmartWalletPage() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState(0)
  const [presentationSlide, setPresentationSlide] = useState(0)
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null)
  useDialogFocusTrap(Boolean(lightbox))
  const previous = (value: number, length: number) => (value - 1 + length) % length
  const next = (value: number, length: number) => (value + 1) % length
  const getLength = (kind: LightboxItem['kind']) => kind === 'screen' ? screens.length : kind === 'presentation' ? presentation.length : gallery.length
  const lightboxLength = lightbox ? getLength(lightbox.kind) : 0

  useEffect(() => {
    if (!lightbox) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowLeft') setLightbox((current) => current ? { ...current, index: previous(current.index, lightboxLength) } : null)
      if (event.key === 'ArrowRight') setLightbox((current) => current ? { ...current, index: next(current.index, lightboxLength) } : null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox, lightboxLength])

  const moveLightbox = (direction: -1 | 1) => setLightbox((current) => current ? { ...current, index: direction === -1 ? previous(current.index, getLength(current.kind)) : next(current.index, getLength(current.kind)) } : null)

  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
    <button type="button" onClick={() => navigate('/', { state: { scrollTo: 'projects' } })} className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-lime-100"><ArrowLeft className="h-4 w-4" />Вернуться к проектам</button>
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="mt-10">
      <p className="text-xs uppercase tracking-[.2em] text-lime-200/70">Mobile product · Fintech</p>
      <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div><h1 className="max-w-4xl text-4xl font-semibold tracking-[-.05em] text-white sm:text-6xl">SmartWallet — Умный кошелёк</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">Сервис автоматически выбирает карту с максимальным кешбэком при оплате, анализируя категорию покупки, историю транзакций и геолокацию — чтобы пользователи экономили без лишних усилий.</p></div>
        <div className="flex shrink-0 flex-wrap gap-2"><a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:border-white/35"><Code2 className="h-4 w-4" />GitHub</a><a href={figmaUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-lime-200/25 bg-lime-300/[.08] px-4 py-3 text-sm font-medium text-lime-100 transition hover:-translate-y-0.5 hover:border-lime-200/60 hover:bg-lime-300/[.14]">Открыть Figma <ExternalLink className="h-4 w-4" /></a></div>
      </div>

      <section className="mt-16" aria-labelledby="screencast-heading"><div className="flex items-center gap-3"><MonitorPlay className="h-5 w-5 text-lime-200" /><div><p className="text-xs uppercase tracking-[.2em] text-lime-200/70">Интерфейс приложения</p><h2 id="screencast-heading" className="mt-1 text-2xl font-medium text-white">Скринкаст</h2></div></div><div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-lime-300/[.1] via-[#11131c] to-emerald-500/[.12] px-4 py-6 sm:px-12 sm:py-10"><div className="relative flex flex-col items-center"><div className="flex w-full items-center justify-center gap-3 sm:gap-10"><ArrowButton direction="left" onClick={() => setScreen((current) => previous(current, screens.length))} label="Предыдущий экран" /><button type="button" onClick={() => setLightbox({ kind: 'screen', index: screen })} className="group rounded-[2rem] border-[6px] border-zinc-700 bg-zinc-900 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.5)] transition hover:-translate-y-1 hover:border-lime-200/70"><span className="mx-auto mb-1.5 block h-1 w-12 rounded-full bg-zinc-600" /><img src={screens[screen]} alt={`Экран мобильного приложения ${screen + 1}`} className="block w-[min(52vw,245px)] rounded-[1.45rem] bg-black" /></button><ArrowButton direction="right" onClick={() => setScreen((current) => next(current, screens.length))} label="Следующий экран" /></div><div className="mt-6 flex items-center gap-3"><div className="flex max-w-48 flex-wrap justify-center gap-1.5">{screens.map((image, index) => <button key={image} type="button" onClick={() => setScreen(index)} aria-label={`Показать экран ${index + 1}`} className={`h-1.5 rounded-full transition-all ${screen === index ? 'w-6 bg-lime-200' : 'w-1.5 bg-white/30 hover:bg-white/70'}`} />)}</div><span className="text-xs text-zinc-400">{screen + 1} / {screens.length}</span></div><p className="mt-3 text-sm text-zinc-400">Нажмите на экран, чтобы открыть его полностью</p></div></div></section>

      <section className="mt-20" aria-labelledby="presentation-heading"><div className="flex items-center gap-3"><FileText className="h-5 w-5 text-lime-200" /><div><p className="text-xs uppercase tracking-[.2em] text-lime-200/70">Кейс чемпионата</p><h2 id="presentation-heading" className="mt-1 text-2xl font-medium text-white">Презентация</h2></div></div><div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-lime-300/[.1] via-[#11131c] to-emerald-500/[.12] px-4 py-6 sm:px-12 sm:py-10"><div className="relative flex items-center justify-center gap-3 sm:gap-8"><ArrowButton direction="left" onClick={() => setPresentationSlide((current) => previous(current, presentation.length))} label="Предыдущий слайд" /><button type="button" onClick={() => setLightbox({ kind: 'presentation', index: presentationSlide })} className="group w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,.45)]"><img src={presentation[presentationSlide]} alt={`Презентация проекта, слайд ${presentationSlide + 1}`} className="block aspect-video w-full object-contain transition duration-500 group-hover:scale-[1.015]" /></button><ArrowButton direction="right" onClick={() => setPresentationSlide((current) => next(current, presentation.length))} label="Следующий слайд" /></div><div className="relative mt-6 flex items-center justify-center"><span className="text-xs text-zinc-400">Слайд {presentationSlide + 1} / {presentation.length}</span></div></div></section>

      <section className="mt-20" aria-labelledby="press-heading"><div className="flex items-center gap-3"><ExternalLink className="h-5 w-5 text-lime-200" /><div><p className="text-xs uppercase tracking-[.2em] text-lime-200/70">Медиа</p><h2 id="press-heading" className="mt-1 text-2xl font-medium text-white">О проекте в новостях</h2></div></div><a href={publicationUrl} target="_blank" rel="noreferrer" className="group mt-6 block rounded-2xl border border-white/10 bg-white/[.035] p-5 transition hover:-translate-y-1 hover:border-lime-200/35 hover:bg-lime-300/[.05]"><p className="text-xs uppercase tracking-[.2em] text-lime-200/70">Правительство Удмуртии</p><h3 className="mt-3 text-base font-medium leading-6 text-white group-hover:text-lime-100">Встреча с Главой Удмуртской Республики</h3><span className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-400 group-hover:text-lime-100">Открыть публикацию <ExternalLink className="h-4 w-4" /></span></a></section>

      <section className="mt-20 pb-12" aria-labelledby="gallery-heading"><div className="flex items-center gap-3"><MapPinned className="h-5 w-5 text-lime-200" /><div><p className="text-xs uppercase tracking-[.2em] text-lime-200/70">Команда и разработка</p><h2 id="gallery-heading" className="mt-1 text-2xl font-medium text-white">Фотогалерея</h2></div></div><div className="mt-6 grid auto-rows-[190px] gap-3 sm:grid-cols-2 sm:auto-rows-[250px] md:grid-cols-3">{gallery.map((item, index) => <button key={item.src} type="button" onClick={() => setLightbox({ kind: 'gallery', index })} className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.03] text-left ${index === gallery.length - 1 ? 'md:col-span-2' : ''}`}>{item.type === 'video' ? <video src={item.src} muted preload="metadata" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <img src={item.src} alt={item.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}<span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" /><span className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-4 pb-3 text-sm text-white/90">{item.type === 'video' && <MonitorPlay className="h-4 w-4 text-lime-200" />}{item.type === 'video' ? 'Открыть видео' : 'Открыть фото'}</span></button>)}</div></section>
    </motion.article>
    {lightbox && <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setLightbox(null)}><button type="button" onClick={(event) => { event.stopPropagation(); setLightbox(null) }} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white" aria-label="Закрыть"><X className="h-5 w-5" /></button><ArrowButton direction="left" onClick={() => moveLightbox(-1)} label="Предыдущий элемент" /><div onClick={(event) => event.stopPropagation()}>{lightbox.kind === 'gallery' && gallery[lightbox.index].type === 'video' ? <video controls autoPlay playsInline className="mx-4 max-h-[86svh] max-w-[78vw] rounded-2xl bg-black"><source src={gallery[lightbox.index].src} type="video/mp4" /></video> : <img src={lightbox.kind === 'screen' ? screens[lightbox.index] : lightbox.kind === 'presentation' ? presentation[lightbox.index] : gallery[lightbox.index].src} alt={lightbox.kind === 'screen' ? 'Экран SmartWallet' : lightbox.kind === 'presentation' ? 'Слайд презентации SmartWallet' : gallery[lightbox.index].alt} className="mx-4 max-h-[86svh] max-w-[78vw] rounded-2xl object-contain shadow-2xl" />}</div><ArrowButton direction="right" onClick={() => moveLightbox(1)} label="Следующий элемент" /></div>}
  </main>
}
