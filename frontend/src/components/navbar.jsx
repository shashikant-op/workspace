import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import '../index.css';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav
      className={`bg-white shadow-sm fixed w-full z-1 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 !no-underline">
            <span className="text-xl font-bold !text-teal-600 !no-underline">
              <span className="text-orange-600">Work</span>space
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="!text-teal-600 hover:!text-orange-600 text-xl hover:!underline p-2 rounded-lg !no-underline"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex gap-4 items-center">
                <button
                  onClick={handleLogout}
                  className="text-orange-600 border !border-teal-600 hover:!rounded-lg p-2 px-4"
                >
                  Logout
                </button>
                <Link to="https://github.com/shashikant-op?tab=repositories">
                  <FaGithub className="w-7 h-7 !text-teal-800" />
                </Link>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 !text-teal-800 hover:text-primary transition-colors border border-red-500 rounded-lg hover:bg-orange-600 hover:!text-white !no-underline"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 border !text-teal-800 hover:!text-white hover:bg-orange-600 rounded-lg hover:bg-primary/90 transition-colors !no-underline"
                >
                  Get Started
                </Link>
                <Link to="https://github.com/shashikant-op?tab=repositories">
                  <FaGithub className="w-7 h-7 !text-teal-800" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <Link to="/" className="block px-4 py-2 text-gray-600 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="border-t border-gray-100">
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
