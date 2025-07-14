import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./pages/HomePage'))
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const ContactUsPage = lazy(() => import('./pages/ContactUsPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
import Layout from './components/layout'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-cosmic-deep">
            <div className="quantum-loader">
              <div className="neural-pulse"></div>
              <p className="text-quantum-cyan mt-4">Loading quantum experience...</p>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/blog" element={<BlogPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  )
}

export default App