import Navbar from './components/Navbar'
import Manager from './components/manager'
import Footer from './components/Footer'
import AboutMe from './components/AboutMe'

function App() {
  
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7f2]">
      <Navbar />
      <Manager />
      <AboutMe />
      <Footer />
    </div>
  )
}

export default App
