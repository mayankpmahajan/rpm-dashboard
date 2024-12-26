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
        <div className="md:flex space-x-8">
          <Link href="/auth" className="hover:text-yellow-400 transition duration-300">Admin</Link>
 
        </div>

        {/* Hamburger Menu (Mobile) */}
     
      </div>

      
   
    </nav>
  );
};

export default Navbar;
