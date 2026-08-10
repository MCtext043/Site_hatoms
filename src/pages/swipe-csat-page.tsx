import { ArrowLeft, BarChart3, ChevronLeft, ChevronRight, MessageSquareText, MonitorPlay, Star, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDialogFocusTrap } from '@/hooks/use-dialog-focus-trap'

const screens = Array.from({ length: 9 }, (_, index) => `/projects/swipe-csat/screencast/screen-${String(index + 1).padStart(2, '0')}.png`)
const presentation = Array.from({ length: 12 }, (_, index) => `/projects/swipe-csat/presentation/slide-${String(index + 1).padStart(2, '0')}.png`)

const features = [
  { icon: Star, title: 'Оценка опыта', description: 'Пользователь выбирает товар, оставляет оценку и может дополнить её комментарием и фотографиями.' },
  { icon: MessageSquareText, title: 'Отзывы в контексте покупки', description: 'Сервис связывает отзыв с заказом и карточкой товара — так обратная связь остаётся полезной и проверяемой.' },
  { icon: BarChart3, title: 'Основа для CSAT-аналитики', description: 'Ответы можно агрегировать по товарам и характеристикам, чтобы видеть, что влияет на удовлетворённость клиентов.' },
] as const

function ArrowButton({ direction, onClick, label, disabled = false }: { direction: 'left' | 'right', onClick: () => void, label: string, disabled?: boolean }) {
  const Icon = direction === 'left' ? ChevronLeft : ChevronRight
  return <button type="button" onClick={(event) => { event.stopPropagation(); onClick() }} aria-label={label} disabled={disabled} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/15 bg-black/25 text-white transition hover:border-emerald-200/70 hover:bg-emerald-300/10 disabled:cursor-default disabled:opacity-20"><Icon className="h-7 w-7" /></button>
}

export default function SwipeCsatPage() {
  const navigate = useNavigate()
  const [screen, setScreen] = useState(0)
  const [presentationSlide, setPresentationSlide] = useState(0)
  const [lightbox, setLightbox] = useState<'screen' | 'presentation' | null>(null)
  useDialogFocusTrap(Boolean(lightbox))
  const previous = (value: number) => (value - 1 + screens.length) % screens.length
  const next = (value: number) => (value + 1) % screens.length
  const previousPresentation = (value: number) => (value - 1 + presentation.length) % presentation.length
  const nextPresentation = (value: number) => (value + 1) % presentation.length
  const previousScreen = screen > 0 ? screen - 1 : null
  const nextScreen = screen < screens.length - 1 ? screen + 1 : null
  const goToPreviousScreen = () => setScreen((current) => Math.max(0, current - 1))
  const goToNextScreen = () => setScreen((current) => Math.min(screens.length - 1, current + 1))

  useEffect(() => {
    if (!lightbox) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowLeft') {
        if (lightbox === 'screen') setScreen(previous)
        else setPresentationSlide(previousPresentation)
      }
      if (event.key === 'ArrowRight') {
        if (lightbox === 'screen') setScreen(next)
        else setPresentationSlide(nextPresentation)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightbox])

  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
    <button type="button" onClick={() => navigate('/', { state: { scrollTo: 'projects' } })} className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-emerald-100"><ArrowLeft className="h-4 w-4" />Вернуться к проектам</button>
    <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="mt-10">
      <p className="text-xs uppercase tracking-[.2em] text-emerald-200/70">Мобильное приложение · Customer experience</p>
      <div className="mt-4 max-w-4xl"><h1 className="text-4xl font-semibold tracking-[-.05em] text-white sm:text-6xl">Swipe CSAT</h1><p className="mt-5 text-lg leading-8 text-zinc-300">Концепт мобильного сервиса, который помогает собирать обратную связь о товарах и превращать впечатления клиентов в понятные сигналы для бизнеса.</p></div>

      <section className="mt-16 grid gap-5 lg:grid-cols-[.9fr_1.1fr]" aria-labelledby="challenge-heading">
        <div className="rounded-3xl border border-white/10 bg-white/[.035] p-6 sm:p-8"><p className="text-xs uppercase tracking-[.2em] text-emerald-200/70">Задача</p><h2 id="challenge-heading" className="mt-3 text-2xl font-medium text-white">Не просто оценка, а причина оценки</h2><p className="mt-4 text-sm leading-7 text-zinc-400">Заказчику требовался сервис для оценки удовлетворённости клиентов по товарам и услугам. В основе — набор характеристик опыта: приложение показывает пользователю две-три из них и помогает быстро выразить впечатление.</p></div>
        <div className="rounded-3xl border border-emerald-200/15 bg-gradient-to-br from-emerald-300/[.12] via-[#11131c] to-cyan-500/[.08] p-6 sm:p-8"><p className="text-xs uppercase tracking-[.2em] text-emerald-200/70">Решение</p><p className="mt-3 text-2xl font-medium leading-8 text-white">Swipe CSAT объединяет каталог, профиль, избранное и сценарий отзыва после покупки.</p><p className="mt-4 text-sm leading-7 text-zinc-300">Пользователь находит товар, возвращается к оформленному заказу, ставит оценку, добавляет комментарий и фотографии. Эти ответы могут быть собраны в CSAT-метрику и использованы для аналитики по товарам и параметрам опыта.</p></div>
      </section>

      <section className="mt-20" aria-labelledby="screencast-heading">
        <div className="flex items-center gap-3"><MonitorPlay className="h-5 w-5 text-emerald-200" /><div><p className="text-xs uppercase tracking-[.2em] text-emerald-200/70">Интерфейс приложения</p><h2 id="screencast-heading" className="mt-1 text-2xl font-medium text-white">Скринкаст</h2></div></div>
        <div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-300/[.12] via-[#11131c] to-cyan-500/[.12] px-4 py-6 sm:px-12 sm:py-10"><div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_center,rgba(52,211,153,.18),transparent_52%)]" /><div className="relative flex flex-col items-center"><div className="grid w-full grid-cols-[auto_auto_auto_auto_auto] items-center justify-center gap-5 md:gap-8 lg:gap-[60px]"><ArrowButton direction="left" onClick={goToPreviousScreen} label="Предыдущий экран" disabled={previousScreen === null} />{previousScreen === null ? <div className="hidden w-[min(20vw,205px)] md:block" aria-hidden="true" /> : <button type="button" onClick={() => setScreen(previousScreen)} aria-label={`Показать предыдущий экран ${previousScreen + 1}`} className="group hidden w-[min(20vw,205px)] overflow-hidden rounded-[1.7rem] border-4 border-zinc-700 bg-zinc-900 p-1.5 shadow-[0_16px_45px_rgba(0,0,0,.35)] transition hover:-translate-y-1 hover:border-emerald-200/50 md:block"><span className="mx-auto mb-1.5 block h-1 w-10 rounded-full bg-zinc-600" /><img src={screens[previousScreen]} alt="Предпросмотр предыдущего экрана" className="block w-full rounded-[1.15rem] bg-white opacity-55 brightness-50 saturate-50 transition duration-300 group-hover:opacity-85 group-hover:brightness-75" /></button>}<button type="button" onClick={() => setLightbox('screen')} className="group rounded-[2rem] border-[6px] border-zinc-700 bg-zinc-900 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.5)] transition hover:-translate-y-1 hover:border-emerald-200/70 focus:outline-none focus:ring-2 focus:ring-emerald-300"><span className="mx-auto mb-1.5 block h-1 w-12 rounded-full bg-zinc-600" /><img src={screens[screen]} alt={`Экран приложения Swipe CSAT ${screen + 1}`} className="block w-[min(52vw,225px)] rounded-[1.45rem] bg-white transition duration-500 group-hover:scale-[1.015]" /></button>{nextScreen === null ? <div className="hidden w-[min(20vw,205px)] md:block" aria-hidden="true" /> : <button type="button" onClick={() => setScreen(nextScreen)} aria-label={`Показать следующий экран ${nextScreen + 1}`} className="group hidden w-[min(20vw,205px)] overflow-hidden rounded-[1.7rem] border-4 border-zinc-700 bg-zinc-900 p-1.5 shadow-[0_16px_45px_rgba(0,0,0,.35)] transition hover:-translate-y-1 hover:border-emerald-200/50 md:block"><span className="mx-auto mb-1.5 block h-1 w-10 rounded-full bg-zinc-600" /><img src={screens[nextScreen]} alt="Предпросмотр следующего экрана" className="block w-full rounded-[1.15rem] bg-white opacity-55 brightness-50 saturate-50 transition duration-300 group-hover:opacity-85 group-hover:brightness-75" /></button>}<ArrowButton direction="right" onClick={goToNextScreen} label="Следующий экран" disabled={nextScreen === null} /></div><div className="mt-6 flex items-center gap-3"><div className="flex max-w-48 flex-wrap justify-center gap-1.5">{screens.map((image, index) => <button key={image} type="button" onClick={() => setScreen(index)} aria-label={`Показать экран ${index + 1}`} className={`h-1.5 rounded-full transition-all ${screen === index ? 'w-6 bg-emerald-200' : 'w-1.5 bg-white/30 hover:bg-white/70'}`} />)}</div><span className="text-xs text-zinc-400">{screen + 1} / {screens.length}</span></div><p className="mt-3 text-sm text-zinc-400">Нажмите на экран, чтобы открыть его полностью</p></div></div>
      </section>

      <section className="mt-20" aria-labelledby="presentation-heading"><div className="flex items-center gap-3"><MonitorPlay className="h-5 w-5 text-violet-200" /><div><p className="text-xs uppercase tracking-[.2em] text-violet-200/70">Материалы проекта</p><h2 id="presentation-heading" className="mt-1 text-2xl font-medium text-white">Презентация</h2></div></div><div className="relative mt-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/[.16] via-[#11131c] to-cyan-500/[.08] px-4 py-6 sm:px-12 sm:py-10"><div className="relative flex items-center justify-center gap-3 sm:gap-8"><ArrowButton direction="left" onClick={() => setPresentationSlide(previousPresentation)} label="Предыдущий слайд" /><button type="button" onClick={() => setLightbox('presentation')} className="group w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_20px_60px_rgba(0,0,0,.45)] focus:outline-none focus:ring-2 focus:ring-violet-300"><img src={presentation[presentationSlide]} alt={`Презентация Swipe CSAT, слайд ${presentationSlide + 1}`} className="block aspect-video w-full object-contain transition duration-500 group-hover:scale-[1.015]" /></button><ArrowButton direction="right" onClick={() => setPresentationSlide(nextPresentation)} label="Следующий слайд" /></div><div className="mt-6 flex justify-center"><span className="text-xs text-zinc-400">Слайд {presentationSlide + 1} / {presentation.length}</span></div></div></section>

      <section className="mt-20" aria-labelledby="features-heading"><div><p className="text-xs uppercase tracking-[.2em] text-emerald-200/70">Сценарии продукта</p><h2 id="features-heading" className="mt-1 text-2xl font-medium text-white">Что прорабатывает приложение</h2></div><div className="mt-6 grid gap-4 md:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[.035] p-6"><span className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-200/20 bg-emerald-300/[.08] text-emerald-100"><Icon className="h-5 w-5" /></span><h3 className="mt-6 text-lg font-medium text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p></article>)}</div></section>
      <section className="mt-20 pb-12" aria-labelledby="customers-heading"><p className="text-xs uppercase tracking-[.2em] text-emerald-200/70">Заказчики проекта</p><h2 id="customers-heading" className="sr-only">Заказчики проекта</h2><div className="mt-4 flex w-fit max-w-full flex-wrap items-center gap-x-8 gap-y-4 rounded-xl border border-white/10 bg-white/[.035] px-5 py-4 sm:gap-x-10"><img src="/projects/swipe-csat/partners/t-bank.png" alt="Т-Банк" className="h-6 w-28 object-contain object-left" /><span className="hidden h-6 w-px bg-white/10 sm:block" aria-hidden="true" /><img src="/projects/swipe-csat/partners/central-university.png" alt="Центральный университет" className="h-7 w-40 object-contain object-left" /><span className="hidden h-6 w-px bg-white/10 sm:block" aria-hidden="true" /><img src="/projects/swipe-csat/partners/education-program.png" alt="Обучаюсь. Проектирую. Программирую. Будущее" className="h-10 w-64 object-contain object-left" /></div></section>
    </motion.article>
    {lightbox && <div role="dialog" aria-modal="true" aria-label="Полноэкранный просмотр материалов Swipe CSAT" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm" onClick={() => setLightbox(null)}><button type="button" onClick={(event) => { event.stopPropagation(); setLightbox(null) }} className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20" aria-label="Закрыть просмотр"><X className="h-5 w-5" /></button><ArrowButton direction="left" onClick={() => lightbox === 'screen' ? setScreen(previous) : setPresentationSlide(previousPresentation)} label="Предыдущий элемент" /><img src={lightbox === 'screen' ? screens[screen] : presentation[presentationSlide]} alt={lightbox === 'screen' ? `Экран приложения Swipe CSAT ${screen + 1}` : `Презентация Swipe CSAT, слайд ${presentationSlide + 1}`} className="mx-4 max-h-[86svh] max-w-[78vw] rounded-2xl object-contain shadow-2xl" onClick={(event) => event.stopPropagation()} /><ArrowButton direction="right" onClick={() => lightbox === 'screen' ? setScreen(next) : setPresentationSlide(nextPresentation)} label="Следующий элемент" /></div>}
  </main>
}
