import React, { useRef, useState, useEffect } from 'react';
import { Search, ShoppingCart, User, UserCircle, ArrowRightToLine, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './navbar.css';

const Navbar = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showHamburger, setShowHamburger] = useState(window.innerWidth <= 1155);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileName, setProfileName] = useState("");

  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isGuest } = useAuth();

  const pathname = location.pathname;

  const alwaysBlackPages = ['/products', '/hearingtest', '/profile',  '/support','/consultation'];

  useEffect(() => {
    if (!alwaysBlackPages.includes(pathname)) {
      const handleScroll = () => setScrolled(window.scrollY > 10);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => setShowHamburger(window.innerWidth <= 1155);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    console.log('Navbar state update - User:', user ? 'logged in' : 'not logged in', 'Guest:', isGuest);
    if (user) {
      const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
      setProfileName(displayName);
    } else if (isGuest) {
      setProfileName("Guest User");
    } else {
      setProfileName("Not Signed In");
    }
  }, [user, isGuest]);

  const handleUserClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      // Redirect to signup page for guests or non-authenticated users
      navigate('/login');
    }
  };

  const navbarClass = `navbar ${alwaysBlackPages.includes(pathname) || scrolled ? 'scrolled solid' : ''}`;

  return (
    <nav className={navbarClass}>
      <div className="logo">H . E . A . R</div>

      <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
        {/* Show X only on mobile and only when sidebar is open */}
        {showHamburger && menuOpen && (
          <X className="sidebar-close-button" onClick={() => setMenuOpen(false)} />
        )}

        <li><Link to="/">Home</Link></li>
{showHamburger && (
  <li>
    <span 
      onClick={handleUserClick}
      style={{ 
        cursor: 'pointer', 
        color: '#ffffff',  // white color
        fontWeight: '700', // bold
        textDecoration: 'none',
      }}
    >
      Profile
    </span>
  </li>
)}

        
        <li><Link to="/about">About</Link></li>
          {showHamburger && (
    <>
      <li><Link to="/login">Signup / Login</Link></li>
      <li><Link to="/products">My Cart</Link></li>
    </>
  )}
        <li><Link to="/products">Products</Link></li>
        <li><Link to="/support">Support</Link></li>
        <li><Link to="/hearinginfo">Take a Hearing Test</Link></li>
        <li><Link to="/consultation">Consultation</Link></li>
      </ul>

      <div className="nav-icons">
        <div
          className={`hamburger ${menuOpen ? 'active hidden' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div
          className={`search-container ${searchActive ? 'active' : ''}`}
          ref={searchRef}
          onClick={() => setSearchActive(true)}
        >
          <Search className="icon" />
          <input
            type="text"
            className="search-bar"
            placeholder="Search hearing aids"
            autoFocus={searchActive}
          />
        </div>

{/* Only show on desktop */}
{!showHamburger && (
  <ShoppingCart className="icon cart-icon" onClick={() => navigate('/products')} />
)}

{!showHamburger && (
  <div
    className="user-dropdown-wrapper"
    style={{ position: 'relative' }}
    onMouseEnter={() => setDropdownOpen(true)}
    onMouseLeave={() => setDropdownOpen(false)}
  >
    {/* User Icon */}
    <User className="custicon" onClick={handleUserClick} />

    {/* Dropdown Menu */}
    <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
      <div className="dropdown-header">
        <p className="welcome">Welcome,</p>
        <p className="profile-name">{profileName}</p>
      </div>
      <div className="dropdown-links">
        <span 
          onClick={handleUserClick}
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 12px',
            color: 'inherit',
            textDecoration: 'none'
          }}
        >
          <UserCircle size={16} />
          <span style={{ marginLeft: '8px' }}>My Account</span>
        </span>
        <span 
          onClick={() => navigate('/login')}
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            padding: '8px 12px',
            color: 'inherit',
            textDecoration: 'none'
          }}
        >
          <ArrowRightToLine size={16} />
          <span style={{ marginLeft: '8px' }}>Sign In</span>
        </span>
      </div>
    </div>
  </div>
)}

      </div>  
    </nav>
  );
};

export default Navbar;