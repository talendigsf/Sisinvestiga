import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import "../../css/Home/footerHome.css";

const Footer = () => {
    return (
      <footer className="footer-container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3>Universidad Católica Santo Domingo</h3>
            <p>
              Comprometidos con la excelencia académica y el desarrollo de la investigación en el país.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>
          <div className="footer-section contact">
            <h3>Contacto</h3>
            <p><FaMapMarkerAlt /> Av. Bolívar 800, Santo Domingo</p>
            <p><FaPhone /> (809)-544-2812</p>
            <p><FaEnvelope /> info@ucsd.edu.do</p>
          </div>
          <div className="footer-section links">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/proyectos">Proyectos</Link></li>
              <li><Link to="/publicaciones">Publicaciones</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-map">
          <iframe
            title="Mapa de ubicación"
            
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.2569527522543!2d-69.9303798!3d18.4700682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf7a15c171fdc5%3A0x3cdd57d6c6da8a1!2sUniversidad%20Cat%C3%B3lica%20Santo%20Domingo!5e0!3m2!1ses!2sdo!4v1693091197088!5m2!1ses!2sdo"
            width="100%"
            height="250"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Universidad Católica Santo Domingo. Todos los derechos reservados.</p>
        </div>
      </footer>
    );
};

export default Footer;