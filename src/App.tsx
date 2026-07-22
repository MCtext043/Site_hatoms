import { lazy, Suspense, useEffect } from 'react'
import Lenis from 'lenis'
import { AmbientBackground } from '@/components/layout/ambient-background'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/sections/landing-sections'

const HomePage = lazy(() => import('@/pages/home-page'))

export default function App() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    let frame = 0
    const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf) }
    frame = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(frame); lenis.destroy() }
  }, [])
  return <div className="overflow-x-clip"><AmbientBackground /><Navbar /><Suspense fallback={<main className="min-h-screen" />}><HomePage /></Suspense><Footer /></div>
}
