import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SkillDetailSkeleton } from './components'

gsap.registerPlugin(ScrollTrigger)

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const SkillDetail = lazy(() => import('./pages/SkillDetail').then(m => ({ default: m.SkillDetail })))
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })))

function HomeSkeleton() {
  return (
    <div className="min-h-screen relative">
      <div className="mesh-gradient" />
      <div className="noise-overlay" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<HomeSkeleton />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/skill/:skillId"
          element={
            <Suspense fallback={<SkillDetailSkeleton />}>
              <SkillDetail />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<HomeSkeleton />}>
              <About />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
