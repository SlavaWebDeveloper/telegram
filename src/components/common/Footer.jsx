import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>© {new Date().getFullYear()} Кондитерская</p>
      </div>
    </footer>
  );
};

export default Footer;