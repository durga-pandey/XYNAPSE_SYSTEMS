import AlumniGrid from "./AlumniGrid"
import AlumniHero from "./AlumniHero"
import AlumniStats from "./AlumniStats"
import CareerEvolution from "./CareerEvolution"

const LandingAlumni = () => {
  return (
    <div>
      <AlumniHero/>
      <AlumniGrid/>
      <CareerEvolution/>
      <AlumniStats/>
    </div>
  )
}

export default LandingAlumni
