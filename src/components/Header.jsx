import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setNumber } from '../redux/globalStates';
// HYBRID: Importing lucide-react icons specifically for the MODERN MOBILE UI
import { Menu, X, ShoppingCart as LucideCart, Home, Tractor, Sprout, Handshake, Store, User, Bell, ChevronDown, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';
// HYBRID: Using a different name for the Lucide cart to avoid conflict with the react-icons component if used elsewhere.
import { FaShoppingCart } from 'react-icons/fa';


const Header = () => {
  // --- NO LOGIC CHANGES IN THIS SECTION ---
  const endpoint = useSelector(state => state.endpoint.endpoint);
  const cartNumber = useSelector(state => state.cartCount.count);
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, [pathname]);

  useEffect(() => {
    const fetchNumber = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${endpoint}/cart`, { headers: { Authorization: `Bearer ${token}` } });
          const totalItems = response.data.data.summary?.totalItems || 0;
          dispatch(setNumber(totalItems));
        }
      } catch (error) { /* Silently fail */ }
    };
    if (isLoggedIn) fetchNumber();
    else dispatch(setNumber(0));
  }, [isLoggedIn, pathname, dispatch, endpoint]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate('/farms');
  };

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);
  
  // --- END OF LOGIC SECTION ---

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section (Reverted to Font Awesome for consistency) */}
            <Link to="/" className="flex items-center space-x-3 group" aria-label="GenHarvest Home">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-700 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                {/* HYBRID: Original FA icon for desktop view */}
                <i className="fas fa-leaf text-white text-xl"></i>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 font-sans">
                <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">Gen</span>
                <span className="text-gray-600 ml-1.5 hidden sm:inline">Harvest</span>
              </span>
            </Link>

            {/* Desktop Navigation (Reverted to Font Awesome) */}
            <nav className="hidden lg:flex items-center space-x-7 ml-12">
              <NavLink to="/" current={pathname} text="Home" icon="home" />
              <NavLink to="/farms" current={pathname} text="Our Farms" icon="tractor" />
              <NavLink to="/how-it-works" current={pathname} text="Process" icon="seedling" />
              <NavLink to="/create" current={pathname} text="Campaigns" icon="hand-holding-usd" />
              <NavLink to="/shop" current={pathname} text="Shop" icon="shopping-basket" />
            </nav>

            {/* Auth and Cart Section (Reverted to Font Awesome) */}
            <div className="hidden lg:flex items-center space-x-4 ml-auto">
              {isLoggedIn ? (
                <>
                  <NotificationBell />
                  <Link to="/shop/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaShoppingCart className="text-xl text-gray-700" />
                    {cartNumber > 0 && (
                      <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cartNumber}
                      </span>
                    )}
                  </Link>
                  <ProfileDropdown onLogout={handleLogout} />
                </>
              ) : (
                <>
                  <AuthButton to="/login" variant="secondary">
                    <i className="fas fa-sign-in-alt mr-2"></i>Sign In
                  </AuthButton>
                  <AuthButton to="/signup" variant="primary">
                    <i className="fas fa-rocket mr-2"></i>Get Started
                  </AuthButton>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle (Uses Lucide for the toggle icon itself) */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* --- MODERN MOBILE UI (This part remains unchanged, using Lucide Icons) --- */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${ isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div onClick={toggleMenu} className="absolute inset-0 bg-black/50" aria-hidden="true" />
        <nav className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transition-transform duration-300 ${isMenuOpen ? 'transform-none' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
               <span className="font-bold text-lg text-gray-800">Menu</span>
              <button onClick={toggleMenu} className="p-2 -mr-2 rounded-full hover:bg-gray-100"><X size={24} className="text-gray-700" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
              <MobileNavLink to="/" text="Home" current={pathname} onClose={toggleMenu} Icon={Home} />
              <MobileNavLink to="/farms" text="Our Farms" current={pathname} onClose={toggleMenu} Icon={Tractor} />
              <MobileNavLink to="/how-it-works" text="Process" current={pathname} onClose={toggleMenu} Icon={Sprout} />
              <MobileNavLink to="/create" text="Campaigns" current={pathname} onClose={toggleMenu} Icon={Handshake} />
              <MobileNavLink to="/shop" text="Shop" current={pathname} onClose={toggleMenu} Icon={Store} />
              <hr className="my-4"/>
              <Link to="/shop/cart" onClick={toggleMenu} className="flex items-center justify-between px-4 py-4 rounded-lg text-lg text-gray-700 hover:bg-gray-100">
                <div className="flex items-center"><LucideCart className="mr-3 text-emerald-600" size={22}/>
                  <span className="font-medium text-gray-800">Your Cart</span>
                </div>
                {cartNumber > 0 && <span className="ml-auto bg-green-600 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full font-semibold">{cartNumber}</span>}
              </Link>
              {isLoggedIn && (
                  <>
                    <hr className="my-4"/>
                    <MobileNavLink to="/dashboard" text="Dashboard" current={pathname} onClose={toggleMenu} Icon={LayoutDashboard} />
                    <MobileNavLink to="/shop/orders" text="Orders" current={pathname} onClose={toggleMenu} Icon={ShoppingBag} />
                    <MobileNavLink to="/profile" text="Profile" current={pathname} onClose={toggleMenu} Icon={User} />
                  </>
              )}
            </div>
            <div className="p-6 border-t border-gray-200">
              {isLoggedIn ? (
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">
                      <LogOut size={18} className="text-red-500"/> Log Out
                  </button>
              ) : (
                <div className="space-y-3">
                  <AuthButton to="/login" onClick={toggleMenu} variant="secondary" className="w-full justify-center">Sign In</AuthButton>
                  <AuthButton to="/signup" onClick={toggleMenu} variant="primary" className="w-full justify-center">Get Started</AuthButton>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

// --- Reusable Components ---

// HYBRID: NavLink for Desktop using Font Awesome
const NavLink = ({ to, text, current, icon }) => (
  <Link
    to={to}
    className={`relative px-4 py-2.5 text-sm font-medium ${current === to ? 'text-emerald-700' : 'text-gray-600 hover:text-emerald-700'} transition-colors group`}
    aria-current={current === to ? "page" : undefined}
  >
    <i className={`fas fa-${icon} mr-2`}></i>
    {text}
    <span className={`absolute bottom-0 left-1/2 h-0.5 bg-emerald-600 transition-all duration-300 ${current === to ? 'w-4/5 -translate-x-1/2' : 'w-0 group-hover:w-4/5 group-hover:-translate-x-1/2'}`} />
  </Link>
);

// HYBRID: MobileNavLink for Mobile using Lucide
const MobileNavLink = ({ to, text, current, onClose, Icon }) => (
  <Link
    to={to}
    onClick={onClose}
    className={`flex items-center justify-between px-4 py-3 rounded-lg text-base ${current === to ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700 hover:bg-gray-100'}`}
  >
    <div className="flex items-center gap-4">
      <Icon size={22} className={current === to ? 'text-emerald-600' : 'text-gray-500'}/>
      <span className="font-medium text-gray-800">{text}</span>
    </div>
    <ChevronDown size={18} className="text-gray-400 -rotate-90" />
  </Link>
);


const AuthButton = ({ to, variant = 'primary', children, className = '', onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center text-sm ${className} ${
      variant === 'primary' ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md' : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
    }`}
  >
    {children}
  </Link>
);

// HYBRID: ProfileDropdown for Desktop using Font Awesome
const ProfileDropdown = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative ml-4">
      <button onClick={toggle} className="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-full transition-colors" aria-expanded={isOpen}>
        <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
          <i className="fas fa-user"></i>
        </div>
        <i className={`fas fa-chevron-down text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100">
          <div className="p-2 space-y-1">
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
              <i className="fas fa-chart-line mr-2 text-emerald-600"></i>Dashboard
            </Link>
            <Link to="/shop/orders" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
              <i className="fas fa-shopping-bag mr-2 text-emerald-600"></i>Orders
            </Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
              <i className="fas fa-user-cog mr-2 text-emerald-600"></i>Profile
            </Link>
            <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
              <i className="fas fa-sign-out-alt mr-2 text-red-500"></i>Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// HYBRID: NotificationBell for Desktop using Font Awesome
const NotificationBell = () => (
  <button className="p-2 relative text-gray-600 hover:text-emerald-700 hover:bg-gray-100 rounded-full transition-colors">
    <i className="fas fa-bell text-xl"></i>
    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
  </button>
);


export default Header;