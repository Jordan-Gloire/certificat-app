"use client";
import Header from "@/app/components/Header";
import React, { useState, useEffect } from "react";
import { getCertificates } from "@/app/actions/getCerti";
import Link from "next/link";

// type Certificate = {
//   id: number;
//   fullName: string;
//   city: string;
//   issueDate: Date; // Remplacez 'string' par 'Date'
//   certificateType: string;
//   createdAt: Date;
//   updatedAt: Date;
// };
type Certificate = {
  id: number;
  fullName: string;
  city: string;
  issueDate: Date;
  birthDate: string | null;
  formationDateDebut: Date | null;
  formationDateFin: Date | null;
  formationOption: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const CertificateTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [data, setData] = useState<Certificate[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      setError("");
      try {
        const certificates = await getCertificates(); // Appel à la Server Action
        setData(certificates);
        // I fixed the bug here
      } catch (err) {
        setError("Erreur lors de la récupération des certificats.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // Filtrage des données
  const filteredData = data.filter((item) => {
    const matchesSearch = item.fullName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesType =
      filterType === "All" || item.formationOption === filterType;
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Gestion de la pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Header />
      <div className="p-6 bg-white rounded-lg shadow-lg text-black">
        <h2 className="text-2xl font-bold text-[#0071bc] mb-6">
          Historique des certificats
        </h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher par nom"
            className="w-full md:w-auto flex-grow border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071bc]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="w-full md:w-auto flex-grow border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0071bc]"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">Tous</option>
            <option value="Diploma">Diplôme</option>
            <option value="Participation">Participation</option>
          </select>
        </div>

        {/* Table des certificats */}
        {loading ? (
          <p className="text-center text-gray-500">Chargement des données...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div>
            <table className="w-full border-collapse overflow-hidden rounded-lg shadow-lg">
              <thead className="bg-[#0071bc] text-white">
                <tr>
                  <th className="p-4 text-left">Nom</th>
                  <th className="p-4 text-left">Type</th>
                  <th className="p-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#0071bc] hover:text-white transition-colors duration-200"
                    >
                      <td className="p-4 border-t">
                        <Link
                          href={`/CertificateTable/${item.id}`}
                          className="block"
                        >
                          {item.fullName}
                        </Link>
                      </td>
                      <td className="p-4 border-t">
                        <Link
                          href={`/CertificateTable/${item.id}`}
                          className="block"
                        >
                          {item.formationOption}
                        </Link>
                      </td>
                      <td className="p-4 border-t">
                        <Link
                          href={`/CertificateTable/${item.id}`}
                          className="block"
                        >
                          {new Date(item.issueDate).toLocaleDateString()}
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-6">
                      Aucun certificat trouvé.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-6">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`mx-1 px-3 py-1 rounded-lg ${
                      currentPage === index + 1
                        ? "bg-[#0071bc] text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-[#005a8c] transition`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
export default CertificateTable;
