// "use client";
import Link from "next/link";
import Header from "./components/Header";
import { FaFilePdf, FaArrowRight } from "react-icons/fa"; // Importer les icônes de React Icons

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen text-gray-800">
        {/* Hero Section */}
        <section
          className="relative flex items-center justify-center h-screen  text-center bg-cover bg-center"
          style={{
            backgroundImage: "url('/home (4).jpg')",
          }}
        >
          {/* Overlay noir avec opacité */}
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative z-10 mx-4 lg:mx-0">
            <h2 className="text-4xl font-extrabold text-white md:text-6xl">
              Simplifiez votre gestion de certificats
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Une application intuitive et sécurisée pour générer, gérer et
              partager vos certificats en quelques clics.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Link
                href="/about"
                className="px-6 py-3 text-white bg-[#0071bc] rounded-lg  hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Découvrir
              </Link>

              {/* Nouveau bouton Commencez avec icône */}
              <Link
                href="/generate"
                className="px-6 py-3 text-[#0071bc] bg-white rounded-lg  hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
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
