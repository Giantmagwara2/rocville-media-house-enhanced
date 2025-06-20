import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import PortfolioPage from "./pages/PortfolioPage";
import AboutUsPage from "./pages/AboutUsPage";
import BlogPage from "./pages/BlogPage";
import ContactUsPage from "./pages/ContactUsPage";
import { Layout } from "./components/layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

function NotFoundPage() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="text-4xl font-heading font-bold text-primary mb-4">404 - Page Not Found</h1>
        <p className="text-xl mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <div className="flex space-x-4">
          <a 
            href="/" 
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Go Home
          </a>
          <a 
            href="/contact" 
            className="bg-white border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary-50 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </Layout>
  );
}

export default App;
