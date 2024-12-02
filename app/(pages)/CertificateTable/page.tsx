"use client";
import Header from '@/app/components/Header';
import React, { useState } from 'react';

interface Certificate {
  id: string;
  name: string;
  type: string;
  date: string;
}

const data: Certificate[] = [
  { id: '1', name: 'John Doe', type: 'Diploma', date: '2024-01-01' },
  { id: '2', name: 'Jane Smith', type: 'Participation', date: '2024-02-15' },
  { id: '3', name: 'Alice Brown', type: 'Diploma', date: '2024-03-10' },
];

const CertificateTable: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'All' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <>
    <Header/>
    <div className="p-6 bg-white h-screen rounded-lg shadow-lg text-black">
      <h2 className="text-2xl font-bold text-[#0071bc] mb-6">Historique des certificats</h2>
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
      <table className="w-full border-collapse overflow-hidden rounded-lg shadow-lg">
        <thead className="bg-[#0071bc] text-black">
          <tr>
            <th className="p-4 text-left">Nom</th>
            <th className="p-4 text-left">Type</th>
            <th className="p-4 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-[#0071bc] hover:text-white transition-colors duration-200"
              >
                <td className="p-4 border-t">{item.name}</td>
                <td className="p-4 border-t">{item.type}</td>
                <td className="p-4 border-t">{item.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-6">
                Aucun certificat trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default CertificateTable;
