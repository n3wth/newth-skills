import { BrowserRouter, Routes, Route } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Home, SkillDetail } from './pages'
import { AnalyticsDashboard } from './components'

gsap.registerPlugin(ScrollTrigger)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/skill/:skillId" element={<SkillDetail />} />
      </Routes>
      <AnalyticsDashboard />
    </BrowserRouter>
  )
}

export default App
