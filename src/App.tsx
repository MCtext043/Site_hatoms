import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { Navbar } from '@/components/layout/navbar-logo'
import { Footer, ProjectRequestModal } from '@/components/sections/landing-sections'
import AdminPage from '@/pages/admin-page'
import CertificatePage from '@/pages/certificate-page'
import CertificateCollectionPage from '@/pages/certificate-collection-page'
import EventPage from '@/pages/event-page'
import HeartOfUdmurtiaPage from '@/pages/heart-of-udmurtia-page'
import { eventPhotos, events } from '@/constants/content'

const HomePage = lazy(() => import('@/pages/home-page'))

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
    '/certificates/samsung/derendyaev': { name: 'Александр Дерендяев', image: '/certificates/samsung-derendyaev.png' },
    '/certificates/samsung/mironenko': { name: 'Виктор Мироненко', image: '/certificates/samsung-mironenko.png' },
  } as const
  const certificate = certificates[pathname as keyof typeof certificates]
  const certificateCollections = {
    '/certificates/samsung': { title: 'Samsung Innovation Campus', documents: [{ label: 'Александр Дерендяев', image: '/certificates/samsung-derendyaev.png' }, { label: 'Виктор Мироненко', image: '/certificates/samsung-mironenko.png' }] },
    '/certificates/yandex': { title: 'Яндекс Лицей', documents: [{ label: 'Александр Дерендяев', url: 'https://lms.yandex.ru/certificate/check/?certNumber=2501190050&lastName=Дерендяев' }, { label: 'Виктор Мироненко', url: 'https://lms.yandex.ru/certificate/check/?certNumber=2502208312&lastName=Мироненко' }] },
  } as const
  const certificateCollection = certificateCollections[pathname as keyof typeof certificateCollections]
  const eventSlug = pathname.match(/^\/events\/([^/]+)$/)?.[1]
  const event = events.find((item) => item.slug === eventSlug)
  const photos = event && (eventPhotos[event.slug as keyof typeof eventPhotos] ?? ('photos' in event ? event.photos : undefined))
  const isAdmin = pathname === '/admin'

  return (
    <div className="overflow-x-clip">
      <AmbientBackground />
      {isAdmin ? (
        <AdminPage />
      ) : certificate ? (
        <CertificatePage {...certificate} />
      ) : certificateCollection ? (
        <CertificateCollectionPage {...certificateCollection} />
      ) : event ? (
        <EventPage {...event} photos={photos} />
      ) : pathname === '/projects/heart-of-udm' ? (
        <HeartOfUdmurtiaPage />
      ) : (
        <>
          <Navbar onOpenRequest={() => setRequestOpen(true)} />
          <Suspense fallback={<main className="min-h-screen" />}>
            <HomePage />
          </Suspense>
          <Footer onOpenRequest={() => setRequestOpen(true)} />
          <ProjectRequestModal open={requestOpen} onClose={() => setRequestOpen(false)} />
        </>
      )}
    </div>
  )
}
