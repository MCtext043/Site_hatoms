import { ArrowLeft, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

type CertificatePageProps = {
  name: string
  image: string
}

export default function CertificatePage({ name, image }: CertificatePageProps) {
  const navigate = useNavigate()

  return <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8 sm:py-12">
    <button type="button" onClick={() => navigate('/', { state: { scrollTo: 'stack' } })} className="inline-flex w-fit items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-100"><ArrowLeft className="h-4 w-4" />Вернуться к стеку</button>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="mx-auto mt-10 w-full max-w-4xl">
      <div className="mb-6 flex items-center gap-3"><Award className="h-5 w-5 text-cyan-200" /><div><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Samsung Innovation Campus</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">Сертификат: {name}</h1></div></div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-2 shadow-[0_20px_80px_rgba(0,212,255,.08)] sm:p-4"><img src={image} alt={`Сертификат Samsung Innovation Campus — ${name}`} className="w-full rounded-xl" /></div>
    </motion.div>
  </main>
}
