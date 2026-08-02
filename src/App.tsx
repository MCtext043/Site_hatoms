import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { Navbar } from '@/components/layout/navbar-logo'
import { Footer } from '@/components/sections/landing-sections'
import CertificatePage from '@/pages/certificate-page'
import EventPage from '@/pages/event-page'
import { events } from '@/constants/content'

const HomePage = lazy(() => import('@/pages/home-page'))

export default function App() {
  const { pathname, state } = useLocation()
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
  const eventSlug = pathname.match(/^\/events\/([^/]+)$/)?.[1]
  const event = events.find((item) => item.slug === eventSlug)

  return <div className="overflow-x-clip"><AmbientBackground />{certificate ? <CertificatePage {...certificate} /> : event ? <EventPage {...event} /> : <><Navbar /><Suspense fallback={<main className="min-h-screen" />}><HomePage /></Suspense><Footer /></>}</div>
}
