// "use client";
import Link from "next/link";
import Header from "./components/Header";
import { FaFilePdf, FaArrowRight } from "react-icons/fa"; // Importer les icônes de React Icons

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center h-[80vh] text-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-blue-600 opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-blue-800 md:text-6xl">
              Simplifiez votre gestion de certificats
            </h2>
            <p className="mt-4 text-lg text-gray-700">
              Une application intuitive et sécurisée pour générer, gérer et
              partager vos certificats en quelques clics.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link
                href="/about"
                className="px-6 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Découvrir
              </Link>

              {/* Nouveau bouton Commencez avec icône */}
              <Link
                href="/generate"
                className="px-6 py-3 text-blue-600 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
              >
                <FaFilePdf className="w-5 h-5" />
                <span>Commencez</span>
                <FaArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
