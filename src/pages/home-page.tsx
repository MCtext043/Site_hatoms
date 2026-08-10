import { ClientJourney, Events, Hero, Projects, TechStack } from '@/components/sections/landing-sections'

export default function HomePage({ onOpenRequest }: { onOpenRequest: () => void }) {
  return <main><Hero onOpenRequest={onOpenRequest} /><Projects /><ClientJourney onOpenRequest={onOpenRequest} /><TechStack /><Events /></main>
}
