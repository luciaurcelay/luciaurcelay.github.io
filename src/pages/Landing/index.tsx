import HeroSection from './HeroSection'
import PublicationsPreview from './PublicationsPreview'
import AcademicService from './AcademicService'
import LatestNews from './LatestNews'

export default function Landing() {
  return (
    <div className="flex flex-col gap-12 md:gap-20 lg:gap-25 pb-16 md:pb-24">
      <HeroSection />
      <PublicationsPreview />
      <AcademicService />
      <LatestNews />
    </div>
  )
}
