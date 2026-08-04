import { ArrowLeft, ExternalLink, GraduationCap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

type Document = { label: string; image?: string; url?: string }
type CertificateCollectionPageProps = { title: string; documents: readonly Document[] }

export default function CertificateCollectionPage({ title, documents }: CertificateCollectionPageProps) {
  const navigate = useNavigate()

  return <main className="mx-auto min-h-screen max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
    <button type="button" onClick={() => navigate('/', { state: { scrollTo: 'stack' } })} className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-100"><ArrowLeft className="h-4 w-4" />Вернуться к образованию</button>
    <section className="mt-10"><div className="flex items-center gap-3"><GraduationCap className="h-5 w-5 text-cyan-200" /><div><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Проверка подлинности</p><h1 className="mt-1 text-3xl font-semibold tracking-[-.04em] text-white sm:text-4xl">{title}</h1></div></div><div className="mt-8 grid gap-5 md:grid-cols-2">{documents.map((document) => document.image ? <article key={document.label} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-2 shadow-[0_20px_80px_rgba(0,212,255,.08)] sm:p-4"><img src={document.image} alt={`Сертификат: ${document.label}`} className="w-full rounded-xl" /><p className="px-2 pb-1 pt-4 text-sm text-zinc-300">{document.label}</p></article> : <a key={document.label} href={document.url} target="_blank" rel="noreferrer" className="flex min-h-40 flex-col justify-between rounded-2xl border border-white/10 bg-white/[.04] p-5 transition hover:border-cyan-200/40 hover:bg-cyan-300/[.07]"><p className="text-lg font-medium text-white">{document.label}</p><span className="inline-flex items-center gap-2 text-sm text-cyan-100">Проверить сертификат <ExternalLink className="h-4 w-4" /></span></a>)}</div></section>
  </main>
}
