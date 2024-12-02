// "use client ";
import Link from "next/link";
import Header from "../../components/Header";
import {
  FaCheckCircle,
  FaFileExcel,
  FaHistory,
  FaUserCircle,
  FaDatabase,
  FaTrashAlt
} from 'react-icons/fa'; // Importer les icônes de React Icons (Font Awesome)

export default function About() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800">
        <header className="text-black text-center py-4">
          <div className="container mx-auto px-6">
            <h1 className="text-2xl font-bold">{"À propos de l'application"}</h1>
            <p className="mt-2">
              {"Tout ce que vous devez savoir sur l'application de gestion de certificats."}
            </p>
          </div>
        </header>
        <section className="container mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-blue-800">Fonctionnalités principales</h2>
          <ul className="mt-6 space-y-4">
            <li className="p-4 bg-white rounded-lg shadow-md flex items-start space-x-4">
              <FaCheckCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-blue-700">Génération de certificats</h3>
                <p className="text-gray-600">
                  Créez des certificats en quelques clics avec des modèles professionnels et personnalisables.
                </p>
              </div>
            </li>
            <li className="p-4 bg-white rounded-lg shadow-md flex items-start space-x-4">
              <FaFileExcel className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-blue-700">Import de données Excel</h3>
                <p className="text-gray-600">
                  Importez des données pour générer plusieurs certificats en une seule opération.
                </p>
              </div>
            </li>
            <li className="p-4 bg-white rounded-lg shadow-md flex items-start space-x-4">
              <FaHistory className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold text-blue-700">Historique des certificats</h3>
                <p className="text-gray-600">
                  Consultez et téléchargez les certificats déjà générés à tout moment.
                </p>
              </div>
            </li>
          </ul>
        </section>
        <section className="container mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-blue-800">{"Comment utiliser l'application"}</h2>
          <ol className="mt-6 space-y-4">
            <li className="p-4 bg-white rounded-lg shadow-md flex items-start space-x-4">
              <FaUserCircle className="w-8 h-8 text-blue-600" />
              <span>
                <span className="text-blue-600 font-bold">1. Inscription/Connexion :</span>{" "}
                Créez un compte ou connectez-vous pour commencer.
              </span>
            </li>
            <li className="p-4 bg-white rounded-lg shadow-md flex items-start space-x-4">
              <FaDatabase className="w-8 h-8 text-blue-600" />
              <span>
                <span className="text-blue-600 font-bold">2. Génération de certificats :</span>{" "}
                Renseignez les informations nécessaires ou importez un fichier Excel.
              </span>
            </li>
            <li className="p-4 bg-white rounded-lg shadow-md flex items-start space-x-4">
              <FaTrashAlt className="w-8 h-8 text-blue-600" />
              <span>
                <span className="text-blue-600 font-bold">3. Historique et gestion :</span>{" "}
                Consultez, téléchargez ou supprimez des certificats générés.
              </span>
            </li>
          </ol>
        </section>
        <footer className="bg-gray-100 py-6">
          <div className="container mx-auto px-6 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
              {"Retour à l'accueil"}
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
