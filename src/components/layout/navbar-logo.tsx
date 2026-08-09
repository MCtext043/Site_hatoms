import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { navigation } from '@/constants/content'
import teamLogo from '@/assets/hatoms-wordmark.webp'

export function Navbar({ onOpenRequest }: { onOpenRequest: () => void }) {
  const [open, setOpen] = useState(false)
  const go = (href: string) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 px-4 pt-3">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/10 bg-[#090b11]/70 px-4 py-3 backdrop-blur-xl sm:px-5">
        <button onClick={() => go('#home')} className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
          <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-lg"><img src={teamLogo} alt="Логотип Hatoms" className="h-full w-full object-cover" /></span>
          HATOMS
        </button>
        <div className="hidden items-center gap-6 lg:flex">
          {navigation.slice(0, -1).map((item) => <button key={item.href} onClick={() => go(item.href)} className="text-sm text-zinc-400 transition hover:text-white">{item.label}</button>)}
        </div>
        <button onClick={onOpenRequest} className="hidden text-sm text-cyan-200 lg:block">Оставить заявку →</button>
        <button className="text-zinc-200 lg:hidden" onClick={() => setOpen(!open)} aria-label="Открыть навигацию">{open ? <X /> : <Menu />}</button>
      </nav>
      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-[#090b11]/95 p-3 backdrop-blur-xl lg:hidden">
          {navigation.map((item) => <button key={item.href} onClick={() => go(item.href)} className="block w-full rounded-xl px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/5">{item.label}</button>)}
        </motion.div>}
      </AnimatePresence>
    </header>
  )
}
