import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/farms');
    setIsMenuOpen(false);
  };

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link
              to="/"
              className="flex items-center space-x-3 group"
              aria-label="5 Acre Organics Home"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-700 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <i className="fas fa-leaf text-white text-xl"></i>
              </div>
              <span className="text-2xl font-bold text-gray-900 font-sans">
                <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  5 Acre
                </span>
                <span className="text-gray-600 ml-1.5">Organics</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-7 ml-12">
              <NavLink to="/" current={pathname} text="Home" icon="home" />
              <NavLink to="/farms" current={pathname} text="Our Farms" icon="tractor" />
              <NavLink to="/how-it-works" current={pathname} text="Process" icon="seedling" />
              <NavLink to="/create" current={pathname} text="Campaigns" icon="hand-holding-usd" />
              <NavLink to="/shop" current={pathname} text="Shop" icon="shopping-basket" />
            </nav>

            {/* Auth Section */}
            <div className="hidden lg:flex items-center space-x-4 ml-auto">
              {isLoggedIn ? (
                <>
                  <NotificationBell />
                  <ProfileDropdown onLogout={handleLogout} />
                </>
              ) : (
                <>
                  <AuthButton to="/login" variant="secondary">
                    <i className="fas fa-sign-in-alt mr-2"></i>Sign In
                  </AuthButton>
                  <AuthButton to="/signup" variant="primary">
                    <i className="fas fa-rocket mr-2"></i>Get Started Signup
                  </AuthButton>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-gray-700 text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <nav className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="p-6 space-y-2 bg-gray-50">
            <MobileNavLink to="/" text="Home" current={pathname} onClose={toggleMenu} icon="home" />
            <MobileNavLink to="/farms" text="Our Farms" current={pathname} onClose={toggleMenu} icon="tractor" />
            <MobileNavLink to="/how-it-works" text="Process" current={pathname} onClose={toggleMenu} icon="seedling" />
            <MobileNavLink to="/create" text="Campaigns" current={pathname} onClose={toggleMenu} icon="hand-holding-usd" />
            <MobileNavLink to="/shop" text="Shop" current={pathname} onClose={toggleMenu} icon="shopping-basket" />

            <div className="h-px bg-black my-4" />

            {isLoggedIn ? (
              <>
                <MobileNavLink to="/dashboard" text="Dashboard" current={pathname} onClose={toggleMenu} icon="chart-line" />
                <MobileNavLink to="/shop/orders" text="Orders" current={pathname} onClose={toggleMenu} icon="shopping-bag" />
                <MobileNavLink to="/profile" text="Profile" current={pathname} onClose={toggleMenu} icon="user-cog" />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left mt-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
                >
                  <i className="fas fa-sign-out-alt mr-2 text-red-500"></i>
                  Log Out
                </button>
              </>
            ) : (
              <div className="space-y-3 pt-4">
                <AuthButton to="/login" variant="secondary" className="w-full">
                  <i className="fas fa-sign-in-alt mr-2"></i>Sign In
                </AuthButton>
                <AuthButton to="/signup" variant="primary" className="w-full">
                  <i className="fas fa-rocket mr-2"></i>Get Started
                </AuthButton>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
};

// Reusable Components

const NavLink = ({ to, text, current, icon }) => (
  <Link
    to={to}
    className={`relative px-4 py-2.5 text-sm font-medium ${current === to ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700'
      } transition-colors group`}
    aria-current={current === to ? "page" : undefined}
  >
    <i className={`fas fa-${icon} mr-2`}></i>
    {text}
    <span className={`absolute bottom-0 left-1/2 h-0.5 bg-emerald-600 transition-all duration-300 ${current === to ? 'w-4/5 -translate-x-1/2' : 'w-0 group-hover:w-4/5 group-hover:-translate-x-1/2'
      }`} />
  </Link>
);

const AuthButton = ({ to, variant = 'primary', children, className = '' }) => (
  <Link
    to={to}
    className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center ${className} ${variant === 'primary'
        ? 'bg-gradient-to-br from-emerald-700 to-teal-600 text-white shadow-md hover:shadow-lg'
        : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
      }`}
  >
    {children}
  </Link>
);

const ProfileDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  const handleClickOutside = useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClickOutside]);

  return (
    <div ref={dropdownRef} className="relative ml-4">
      <button
        onClick={toggle}
        className="flex items-center space-x-2 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
        aria-expanded={isOpen}
      >
        <div className="w-9 h-9 bg-gradient-to-br from-emerald-700 to-teal-600 rounded-full flex items-center justify-center text-white font-medium">
          <i className="fas fa-user"></i>
        </div>
        <i className={`fas fa-chevron-down text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100">
          <div className="p-2 space-y-1">
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <i className="fas fa-chart-line mr-2 text-emerald-600"></i>
              Dashboard
            </Link>
            <Link
              to="/shop/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <i className="fas fa-shopping-bag mr-2 text-emerald-600"></i>
              Orders
            </Link>
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              <i className="fas fa-user-cog mr-2 text-emerald-600"></i>
              Profile
            </Link>
            <button
              onClick={() => { onLogout(); setIsOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center"
            >
              <i className="fas fa-sign-out-alt mr-2 text-red-500"></i>
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const NotificationBell = () => (
  <button className="p-2 relative text-gray-600 hover:text-emerald-700">
    <i className="fas fa-bell text-xl"></i>
    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
  </button>
);

const MobileNavLink = ({ to, text, current, onClose, icon }) => (
  <Link
    to={to}
    onClick={onClose}
    className={`flex items-center justify-between px-4 py-4 rounded-lg text-lg ${current === to ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-50'
      }`}
  >
    <div className="flex items-center">
      <i className={`fas fa-${icon} mr-3 text-emerald-600`}></i>
      <span className="font-medium text-black">{text}</span>
    </div>
    <i className="fas fa-chevron-right text-gray-400"></i>
  </Link>
);

export default Header;
