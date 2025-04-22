import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm mb-4 sm:mb-0">&copy; 2025 EventHub. All Rights Reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaFacebookF />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
