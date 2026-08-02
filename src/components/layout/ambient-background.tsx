import { useEffect, useRef } from 'react'

function LegacyAmbientBackground() {
  const glowRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      glowRef.current?.style.setProperty('--x', `${event.clientX}px`)
      glowRef.current?.style.setProperty('--y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return <><div className="fixed inset-0 -z-20 bg-[#05060a]" /><div className="grid-bg fixed inset-0 -z-10 opacity-40" /><div ref={glowRef} className="pointer-events-none fixed inset-0 -z-10 hidden opacity-70 lg:block [background:radial-gradient(420px_circle_at_var(--x,_50%)_var(--y,_30%),rgba(0,212,255,.09),transparent_65%)]" /><div className="pointer-events-none fixed -top-48 right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-[130px] motion-safe:animate-[drift_14s_ease-in-out_infinite_alternate]" /><div className="pointer-events-none fixed top-[42%] -left-48 -z-10 h-[30rem] w-[30rem] rounded-full bg-violet-600/10 blur-[130px] motion-safe:animate-[drift_18s_ease-in-out_infinite_alternate-reverse]" /></>
}

export function AmbientBackground() {
  const glowRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      glowRef.current?.style.setProperty('--x', `${event.clientX}px`)
      glowRef.current?.style.setProperty('--y', `${event.clientY}px`)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => sceneRef.current?.style.setProperty('--scroll', `${window.scrollY}`))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll) }
  }, [])

  return <>
    <div className="fixed inset-0 -z-20 bg-[#05060a]" />
    <div ref={sceneRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden [--scroll:0]">
      <div className="grid-bg absolute inset-0 opacity-40" />
      <div className="absolute -right-40 top-[18%] h-[34rem] w-[34rem] rounded-full border border-cyan-200/15 [transform:translateY(calc(var(--scroll)*-.12px))_rotate(calc(var(--scroll)*.025deg))] motion-safe:animate-[orbit_24s_linear_infinite]" />
      <div className="absolute -left-56 top-[48%] h-[31rem] w-[31rem] rounded-full border border-violet-300/15 [transform:translateY(calc(var(--scroll)*.09px))_rotate(calc(var(--scroll)*-.02deg))] motion-safe:animate-[orbit_30s_linear_infinite_reverse]" />
    </div>
    <div ref={glowRef} className="pointer-events-none fixed inset-0 -z-10 hidden opacity-70 lg:block [background:radial-gradient(420px_circle_at_var(--x,_50%)_var(--y,_30%),rgba(0,212,255,.09),transparent_65%)]" />
    <div className="pointer-events-none fixed -top-48 right-[-10%] -z-10 h-[35rem] w-[35rem] rounded-full bg-cyan-500/10 blur-[130px] motion-safe:animate-[drift_14s_ease-in-out_infinite_alternate]" />
    <div className="pointer-events-none fixed top-[42%] -left-48 -z-10 h-[30rem] w-[30rem] rounded-full bg-violet-600/10 blur-[130px] motion-safe:animate-[drift_18s_ease-in-out_infinite_alternate-reverse]" />
  </>
}
