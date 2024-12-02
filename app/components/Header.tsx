"use client"; // Cette directive indique que ce composant doit être rendu côté client

import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-[#0071bc] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          Cabinet Lee Management
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-blue-300">
            Accueil
          </Link>
          <Link href="/about" className="hover:text-blue-300">
            À propos
          </Link>
          <Link href="/contact" className="hover:text-blue-300">
            Contact
          </Link>
        </nav>
        <button
          className="block md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          <div className="space-y-2">
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden bg-blue-600">
          <nav className="flex flex-col space-y-4 px-6 py-4">
            <Link href="/" className="hover:text-blue-300">
              Accueil
            </Link>
            <Link href="/about" className="hover:text-blue-300">
              À propos
            </Link>
            <Link href="/contact" className="hover:text-blue-300">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
