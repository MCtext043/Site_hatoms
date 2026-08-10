import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { Navbar } from '@/components/layout/navbar-logo'
import { Footer, ProjectRequestModal } from '@/components/sections/landing-sections'
import { eventPhotos, events } from '@/constants/content'

const HomePage = lazy(() => import('@/pages/home-page'))
const AdminPage = lazy(() => import('@/pages/admin-page'))
const CertificatePage = lazy(() => import('@/pages/certificate-page'))
const CertificateCollectionPage = lazy(() => import('@/pages/certificate-collection-page'))
const EventPage = lazy(() => import('@/pages/event-page'))
const HeartOfUdmurtiaPage = lazy(() => import('@/pages/heart-of-udmurtia-page'))
const SmartWalletPage = lazy(() => import('@/pages/smart-wallet-page'))
const SwipeCsatPage = lazy(() => import('@/pages/swipe-csat-page'))
const NotFoundPage = lazy(() => import('@/pages/not-found-page'))
const pageFallback = (
  <main className="grid min-h-[60svh] place-items-center px-5" aria-busy="true" aria-label="Загрузка страницы">
    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[.035] px-5 py-3 text-sm text-zinc-300 shadow-lg">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-violet-300 shadow-[0_0_14px_rgba(196,181,253,.8)]" aria-hidden="true" />
      <span role="status">Загрузка страницы</span>
    </div>
  </main>
)

export default function App() {
  const { pathname, state } = useLocation()
  const [requestOpen, setRequestOpen] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    let frame = 0
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(frame); lenis.destroy() }
  }, [])
  useEffect(() => {
    if (pathname !== '/' || !state?.scrollTo) return
    const timer = window.setTimeout(() => document.querySelector(`#${state.scrollTo}`)?.scrollIntoView(), 100)
    return () => window.clearTimeout(timer)
  }, [pathname, state])
  const certificates = {
    '/certificates/samsung/derendyaev': { name: 'Александр Дерендяев', image: '/certificates/samsung-derendyaev.webp' },
    '/certificates/samsung/mironenko': { name: 'Виктор Мироненко', image: '/certificates/samsung-mironenko.webp' },
  } as const
  const certificate = certificates[pathname as keyof typeof certificates]
  const certificateCollections = {
    '/certificates/samsung': { title: 'Samsung Innovation Campus', documents: [{ label: 'Александр Дерендяев', image: '/certificates/samsung-derendyaev.webp' }, { label: 'Виктор Мироненко', image: '/certificates/samsung-mironenko.webp' }] },
    '/certificates/yandex': { title: 'Яндекс Лицей', documents: [{ label: 'Александр Дерендяев', url: 'https://lms.yandex.ru/certificate/check/?certNumber=2501190050&lastName=Дерендяев' }, { label: 'Виктор Мироненко', url: 'https://lms.yandex.ru/certificate/check/?certNumber=2502208312&lastName=Мироненко' }] },
  } as const
  const certificateCollection = certificateCollections[pathname as keyof typeof certificateCollections]
  const eventSlug = pathname.match(/^\/events\/([^/]+)$/)?.[1]
  const event = events.find((item) => item.slug === eventSlug)
  const photos = event && (eventPhotos[event.slug as keyof typeof eventPhotos] ?? ('photos' in event ? event.photos : undefined))
  const isAdmin = pathname === '/admin'
  const page = certificate ? (
    <CertificatePage {...certificate} />
  ) : certificateCollection ? (
    <CertificateCollectionPage {...certificateCollection} />
  ) : event ? (
    <EventPage {...event} photos={photos} />
  ) : pathname === '/projects/heart-of-udm' ? (
    <HeartOfUdmurtiaPage />
  ) : pathname === '/projects/smart-wallet' ? (
    <SmartWalletPage />
  ) : pathname === '/projects/swipe-csat' ? (
    <SwipeCsatPage />
  ) : pathname !== '/' ? (
    <NotFoundPage />
  ) : <HomePage onOpenRequest={() => setRequestOpen(true)} />

  return (
    <div className="overflow-x-clip">
      <AmbientBackground />
      {isAdmin ? (
        <Suspense fallback={pageFallback}><AdminPage /></Suspense>
      ) : (
        <>
          <Navbar onOpenRequest={() => setRequestOpen(true)} />
          <Suspense fallback={pageFallback}>{page}</Suspense>
          <Footer onOpenRequest={() => setRequestOpen(true)} />
          <ProjectRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
        </>
      )}
    </div>
  )
}
