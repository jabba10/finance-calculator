// components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Check active route
  const isActive = (path) => router.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu after link click
  const handleLinkClick = () => setIsMenuOpen(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking on backdrop
  const handleBackdropClick = () => {
    setIsMenuOpen(false);
  };

  // Close menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  // Close menu when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header className={`${styles.navbarHeader} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        {/* Logo */}
        <Link href="/" className={styles.logo} onClick={handleLinkClick}>
          FinanceCalculatorFree
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={styles.navLinks}>
          <Link
            href="/suite"
            className={isActive('/suite') ? styles.active : ''}
            aria-current={isActive('/suite') ? 'page' : undefined}
          >
            Calculators
          </Link>
          <Link
            href="/blog"
            className={isActive('/blog') ? styles.active : ''}
            aria-current={isActive('/blog') ? 'page' : undefined}
          >
            Blog
          </Link>
          <Link
            href="/about"
            className={isActive('/aboutus') ? styles.active : ''}
            aria-current={isActive('/aboutus') ? 'page' : undefined}
          >
            About
          </Link>
          <Link
            href="/contactus"
            className={isActive('/contactus') ? styles.active : ''}
            aria-current={isActive('/contactus') ? 'page' : undefined}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Navigation Menu */}
        <nav 
          className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}
          aria-hidden={!isMenuOpen}
        >
          <Link
            href="/suite"
            className={isActive('/suite') ? styles.active : ''}
            onClick={handleLinkClick}
            aria-current={isActive('/suite') ? 'page' : undefined}
          >
            Calculators
          </Link>
          <Link
            href="/blog"
            className={isActive('/blog') ? styles.active : ''}
            onClick={handleLinkClick}
            aria-current={isActive('/blog') ? 'page' : undefined}
          >
            Blog
          </Link>
          <Link
            href="/aboutus"
            className={isActive('/aboutus') ? styles.active : ''}
            onClick={handleLinkClick}
            aria-current={isActive('/aboutus') ? 'page' : undefined}
          >
            About
          </Link>
          <Link
            href="/contactus"
            className={isActive('/contactus') ? styles.active : ''}
            onClick={handleLinkClick}
            aria-current={isActive('/contactus') ? 'page' : undefined}
          >
            Contact
          </Link>
        </nav>

        {/* Hamburger Menu Button */}
        <button
          className={`${styles.menuButton} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobile-menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Backdrop Overlay */}
        <div 
          className={`${styles.backdrop} ${isMenuOpen ? styles.active : ''}`}
          onClick={handleBackdropClick}
          aria-hidden={!isMenuOpen}
        />
      </div>
    </header>
  );
};

export default Navbar;