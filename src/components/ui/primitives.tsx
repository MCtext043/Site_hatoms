import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-cyan-200/70"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_14px_#00d4ff]" />{children}</p>
}

export function SectionHeading({ eyebrow, title, description, descriptionClassName }: { eyebrow: string; title: ReactNode; description?: string; descriptionClassName?: string }) {
  return <div className="max-w-2xl"><Eyebrow>{eyebrow}</Eyebrow><h2 className="text-balance text-4xl font-semibold tracking-[-0.055em] text-white sm:text-5xl">{title}</h2>{description && <p className={cn('mt-5 max-w-xl text-pretty text-base leading-7 text-zinc-400', descriptionClassName)}>{description}</p>}</div>
}

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({ children, className, variant = 'primary', ...props }: ButtonProps) {
  return <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className={cn('group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-medium transition', variant === 'primary' ? 'bg-white text-zinc-950 shadow-[0_0_30px_rgba(0,212,255,.18)]' : 'border border-white/15 bg-white/[.035] text-white hover:border-cyan-200/40 hover:bg-white/[.08]', className)} {...props}>
    {children}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
  </motion.button>
}
