import { ArrowLeft, Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return <main className="mx-auto flex min-h-screen max-w-6xl items-center px-5 py-16 sm:px-8">
    <section className="max-w-xl rounded-[2rem] border border-white/10 bg-white/[.035] p-8 sm:p-12">
      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-200/20 bg-cyan-300/[.08] text-cyan-100"><Compass className="h-6 w-6" /></span>
      <p className="mt-8 text-sm font-medium uppercase tracking-[.18em] text-cyan-200/70">Ошибка 404</p>
      <h1 className="mt-3 text-balance text-4xl font-semibold tracking-[-.05em] text-white sm:text-5xl">Такой страницы нет</h1>
      <p className="mt-5 max-w-md text-base leading-7 text-zinc-400">Возможно, ссылка устарела или адрес был введён с ошибкой. Вернитесь на главную и выберите нужный раздел.</p>
      <button type="button" onClick={() => navigate('/')} className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-950 transition hover:-translate-y-0.5 hover:bg-cyan-100"><ArrowLeft className="h-4 w-4" />На главную</button>
    </section>
  </main>
}
