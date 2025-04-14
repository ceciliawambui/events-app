import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-1 md:px-2 py-3 flex items-center justify-between">
     
        <div className="flex-shrink-0 ml-[-6px]">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            EventHub
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <li>
              <Link to="/events" className="hover:text-indigo-500">Events</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-indigo-500">About</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-500">Contact</Link>
            </li>
          </ul>

          {/* Profile Icon */}
          <div className="relative hidden md:block">
            <button onClick={toggleDropdown} className="text-3xl text-indigo-600">
              <FaUserCircle />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-2">
                <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">Account</Link>
                <Link to="/login" className="block px-4 py-2 text-sm hover:bg-gray-100">Login</Link>
                <Link to="/signup" className="block px-4 py-2 text-sm hover:bg-gray-100">Sign Up</Link>
                <button
                  onClick={() => alert("Logged out!")}
                  className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
