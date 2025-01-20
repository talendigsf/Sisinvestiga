import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentRole } from '../../../features/auth/authSlice';
import logo from "../../../assets/img/LogoWebUCSD.png";
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import "../../../css/Common/Nav.css";

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const role = useSelector(selectCurrentRole);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setDropdownOpen(false); // Cerrar el dropdown al abrir/cerrar el menú móvil
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={logo} alt="UCSD Logo" />
        </Link>
        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-item" onClick={closeMenu}>Inicio</Link>
          <Link to="/proyectos" className="navbar-item" onClick={closeMenu}>Proyectos</Link>
          <Link to="/publicaciones" className="navbar-item" onClick={closeMenu}>Publicaciones</Link>
          <div className="navbar-item dropdown">
            <span onClick={toggleDropdown}>
              Recursos <FaChevronDown className={`chevron ${dropdownOpen ? 'rotate' : ''}`} />
            </span>
            <div className={`dropdown-content ${dropdownOpen ? 'active' : ''}`}>
              <Link to="/biblioteca" onClick={closeMenu}>Biblioteca</Link>
              <Link to="/investigacion" onClick={closeMenu}>Investigación</Link>
            </div>
          </div>
          {!role && (
            <Link to="/login" className="navbar-item login-btn" onClick={closeMenu}>
              Iniciar Sesión
            </Link>
          )}
        </div>
        <div className="navbar-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
