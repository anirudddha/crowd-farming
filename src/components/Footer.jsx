import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding & Social */}
          <div>
            <h2 className="text-2xl font-bold mb-4">5 Acre Organic Farm</h2>
            <p className="text-sm mb-4">
              Nurturing nature, naturally. We cultivate organic produce with passion and care,
              ensuring sustainable farming for a healthier tomorrow.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-green-300 transition-colors" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" className="hover:text-green-300 transition-colors" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-green-300 transition-colors" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-green-300 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#products" className="hover:text-green-300 transition-colors">Our Products</a>
              </li>
              <li>
                <a href="#blog" className="hover:text-green-300 transition-colors">Blog</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-green-300 transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-sm">
              123 Organic Way<br />
              Karad, Maharashtra, India
            </p>
            <p className="text-sm mt-2">Phone: +91-9876543210</p>
            <p className="text-sm mt-1">Email: info@5acreorganicfarm.com</p>
          </div>
        </div>

        {/* Bottom Legal Links */}
        <div className="mt-12 border-t border-green-700 pt-4 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm">&copy; 2024 5 Acre Organic Farm. All rights reserved.</p>
          <div className="mt-2 md:mt-0 space-x-4">
            <a href="#privacy" className="text-sm hover:text-green-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="text-sm hover:text-green-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
