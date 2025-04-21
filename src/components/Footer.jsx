import React from 'react';
// import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'; // Importing Font Awesome icons from React Icons

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      {/* <div className="max-w-7xl mx-auto px-4"> */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="mb-2">Email: eventhub@gmail.com</p>
            <p>Phone: +254712345678</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white">About Us</a>
              </li>
              <li>
                <a href="/events" className="text-gray-400 hover:text-white">Events</a>
              </li>
              <li>
                <a href="/blogs" className="text-gray-400 hover:text-white">Blogs</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe to our newsletter for updates and offers.</p>
            <form action="#" method="POST">
              <input
                type="email"
                placeholder="Your email"
                className="w-full p-2 mb-4 rounded-md text-gray-800"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div> */}

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>&copy; 2025 EventHub. All Rights Reserved.</p>
        </div>
      {/* </div> */}
    </footer>
  );
};

export default Footer;
