import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { currentUser, userData } = useAuth();

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
    } catch (error) {
      console.error("Error logging out: ", error);
      alert("An error occurred while logging out.");
    }
  };

  const userName = currentUser?.displayName || currentUser?.email;
  const isOrganizer = userData?.role === "organizer"; // 👈 Check if user is organizer

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-1 md:px-2 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 ml-[-6px]">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            EventHub
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <ul className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <li>
              <Link to="/" className="hover:text-indigo-500">Home</Link>
            </li>
            <li>
              <Link to="/events" className="hover:text-indigo-500">Events</Link>
            </li>
            {isOrganizer && ( // 👈 Only show Create Event for organizers
              <li>
                <Link to="/create-event" className="hover:text-indigo-500">Create Events</Link>
              </li>
            )}
            <li>
              <Link to="/about" className="hover:text-indigo-500">About</Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-indigo-500">Gallery</Link>
            </li>
            <li>
              <Link to="/blogs" className="hover:text-indigo-500">Blogs</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-indigo-500">Contact</Link>
            </li>
          </ul>

          {/* Profile Dropdown */}
          <div className="relative hidden md:block">
            <button onClick={toggleDropdown} className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-600">
              {userData?.profilePhoto ? (
                <img
                  src={userData.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-4xl text-indigo-600" />
              )}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-2">
                {currentUser ? (
                  <>
                    <div className="block px-4 py-2 text-sm text-gray-700">
                      Welcome, {userData?.displayName}
                    </div>
                    <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">Account</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 text-sm hover:bg-gray-100">Login</Link>
                    <Link to="/register" className="block px-4 py-2 text-sm hover:bg-gray-100">Register</Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleDropdown} className="text-3xl text-indigo-600">
            <FaUserCircle />
          </button>
          {dropdownOpen && (
            <div className="absolute top-16 right-0 w-48 bg-white rounded-md shadow-lg z-10 py-2">
              {currentUser ? (
                <>
                  <div className="block px-4 py-2 text-sm text-gray-700">
                    Welcome, {userName}
                  </div>
                  <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">Account</Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 text-sm hover:bg-gray-100">Login</Link>
                  <Link to="/register" className="block px-4 py-2 text-sm hover:bg-gray-100">Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
