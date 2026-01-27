import { lazy, Suspense, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SkillDetailSkeleton, AnalyticsDashboard } from './components'

gsap.registerPlugin(ScrollTrigger)

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const SkillDetail = lazy(() => import('./pages/SkillDetail').then(m => ({ default: m.SkillDetail })))
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })))
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

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
      <ScrollToTop />
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
        <Route
          path="*"
          element={
            <Suspense fallback={<HomeSkeleton />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
      <AnalyticsDashboard />
    </BrowserRouter>
  )
}

export default App
