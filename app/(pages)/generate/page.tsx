"use client";
import { jsPDF } from "jspdf";
import React, { useState } from "react";
import Header from "../../components/Header";
import { FaFilePdf, FaFileExcel, FaArrowRight } from "react-icons/fa";
import { addCerti } from "@/app/actions/addCerti";
import { Bounce, toast, ToastContainer } from "react-toastify"; // Importation de Toastify
import "react-toastify/dist/ReactToastify.css"; // Importation des styles de Toastify

export default function GenerateCertificates() {
  const [formData, setFormData] = useState({
    fullName: "",
    certificateType: "",
    issueDate: "",
    city: "",
  });
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    }
  };
  const [showPreview, setShowPreview] = useState(false); // State pour afficher l'aperçu

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setShowPreview(true); // Met à jour l'aperçu dès que l'utilisateur modifie un champ
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { fullName, certificateType, issueDate, city } = formData;

    try {
      // Étape 1 : Envoyer les données au backend pour les enregistrer dans la base de données
      const formattedIssueDate = new Date(issueDate);
      const savedCertification = await addCerti({
        fullName,
        certificateType,
        issueDate: formattedIssueDate.toISOString(),
        city,
      });
      console.log("Certificat enregistré ", savedCertification);

      // Étape 2 : Générer le certificat PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [842, 595], // Taille A4 en pixels
      });

      // Ajout l'image du certificat comme arrière-plan
      const imageUrl = "/model-certificat.png"; // Chemin vers l'image du modèle
      const imgWidth = 842; // Largeur de l'image
      const imgHeight = 595; // Hauteur de l'image

      // Charger l'image
      const img = await fetch(imageUrl).then((res) => res.blob());
      const reader = new FileReader();
      reader.onload = () => {
        doc.addImage(
          reader.result as string,
          "JPEG",
          0,
          0,
          imgWidth,
          imgHeight
        );

        // Ajouter le texte dynamique
        doc.setFontSize(20);
        doc.text(fullName, 200, 300); // Coordonnées pour le nom
        doc.text(certificateType, 200, 350); // Coordonnées pour le type
        doc.text(issueDate, 200, 400); // Coordonnées pour la date
        doc.text(city, 200, 450); // Coordonnées pour la ville

        // Télécharger le certificat
        doc.save("certificat.pdf");

        // Afficher un toast de confirmation
        toast.success("📄 Certificat téléchargé avec succès !", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        // Réinitialiser le formulaire
        setFormData({
          fullName: "",
          certificateType: "",
          issueDate: "",
          city: "",
        });
      };
      reader.readAsDataURL(img);
    } catch (error) {
      console.error("Erreur lors de la génération du certificat :", error);
      toast.error("❌ Une erreur est survenue lors de la génération !", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <>
      <Header />
      <ToastContainer /> {/* Conteneur React Toastify */}
      <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800">
        <section className="container mx-auto px-6 py-12">
          <h2 className="text-4xl font-extrabold text-[#0071bc] text-center">
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
                    className="block text-lg font-medium text-[#0071bc]"
                  >
                    Nom du participant
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Type de certificat */}
                <div>
                  <label
                    htmlFor="certificateType"
                    className="block text-lg font-medium text-[#0071bc]"
                  >
                    Type de certificat
                  </label>
                  {/* <input
                    type="text"
                    id="certificateType"
                    name="certificateType"
                    value={formData.certificateType}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  /> */}
                  <select
                    required
                    value={formData.certificateType}
                    onChange={handleChange}
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="certificateType"
                    id="certificateType"
                  >
                    <option value="">-- Selectionnez --</option>
                    <option value="Fin-de-formation">Fin de formation</option>
                    <option value="Fin-de-stage">Fin de stage</option>
                    <option value="Participation">Participation</option>
                  </select>
                </div>

                {/* Date d'émission */}
                <div>
                  <label
                    htmlFor="issueDate"
                    className="block text-lg font-medium text-[#0071bc]"
                  >
                    {"Date émission"}
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
                {/* city */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-lg font-medium text-[#0071bc]"
                  >
                    {"Ville"}
                  </label>
                  {/* <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  /> */}
                  <select
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option value="">-- Selectionnez --</option>
                    <option value="pointe-noire">Pointe-Noire</option>
                    <option value="brazzaville">Brazzaville</option>
                  </select>
                </div>

                {/* Bouton de génération */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  {/* Premier bouton : Générer le certificat */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-8 py-3 text-white bg-[#0071bc] rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
                    >
                      <FaFilePdf className="w-5 h-5" />
                      <span>Générer le certificat</span>
                      <FaArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Deuxième bouton : Importer fichier Excel */}
                  <div className="flex justify-center">
                    {/* Label pour le bouton personnalisé */}
                    <label
                      htmlFor="file-upload"
                      className="px-8 py-3 text-white bg-[#0071bc] rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 cursor-pointer"
                    >
                      <FaFileExcel className="w-5 h-5" />
                      <span>Importer fichier Excel</span>
                      <FaArrowRight className="w-5 h-5" />
                    </label>

                    {/* Input de type file caché */}
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept=".xlsx, .xls"
                      onChange={handleFileChange} // Gestion du changement de fichier
                    />
                  </div>
                  {fileName && (
                    <p className="mt-2 text-center text-sm text-gray-700">
                      Fichier sélectionné : {fileName}
                    </p>
                  )}

                  {/* Troisième bouton : Générer le certificat après import */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-8 py-3 text-white bg-[#0071bc] rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2"
                    >
                      <FaFilePdf className="w-5 h-5" />
                      <span>Générer le certificat après import</span>
                      <FaArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          {/* Section d'aperçu */}
          {showPreview && (
            <div className="mt-12 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-300">
              <h3 className="text-2xl font-bold text-[#0071bc] mb-4 text-center">
                Aperçu du certificat
              </h3>

              {/* Conteneur du certificat */}
              <div
                className="relative w-full h-[595px] mx-auto bg-no-repeat bg-cover border border-blue-200 rounded-lg"
                style={{
                  backgroundImage: 'url("/model-certificat.png")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Texte dynamique sur le certificat */}
                <div className="absolute top-[30%] left-[20%] text-left">
                  <p className="text-xl font-bold text-[#0071bc]">
                    {formData.certificateType}
                  </p>
                  <p className="text-6xl text-center font-bold text-gray-800 mt-2">
                    {formData.fullName}
                  </p>
                  <p className="text-lg text-gray-800 mt-[200px]">
                    {formData.issueDate}
                  </p>
                  <p className="text-lg text-gray-800 mt-2">{formData.city}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
