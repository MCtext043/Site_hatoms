import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, GitBranch, Images, X, ZoomIn, ZoomOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

type EventPageProps = {
  title: string
  date: string
  subtitle?: string
  description?: string
  gallery?: readonly string[]
  photos?: readonly string[]
  presentation?: readonly string[]
  demo?: string
  repositoryUrl?: string
  repositories?: readonly { label: string, url: string }[]
}

export default function EventPage({ title, date, subtitle, description, gallery, photos, presentation, demo, repositoryUrl, repositories }: EventPageProps) {
  const navigate = useNavigate()
  const [activeImage, setActiveImage] = useState<number | null>(null)
  const [previewImage, setPreviewImage] = useState(0)
  const [activePhoto, setActivePhoto] = useState<number | null>(null)
  const [presentationSlide, setPresentationSlide] = useState(0)
  const [activePresentation, setActivePresentation] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)
  const hasGallery = Boolean(gallery?.length)
  const openGallery = (index: number) => { setActiveImage(index); setZoom(1) }
  const closeGallery = () => { setActiveImage(null); setZoom(1) }
  const showPrevious = () => { setActiveImage((current) => current === null || !gallery?.length ? null : (current - 1 + gallery.length) % gallery.length); setZoom(1) }
  const showNext = () => { setActiveImage((current) => current === null || !gallery?.length ? null : (current + 1) % gallery.length); setZoom(1) }
  const showPreviewPrevious = () => setPreviewImage((current) => !gallery?.length ? 0 : (current - 1 + gallery.length) % gallery.length)
  const showPreviewNext = () => setPreviewImage((current) => !gallery?.length ? 0 : (current + 1) % gallery.length)
  const changeZoom = (amount: number) => setZoom((current) => Math.min(2.5, Math.max(1, Number((current + amount).toFixed(1)))))
  const closePhoto = () => setActivePhoto(null)
  const showPreviousPhoto = () => setActivePhoto((current) => current === null || !photos?.length ? null : (current - 1 + photos.length) % photos.length)
  const showNextPhoto = () => setActivePhoto((current) => current === null || !photos?.length ? null : (current + 1) % photos.length)
  const showPreviousSlide = () => setPresentationSlide((current) => !presentation?.length ? 0 : (current - 1 + presentation.length) % presentation.length)
  const showNextSlide = () => setPresentationSlide((current) => !presentation?.length ? 0 : (current + 1) % presentation.length)
  const closePresentation = () => setActivePresentation(null)
  const showPreviousPresentation = () => setActivePresentation((current) => current === null || !presentation?.length ? null : (current - 1 + presentation.length) % presentation.length)
  const showNextPresentation = () => setActivePresentation((current) => current === null || !presentation?.length ? null : (current + 1) % presentation.length)

  useEffect(() => {
    if (activeImage === null && activePhoto === null && activePresentation === null) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { closeGallery(); closePhoto(); closePresentation() }
      if (event.key === 'ArrowLeft') activePresentation !== null ? showPreviousPresentation() : activePhoto !== null ? showPreviousPhoto() : showPrevious()
      if (event.key === 'ArrowRight') activePresentation !== null ? showNextPresentation() : activePhoto !== null ? showNextPhoto() : showNext()
      if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(.25) }
      if (event.key === '-') { event.preventDefault(); changeZoom(-.25) }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeImage, activePhoto, activePresentation, gallery, photos, presentation])

  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
    <button type="button" onClick={() => navigate('/', { state: { scrollTo: 'events' } })} className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-100"><ArrowLeft className="h-4 w-4" />Вернуться к мероприятиям</button>
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="mt-10">
      <p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Наши мероприятия</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-.05em] text-white sm:text-6xl">{title}</h1>
      {subtitle && <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{subtitle}</p>}
      <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-cyan-200/15 bg-cyan-300/[.05] px-4 py-3 text-sm text-cyan-100"><CalendarDays className="h-4 w-4" /><span>{date}</span></div>
      {description && <p className="mt-8 max-w-5xl whitespace-pre-line text-base leading-8 text-zinc-300 sm:text-lg">{description}</p>}

      {hasGallery && <section className="mt-16" aria-labelledby="gallery-heading">
        <div className="flex items-center gap-3"><Images className="h-5 w-5 text-cyan-200" /><h2 id="gallery-heading" className="text-2xl font-medium text-white">Проект</h2></div>
        {hasGallery ? <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-300/[.08] via-[#11131c] to-violet-500/[.12] px-5 py-8 sm:px-12"><div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_center,rgba(0,212,255,.16),transparent_52%)]" /><div className="relative flex flex-col items-center"><p className="text-xs uppercase tracking-[.2em] text-cyan-100/70">Интерфейс приложения</p><div className="mt-5 flex w-full items-center justify-center gap-4 sm:gap-10"><button type="button" onClick={showPreviewPrevious} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-black/25 text-white transition hover:border-cyan-200/70 hover:bg-cyan-300/10" aria-label="Предыдущий экран"><ChevronLeft className="h-6 w-6" /></button><button type="button" onClick={() => openGallery(previewImage)} aria-label={`Открыть экран ${previewImage + 1} на весь экран`} className="group w-[min(56vw,245px)] rounded-[2rem] border-[6px] border-zinc-700 bg-zinc-900 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.5)] transition hover:-translate-y-1 hover:border-cyan-200/70 hover:shadow-[0_20px_60px_rgba(0,212,255,.24)] focus:outline-none focus:ring-2 focus:ring-cyan-300"><span className="mx-auto mb-1.5 block h-1 w-12 rounded-full bg-zinc-600" /><span className="block overflow-hidden rounded-[1.45rem] bg-black"><img src={gallery![previewImage]} alt={`Экран мобильного приложения, ${previewImage + 1}`} className="block w-full" /></span></button><button type="button" onClick={showPreviewNext} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-black/25 text-white transition hover:border-cyan-200/70 hover:bg-cyan-300/10" aria-label="Следующий экран"><ChevronRight className="h-6 w-6" /></button></div><div className="mt-6 flex items-center gap-3"><div className="flex gap-1.5">{gallery!.map((image, index) => <button key={image} type="button" onClick={() => setPreviewImage(index)} aria-label={`Показать экран ${index + 1}`} className={`h-1.5 rounded-full transition-all ${previewImage === index ? 'w-6 bg-cyan-200' : 'w-1.5 bg-white/30 hover:bg-white/70'}`} />)}</div><span className="text-xs text-zinc-400">{previewImage + 1} / {gallery!.length}</span></div><p className="mt-3 text-sm text-zinc-400">Нажмите на экран, чтобы открыть его на весь экран</p></div></div> : <div className="mt-6 grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="flex aspect-[4/3] items-end rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-300/[.12] via-violet-500/[.08] to-white/[.02] p-4"><span className="text-sm text-zinc-400">Фото появятся позже</span></div>)}</div>}
      </section>}

      {photos?.length && <section className="mt-20" aria-labelledby="moments-heading">
        <div className="flex items-center gap-3"><Images className="h-5 w-5 text-violet-200" /><h2 id="moments-heading" className="text-2xl font-medium text-white">Фотогалерея</h2></div>
        <div className="mt-6 grid auto-rows-[160px] gap-3 sm:auto-rows-[210px] md:grid-cols-4">{photos.map((photo, index) => <button key={photo} type="button" onClick={() => setActivePhoto(index)} aria-label={`Открыть фото ${index + 1}`} className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.03] text-left focus:outline-none focus:ring-2 focus:ring-violet-300 ${index === 0 ? 'md:col-span-2 md:row-span-2' : index === 3 ? 'md:row-span-2' : index === 4 ? 'md:col-span-2' : ''}`}><img src={photo} alt={`НЕЙМАРК.Академия Хакатонщиков, фото ${index + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-sm text-white/90 opacity-0 transition group-hover:opacity-100">Открыть фото</span></button>)}</div>
      </section>}

      {presentation?.length && <section className="mt-20" aria-labelledby="presentation-heading">
        <div className="flex items-center gap-3"><Images className="h-5 w-5 text-cyan-200" /><div><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Проект команды</p><h2 id="presentation-heading" className="mt-1 text-2xl font-medium text-white">Презентация</h2></div></div>
        <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-300/[.08] via-[#11131c] to-violet-500/[.12] px-4 py-6 sm:px-12 sm:py-10"><div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_center,rgba(0,212,255,.16),transparent_52%)]" /><div className="relative flex flex-col items-center"><div className="flex w-full items-center justify-center gap-3 sm:gap-7"><button type="button" onClick={showPreviousSlide} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-black/25 text-white transition hover:border-cyan-200/70 hover:bg-cyan-300/10" aria-label="Предыдущий слайд"><ChevronLeft className="h-6 w-6" /></button><button type="button" onClick={() => setActivePresentation(presentationSlide)} aria-label={`Открыть слайд ${presentationSlide + 1} на весь экран`} className="group max-w-4xl overflow-hidden rounded-xl border border-white/15 bg-black shadow-[0_20px_60px_rgba(0,0,0,.5)] transition hover:-translate-y-1 hover:border-cyan-200/70 hover:shadow-[0_20px_60px_rgba(0,212,255,.24)] focus:outline-none focus:ring-2 focus:ring-cyan-300"><img src={presentation[presentationSlide]} alt={`Презентация проекта, слайд ${presentationSlide + 1}`} className="block w-full" /></button><button type="button" onClick={showNextSlide} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-black/25 text-white transition hover:border-cyan-200/70 hover:bg-cyan-300/10" aria-label="Следующий слайд"><ChevronRight className="h-6 w-6" /></button></div><div className="mt-5 flex flex-wrap justify-center gap-1.5">{presentation.map((slide, index) => <button key={slide} type="button" onClick={() => setPresentationSlide(index)} aria-label={`Показать слайд ${index + 1}`} className={`h-1.5 rounded-full transition-all ${presentationSlide === index ? 'w-6 bg-cyan-200' : 'w-1.5 bg-white/30 hover:bg-white/70'}`} />)}</div><p className="mt-3 text-sm text-zinc-400">Слайд {presentationSlide + 1} из {presentation.length} · нажмите, чтобы открыть на весь экран</p></div></div>
        {demo && <div className="mt-8 overflow-hidden rounded-2xl border border-cyan-200/20 bg-[#080b12] shadow-[0_20px_60px_rgba(0,212,255,.1)]"><div className="border-b border-white/10 px-5 py-4"><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">В действии</p><h3 className="mt-1 text-lg font-medium text-white">Демонстрация работы прототипа</h3></div><video controls preload="metadata" playsInline poster={presentation[0]} className="block aspect-video w-full bg-black"><source src={demo} type="video/mp4" />Ваш браузер не поддерживает воспроизведение видео.</video></div>}
      </section>}

      {repositoryUrl && <a href={repositoryUrl} target="_blank" rel="noreferrer" className="mt-12 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-5 py-3 text-sm text-zinc-200 transition hover:border-cyan-200/40 hover:bg-cyan-300/[.08] hover:text-white"><GitBranch className="h-4 w-4" />GitHub — исходный код проекта</a>}
      {repositories?.length ? <div className="mt-12 flex flex-wrap gap-3">{repositories.map(({ label, url }) => <a key={url} href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-5 py-3 text-sm text-zinc-200 transition hover:border-cyan-200/40 hover:bg-cyan-300/[.08] hover:text-white"><GitBranch className="h-4 w-4" />GitHub — {label}</a>)}</div> : null}
    </motion.article>
    {activeImage !== null && gallery && <div role="dialog" aria-modal="true" aria-label="Просмотр экрана приложения" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={closeGallery}>
      <button type="button" onClick={closeGallery} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20" aria-label="Закрыть просмотр"><X className="h-5 w-5" /></button>
      <button type="button" onClick={(event) => { event.stopPropagation(); showPrevious() }} className="absolute left-3 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:left-8" aria-label="Предыдущий экран"><ChevronLeft className="h-6 w-6" /></button>
      <div className="max-h-[88svh] max-w-[78vw] overflow-auto rounded-[2rem]" onClick={(event) => event.stopPropagation()}><img src={gallery[activeImage]} alt={`Экран мобильного приложения, ${activeImage + 1}`} className="rounded-[2rem] border-[7px] border-zinc-700 bg-zinc-900 object-contain shadow-2xl transition-[height] duration-200" style={{ height: `${80 * zoom}svh`, maxWidth: 'none' }} /></div>
      <button type="button" onClick={(event) => { event.stopPropagation(); showNext() }} className="absolute right-3 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:right-8" aria-label="Следующий экран"><ChevronRight className="h-6 w-6" /></button>
      <div className="absolute bottom-5 flex items-center gap-2"><button type="button" onClick={(event) => { event.stopPropagation(); changeZoom(-.25) }} disabled={zoom === 1} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Уменьшить"><ZoomOut className="h-4 w-4" /></button><button type="button" onClick={(event) => { event.stopPropagation(); setZoom(1) }} className="min-w-16 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs text-white transition hover:bg-white/20" aria-label="Сбросить масштаб">{Math.round(zoom * 100)}%</button><button type="button" onClick={(event) => { event.stopPropagation(); changeZoom(.25) }} disabled={zoom === 2.5} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Увеличить"><ZoomIn className="h-4 w-4" /></button><span className="ml-2 text-sm text-zinc-300">{activeImage + 1} / {gallery.length}</span></div>
    </div>}
    {activePhoto !== null && photos && <div role="dialog" aria-modal="true" aria-label="Просмотр фотографий с мероприятия" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={closePhoto}>
      <button type="button" onClick={closePhoto} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20" aria-label="Закрыть просмотр"><X className="h-5 w-5" /></button>
      <button type="button" onClick={(event) => { event.stopPropagation(); showPreviousPhoto() }} className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:left-8" aria-label="Предыдущее фото"><ChevronLeft className="h-6 w-6" /></button>
      <img src={photos[activePhoto]} alt={`НЕЙМАРК.Академия Хакатонщиков, фото ${activePhoto + 1}`} className="max-h-[86svh] max-w-[84vw] rounded-2xl object-contain shadow-2xl" onClick={(event) => event.stopPropagation()} />
      <button type="button" onClick={(event) => { event.stopPropagation(); showNextPhoto() }} className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:right-8" aria-label="Следующее фото"><ChevronRight className="h-6 w-6" /></button>
      <p className="absolute bottom-5 text-sm text-zinc-300">{activePhoto + 1} / {photos.length}</p>
    </div>}
    {activePresentation !== null && presentation && <div role="dialog" aria-modal="true" aria-label="Просмотр презентации проекта" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={closePresentation}>
      <button type="button" onClick={closePresentation} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20" aria-label="Закрыть просмотр"><X className="h-5 w-5" /></button>
      <button type="button" onClick={(event) => { event.stopPropagation(); showPreviousPresentation() }} className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:left-8" aria-label="Предыдущий слайд"><ChevronLeft className="h-6 w-6" /></button>
      <img src={presentation[activePresentation]} alt={`Презентация проекта, слайд ${activePresentation + 1}`} className="max-h-[86svh] max-w-[84vw] rounded-xl object-contain shadow-2xl" onClick={(event) => event.stopPropagation()} />
      <button type="button" onClick={(event) => { event.stopPropagation(); showNextPresentation() }} className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 sm:right-8" aria-label="Следующий слайд"><ChevronRight className="h-6 w-6" /></button>
      <p className="absolute bottom-5 text-sm text-zinc-300">{activePresentation + 1} / {presentation.length}</p>
    </div>}
  </main>
}
