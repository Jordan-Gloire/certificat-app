// pages/generate.tsx
"use client";
import { jsPDF } from "jspdf";
import { useState } from "react";
import Header from "../../components/Header";
import { FaFilePdf, FaArrowRight } from "react-icons/fa";

export default function GenerateCertificates() {
  const [formData, setFormData] = useState({
    name: "",
    certificateType: "",
    issueDate: "",
  });
  const [showPreview, setShowPreview] = useState(false); // State pour afficher l'aperçu

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setShowPreview(true); // Met à jour l'aperçu dès que l'utilisateur modifie un champ
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Logique pour générer un PDF ici
  //   console.log("Certificat généré pour", formData);
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, certificateType, issueDate } = formData;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Certificat de " + certificateType, 20, 30);
    doc.text("Nom : " + name, 20, 40);
    doc.text("Date d'émission : " + issueDate, 20, 50);
    doc.save("certificat.pdf"); // Télécharge le PDF
    console.log("Certificat généré");
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800">
        <section className="container mx-auto px-6 py-12">
          <h2 className="text-4xl font-extrabold text-blue-800 text-center">
            Générer vos certificats
          </h2>
          <p className="mt-4 text-lg text-gray-700 text-center">
            Remplissez les informations ci-dessous pour générer votre
            certificat.
          </p>

          <div className="mt-8 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Nom du participant */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-lg font-medium text-blue-700"
                  >
                    Nom du participant
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type de certificat */}
                <div>
                  <label
                    htmlFor="certificateType"
                    className="block text-lg font-medium text-blue-700"
                  >
                    Type de certificat
                  </label>
                  <input
                    type="text"
                    id="certificateType"
                    name="certificateType"
                    value={formData.certificateType}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date d'émission */}
                <div>
                  <label
                    htmlFor="issueDate"
                    className="block text-lg font-medium text-blue-700"
                  >
                    {"Date d'émission"}
                  </label>
                  <input
                    type="date"
                    id="issueDate"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Bouton de génération */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    className="px-8 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
                  >
                    <FaFilePdf className="w-5 h-5" />
                    <span>Générer le certificat</span>
                    <FaArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          {/* Section d'aperçu */}
          {showPreview && (
            <div className="mt-12 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-300">
              <h3 className="text-2xl font-bold text-blue-800">
                Aperçu du certificat
              </h3>
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-lg font-semibold text-blue-700">
                  Certificat de {formData.certificateType}
                </p>
                <p className="mt-2 text-md text-gray-700">
                  Nom : {formData.name}
                </p>
                <p className="mt-2 text-md text-gray-700">
                  {"Date d'émission :"} {formData.issueDate}
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
