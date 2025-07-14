import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutUsPage from './pages/AboutUsPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import ContactUsPage from './pages/ContactUsPage'
import BlogPage from './pages/BlogPage'
import Layout from './components/layout'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App