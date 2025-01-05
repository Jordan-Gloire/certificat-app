"use client";
import Header from "@/app/components/Header";
import React, { useState, useEffect } from "react";
import { getCertificates } from "@/app/actions/getCerti";
import { toast, ToastContainer } from "react-toastify"; // Importation de Toastify
import "react-toastify/dist/ReactToastify.css";
import { FaArrowRight,FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";

type Certificate = {
  id: number;
  fullName: string;
  city: string;
  issueDate: string;
  birthDate: string | null;
  formationDateDebut: string | null;
  formationDateFin: string | null;
  formationOption: string | null;
  createdAt: string;
  updatedAt: string;
};

const CertificateTable: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("All");
  const [data, setData] = useState<Certificate[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string>("");

  // Fonction pour gérer la récupération des certificats
  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      // setError("");  // Réinitialiser l'erreur avant chaque appel
      try {
        const certificates = await getCertificates();
        const certificatesWithFormattedDates = certificates.map((certificate) => ({
          ...certificate,
          issueDate: new Date(certificate.issueDate).toLocaleDateString(),
          createdAt: new Date(certificate.createdAt).toLocaleDateString(),
          updatedAt: new Date(certificate.updatedAt).toLocaleDateString(),
          formationDateDebut: certificate.formationDateDebut
            ? new Date(certificate.formationDateDebut).toLocaleDateString()
            : null,
          formationDateFin: certificate.formationDateFin
            ? new Date(certificate.formationDateFin).toLocaleDateString()
            : null,
        }));
        setData(certificatesWithFormattedDates);
      } catch (err) {
        // setError("Erreur lors de la récupération des certificats.");
        // Affichage du toast d'erreur
        toast.error("❌ Une erreur est survenue lors de la récupération des certificats !", {
          position: "top-center",  // Position du toast
          autoClose: 3000,         // Durée d'affichage du toast (3 secondes)
          hideProgressBar: false,  // Afficher la barre de progression
          closeOnClick: true,      // Fermer le toast au clic
          pauseOnHover: true,      // Mettre en pause le toast lors du survol
          draggable: true,         // Rendre le toast déplaçable
          theme: "light",          // Thème clair
        });
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []); // Cette fonction s'exécute uniquement lors du montage du composant

  // Filtrage des données
  const filteredData = data.filter((item) => {
    const matchesSearch = item.fullName.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || item.formationOption === filterType;
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fonction de changement de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fonction de gestion du filtrage par type (Option de formation)
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value);
    setCurrentPage(1); // Revenir à la première page après un nouveau filtre
  };

  // Fonction de gestion de la recherche
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Revenir à la première page après une recherche
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-6">
        {/* Affichage de l'état de chargement */}
        {loading && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="flex items-center space-x-4 bg-white p-6 rounded-lg shadow-lg">
              {/* Spinner */}
              <div className="w-12 h-12 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
              <p className="text-lg font-medium text-gray-700">Veuillez patienter, chargement des certificats...</p>
            </div>
          </div>
        )}


        {/* Affichage des erreurs */}
        {/* {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-500 rounded-lg">
            <p>{error}</p>
          </div>
        )} */}

        {/* Formulaire de recherche et de filtrage */}
        <div className="mb-6 flex flex-col justify-between items-center">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={search}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
            />
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
            >
              <option value="All">Tous</option>
              <option value="Option 1">Secretariat de direction</option>
              <option value="Option 2">Gestion de Stock</option>
              <option value="Option 3">Resources Humaines</option>
            </select>
          </div>
        </div>

        {/* Liste des certificats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginatedData.map((certificate) => (
            <div
              key={certificate.id}
              className="p-6 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-semibold text-gray-800"><span className="text-md font-medium">Nom:</span> {certificate.fullName}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        
                {/* Formation avec icône PDF */}
                <div className="flex items-center space-x-2">
                  <FaGraduationCap className="text-orange-500" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Formation:</span> {certificate.formationOption || "Non spécifiée"}
                  </p>
                </div>

                {/* Ville avec icône Excel */}
                <div className="flex items-center space-x-2">
                  <FaMapMarkerAlt className="text-blue-500" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Ville:</span> {certificate.city || "Non précisée"}
                  </p>
                </div>

                {/* Ajout d'une couleur de fond pour séparer les sections */}
                <div className="col-span-2 mt-4 p-4 bg-gray-100 rounded-md flex items-center justify-between">
                  <p className="text-sm text-gray-600 flex items-center">
                    <FaArrowRight className="text-blue-500 mr-2" />
                    <span className="font-medium">Détails supplémentaires</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Pagination */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Précédent
          </button>

          <span className="text-lg text-gray-700">
            {currentPage}/{totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Suivant
          </button>
        </div>
      </div>

      {/* Container pour afficher les toasts */}
      <ToastContainer />
    </>
  );
};

export default CertificateTable;
