
import { 
  Github,
  CircleDollarSign,
  Mail,
  ArrowRight
} from "lucide-react";

const GITHUB_URL = "https://github.com/sahilgupta630";
const CONTACT_EMAIL = "guptasahilkumar783@gmail.com";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 text-gray-800 pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company info column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-1.5 rounded-md shadow-sm">
                <CircleDollarSign className="text-white w-5 h-5" />
              </div>
              <span className="text-2xl font-bold">
                <span className="text-purple-700">Expense</span>
                <span className="text-gray-900">Tracker</span>
              </span>
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Expense Tracker helps you take control of your financial journey.
              Track spending, set budgets, and gain valuable insights to make
              smarter financial decisions. Whether you&apos;re saving for a goal or
              managing day-to-day expenses, we empower you with tools to optimize
              your finances.
            </p>
            <div className="flex space-x-4 mb-6">
              <a 
                href={GITHUB_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-200 text-gray-600 hover:bg-purple-600 hover:text-white p-2 rounded-full transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href={`mailto:${CONTACT_EMAIL}`} 
                className="bg-gray-200 text-gray-600 hover:bg-purple-600 hover:text-white p-2 rounded-full transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/features" className="text-gray-600 hover:text-purple-700 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" /> Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-600 hover:text-purple-700 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" /> Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-purple-700 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" /> About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-purple-700 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" /> FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-purple-700 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" /> Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-purple-700 transition-colors duration-200 flex items-center">
                  <ArrowRight className="w-4 h-4 mr-2" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact info column */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900 border-b border-gray-200 pb-2">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-3 text-purple-700 flex-shrink-0 mt-0.5" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-gray-600 hover:text-purple-700 transition-colors duration-200 break-all">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-start">
                <Github className="w-5 h-5 mr-3 text-purple-700 flex-shrink-0 mt-0.5" />
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-purple-700 transition-colors duration-200">
                  github.com/sahilgupta630
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal section */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500">
                © {currentYear} Expense Tracker · Built by{" "}
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-purple-700 transition-colors duration-200">
                  sahilgupta630
                </a>
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-purple-700 transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-purple-700 transition-colors duration-200">
                Terms of Service
              </Link>
              <Link to="/cookies" className="hover:text-purple-700 transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;