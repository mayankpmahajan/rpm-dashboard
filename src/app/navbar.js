'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4 fixed w-full top-0 shadow-lg z-50 ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-500 transition duration-300">
          LAKSHMI TMS
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link href="/" className="hover:text-yellow-400 transition duration-300"></Link>
          <Link href="/about" className="hover:text-yellow-400 transition duration-300"></Link>
          <Link href="/services" className="hover:text-yellow-400 transition duration-300"></Link>
          <Link href="/portfolio" className="hover:text-yellow-400 transition duration-300"></Link>
          <Link href="/contact" className="hover:text-yellow-400 transition duration-300"></Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white p-4 mt-2 rounded-lg shadow-lg">
          <Link href="/" className="block py-2 hover:text-yellow-400">Home</Link>
          <Link href="/about" className="block py-2 hover:text-yellow-400">About</Link>
          <Link href="/services" className="block py-2 hover:text-yellow-400">Services</Link>
          <Link href="/portfolio" className="block py-2 hover:text-yellow-400">Portfolio</Link>
          <Link href="/contact" className="block py-2 hover:text-yellow-400">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
