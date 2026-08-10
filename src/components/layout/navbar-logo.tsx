import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { navigation } from '@/constants/content'
import teamLogo from '@/assets/hatoms-wordmark.webp'

export function Navbar({ onOpenRequest }: { onOpenRequest: () => void }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])
  const go = (href: string) => {
    setOpen(false)
    const target = href.slice(1)
    if (pathname !== '/') {
      navigate('/', { state: { scrollTo: target } })
      return
    }
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-3">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-[#090b11]/70 px-4 py-3 backdrop-blur-xl sm:px-5">
        <button type="button" onClick={() => go('#home')} aria-label="Hatoms: перейти на главную" className="flex min-h-11 items-center gap-2 text-sm font-semibold tracking-tight text-white">
          <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-lg"><img src={teamLogo} alt="Логотип Hatoms" className="h-full w-full object-cover" /></span>
          HATOMS
        </button>
        <div className="hidden items-center gap-6 lg:flex">
          {navigation.slice(0, -1).map((item) => <button type="button" key={item.href} onClick={() => go(item.href)} className="min-h-11 text-sm text-zinc-400 transition hover:text-white">{item.label}</button>)}
        </div>
        <button type="button" onClick={onOpenRequest} className="hidden min-h-11 text-sm text-cyan-200 lg:block">Оставить заявку →</button>
        <button type="button" className="grid h-11 w-11 place-items-center text-zinc-200 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Закрыть навигацию' : 'Открыть навигацию'} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X /> : <Menu />}</button>
      </nav>
      <AnimatePresence>
        {open && <motion.div id="mobile-navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-[#090b11]/95 p-3 backdrop-blur-xl lg:hidden">
          {navigation.map((item) => <button type="button" key={item.href} onClick={() => go(item.href)} className="block min-h-11 w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/5">{item.label}</button>)}
        </motion.div>}
      </AnimatePresence>
    </header>
  )
}
