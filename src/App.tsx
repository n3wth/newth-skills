import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SkillDetailSkeleton, ErrorBoundary, PageErrorFallback } from './components'
import { reportWebVitals } from './lib/analytics'

gsap.registerPlugin(ScrollTrigger)

reportWebVitals()

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const SkillDetail = lazy(() => import('./pages/SkillDetail').then(m => ({ default: m.SkillDetail })))
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })))
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))
const SubmitSkill = lazy(() => import('./pages/SubmitSkill').then(m => ({ default: m.SubmitSkill })))
const Contribute = lazy(() => import('./pages/Contribute').then(m => ({ default: m.Contribute })))
const Playground = lazy(() => import('./pages/Playground').then(m => ({ default: m.Playground })))
const Analytics = lazy(() => import('./pages/Analytics').then(m => ({ default: m.Analytics })))
const CreateSkill = lazy(() => import('./pages/CreateSkill').then(m => ({ default: m.CreateSkill })))
const Compare = lazy(() => import('./pages/Compare').then(m => ({ default: m.Compare })))
const Bundles = lazy(() => import('./pages/Bundles').then(m => ({ default: m.Bundles })))
const CuratedBundles = lazy(() => import('./pages/CuratedBundles').then(m => ({ default: m.CuratedBundles })))
const BundleDetail = lazy(() => import('./pages/BundleDetail').then(m => ({ default: m.BundleDetail })))
const FeatureRequests = lazy(() => import('./pages/FeatureRequests').then(m => ({ default: m.FeatureRequests })))
const Workflows = lazy(() => import('./pages/Workflows').then(m => ({ default: m.Workflows })))
const WorkflowBuilderPage = lazy(() => import('./pages/WorkflowBuilder').then(m => ({ default: m.WorkflowBuilderPage })))

function RouteHandler() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0)

    // Kill all ScrollTrigger instances on route change
    ScrollTrigger.getAll().forEach(t => t.kill())

    // Refresh after DOM settles
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    return () => clearTimeout(timeout)
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
    <ErrorBoundary fallback={<PageErrorFallback />}>
      <BrowserRouter>
        <RouteHandler />
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <Home />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/skill/:skillId"
            element={
              <ErrorBoundary>
                <Suspense fallback={<SkillDetailSkeleton />}>
                  <SkillDetail />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/about"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <About />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/submit"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <SubmitSkill />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/contribute"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <Contribute />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/playground"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <Playground />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/analytics"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <Analytics />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/create"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <CreateSkill />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/compare"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <Compare />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/bundles"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <Bundles />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/curated-bundles"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <CuratedBundles />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/curated-bundles/:bundleId"
            element={
              <ErrorBoundary>
                <Suspense fallback={<SkillDetailSkeleton />}>
                  <BundleDetail />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/requests"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <FeatureRequests />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/workflows"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <Workflows />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="/workflows/:workflowId"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <WorkflowBuilderPage />
                </Suspense>
              </ErrorBoundary>
            }
          />
          <Route
            path="*"
            element={
              <ErrorBoundary>
                <Suspense fallback={<HomeSkeleton />}>
                  <NotFound />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
