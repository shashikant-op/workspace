import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer
      className="relative bg-teal-700 text-white bg-cover bg-center"
      style={{ backgroundImage: "url('https://www.wework.com/ideas/wp-content/uploads/sites/4/2017/06/Collab1.jpg')" }}
    >
      {/* Overlay with opacity & blur for glossy effect */}
      <div className="absolute inset-0 bg-teal-600/40 backdrop-blur-[1px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-3xl bg-amber-50">📁</span>
              <span className="text-2xl font-bold">Workspace</span>
            </div>
            <p className="text-sm text-teal-100">
              Your collaborative file sharing platform. Simplify your workflow with ease.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-teal-100 hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter className="w-5 h-5  !text-white" />
              </a>
              <a href="#" className="text-teal-100 hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="w-5 h-5  !text-white" />
              </a>
              <a href="#" className="text-teal-100 hover:text-white transition-colors" aria-label="GitHub">
                <FaGithub className="w-5 h-5 !text-white " />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm  !text-teal-100 hover:!text-white transition-colors">Home</a></li>
              <li><a href="/dashboard" className="text-sm !text-teal-100 hover:!text-white transition-colors">Dashboard</a></li>
              <li><a href="/public" className="text-sm !text-teal-100 hover:!text-white transition-colors">Public Files</a></li>
              <li><a href="/about" className="text-sm !text-teal-100 hover:!text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm text-teal-100">
                <FaEnvelope className="w-4 h-4" />
                <span>support@workspace.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-teal-100">
                <FaPhone className="w-4 h-4" />
                <span>+91 7482067564</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-teal-100">
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>MOTIHARI COLLEGE OF ENGINEERING, mothihari, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Subscribe to Our Newsletter</h3>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 rounded-lg bg-teal-800/70 text-white placeholder-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button type="submit" className="p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-teal-600 mt-8 pt-6 text-center">
          <p className="text-sm text-teal-100">
            © {new Date().getFullYear()} Workspace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
