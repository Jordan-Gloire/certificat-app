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
    ville: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const { name, certificateType, issueDate } = formData;
  
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [842, 595], // Taille A4 en pixels
    });
  
    // Ajouter l'image du certificat comme arrière-plan
    const imageUrl = "/model-certificat.png"; // Chemin vers l'image du modèle
    const imgWidth = 842; // Largeur de l'image
    const imgHeight = 595; // Hauteur de l'image
  
    // Charger l'image
    const img = await fetch(imageUrl).then((res) => res.blob());
    const reader = new FileReader();
    reader.onload = () => {
      doc.addImage(reader.result as string, "JPEG", 0, 0, imgWidth, imgHeight);
  
      // Ajouter le texte dynamique
      doc.setFontSize(20);
      doc.text(name, 200, 300); // Coordonnées pour le nom
      doc.text(certificateType, 200, 350); // Coordonnées pour le type
      doc.text(issueDate, 200, 400); // Coordonnées pour la date
  
      // Télécharger le certificat
      doc.save("certificat.pdf");
    };
    reader.readAsDataURL(img);
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
                {/* Ville*/}
                <div>
                  <label
                    htmlFor="issueDate"
                    className="block text-lg font-medium text-blue-700"
                  >
                    {"Ville"}
                  </label>
                  <input
                    type="text"
                    id="ville"
                    name="ville"
                    value={formData.ville}
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
  <div className="mt-12 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-300">
    <h3 className="text-2xl font-bold text-blue-800 mb-4 text-center">
      Aperçu du certificat
    </h3>

    {/* Conteneur du certificat */}
    <div
      className="relative w-full h-[595px] mx-auto bg-no-repeat bg-cover border border-blue-200 rounded-lg"
      style={{
        backgroundImage: `url('/model-certificat.png')`, // Assure-toi que le chemin est correct
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Texte dynamique sur le certificat */}
      <div className="absolute top-[30%] left-[20%] text-left">
        <p className="text-xl font-bold text-blue-900">
          {formData.certificateType}
        </p>
        <p className="text-lg text-gray-800 mt-2">
          {formData.name}
        </p>
        <p className="text-lg text-gray-800 mt-2">
          {formData.issueDate}
        </p>
        <p className="text-lg text-gray-800 mt-2">
           {formData.ville}
        </p>
      </div>
    </div>
  </div>
)}

        </section>
      </main>
    </>
  );
}
