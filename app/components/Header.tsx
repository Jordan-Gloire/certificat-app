"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-[#0071bc] text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/logoLee.png" // Remplacez par le chemin de votre logo
            alt="CertiGen Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="ml-3 text-lg font-bold">CertiApp</h1>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:underline transition duration-300">
            Accueil
          </Link>
          <Link href="/CertificateTable" className="hover:underline transition duration-300">
            Tableau
          </Link>
          <Link href="/dashboard" className="hover:underline transition duration-300">
            Statistiques
          </Link>
          <Link href="/contact" className="hover:underline transition duration-300">
            Contact
          </Link>
        </nav>

        {/* Menu Mobile Toggle */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex items-center focus:outline-none"
          aria-label="Toggle Menu"
        >
          <div className="space-y-1">
            <span
              className={`block w-6 h-0.5 bg-white transform transition duration-300 ${
                menuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transform transition duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-white transform transition duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Menu Mobile */}
      <div
        className={`md:hidden bg-[#0071bc] text-white transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col space-y-4 py-4 px-6">
          <Link href="/" className="hover:underline transition duration-300">
            Accueil
          </Link>
          <Link href="/CertificateTable" className="hover:underline transition duration-300">
            Tableau
          </Link>
          <Link href="/dashboard" className="hover:underline transition duration-300">
            Statistiques
          </Link>
          <Link href="/contact" className="hover:underline transition duration-300">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
