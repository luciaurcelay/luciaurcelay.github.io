import HeroSection from './HeroSection'
import ResearchSection from './ResearchSection'
import PublicationsPreview from './PublicationsPreview'
import LatestNews from './LatestNews'

export default function Landing() {
  return (
    <div className="flex flex-col gap-12 md:gap-20 lg:gap-25 pb-16 md:pb-24">
      <HeroSection />
      <ResearchSection />
      <PublicationsPreview />
      <LatestNews />
    </div>
  )
}
