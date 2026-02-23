import Analytics from "./Components/Analytics"
import Features from "./Components/Features"
import Footer from "./Components/Footer"
import Header from "./Components/Header"
import Hero from "./Components/Hero"

const LandingPage = () => {
  return (
    <div className='min-h-screen'>
      
      <Header/>
      <Hero/>
      <Features/>
      <Analytics/>
      <Footer/>
    </div>
  )
}

export default LandingPage