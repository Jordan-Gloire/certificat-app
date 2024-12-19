"use client";
import { jsPDF } from "jspdf";
import React, { useState } from "react";
import Header from "../../components/Header";
import { FaFilePdf, FaFileExcel, FaArrowRight } from "react-icons/fa";
import { addCerti } from "@/app/actions/addCerti";
import { Bounce, toast, ToastContainer } from "react-toastify"; // Importation de Toastify
import "react-toastify/dist/ReactToastify.css"; // Importation des styles de Toastify
import { read, utils } from "xlsx";

export default function GenerateCertificates() {
  const [formData, setFormData] = useState({
    fullName: "",
    issueDate: "",
    birthDate: "",
    formationDateDebut: "",
    formationDateFin: "",
    formationOption: "",
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

    const {
      fullName,
      issueDate,
      city,
      birthDate,
      formationDateDebut,
      formationDateFin,
      formationOption,
    } = formData;

    try {
      // Étape 1 : Envoyer les données au backend pour les enregistrer dans la base de données
      const formattedIssueDate = new Date(issueDate);
      const savedCertification = await addCerti({
        fullName,
        issueDate: formattedIssueDate.toISOString(),
        city,
        birthDate: formattedIssueDate.toISOString(),
        formationDateDebut: formattedIssueDate.toISOString(),
        formationDateFin: formattedIssueDate.toISOString(),
        formationOption: formattedIssueDate.toISOString(),
      });
      console.log("Certificat enregistré ", savedCertification);

      // Étape 2 : Générer le certificat PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [842, 595], // Taille A4 en pixels
      });

      // Ajout l'image du certificat comme arrière-plan
      const imageUrl = "/model-certificat.jpg"; // Chemin vers l'image du modèle
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
        doc.text(birthDate, 200, 350); // Coordonnées pour le type
        doc.text(formationDateFin, 200, 350); // Coordonnées pour le type
        doc.text(formationDateDebut, 200, 350); // Coordonnées pour le type
        doc.text(formationOption, 200, 350); // Coordonnées pour le type
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
          birthDate: "",
          formationDateDebut: "",
          formationDateFin: "",
          formationOption: "",
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
  interface dataFromExcel {
    fullName: string;
    issueDate: string;
    birthDate: string;
    formationDateDebut: string;
    formationDateFin: string;
    formationOption: string;
    city: string;
  }
  // VALIDATION DES DONNEE
  // const isDataFromExcel = (data: dataFromExcel): data is dataFromExcel => {
  //   return (
  //     typeof data.fullName === "string" &&
  //     typeof data.issueDate === "string" &&
  //     typeof data.birthDate === "string" &&
  //     typeof data.formationDateDebut === "string" &&
  //     typeof data.formationDateFin === "string" &&
  //     typeof data.formationOption === "string" &&
  //     typeof data.city === "string"
  //   );
  // };
  // FONCTION L'IMPORT DU FILE EXCEL

  const importExcelFile = async (file: File): Promise<dataFromExcel[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        if (!data) return reject("Erreur lors de la lecture du fichier.");

        try {
          // Lire les données en tant que tableau d'octets
          const workbook = read(new Uint8Array(data as ArrayBuffer), {
            type: "array",
          });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];

          // Transformer les données en JSON brut
          const rawData = utils.sheet_to_json(
            sheet
          ) as unknown as dataFromExcel[];

          // Vérifier si les champs attendus sont présents
          const requiredFields = [
            "fullName",
            "issueDate",
            "birthDate",
            "formationDateDebut",
            "formationDateFin",
            "formationOption",
            "city",
          ];

          // Filtrer les données invalides
          const validatedData = rawData.filter((row) =>
            requiredFields.every((field) => field in row)
          );

          // Vérifier si des données invalides existent
          if (validatedData.length === 0) {
            return reject(
              "Le fichier Excel ne contient pas les champs attendus."
            );
          }

          resolve(validatedData as dataFromExcel[]);
        } catch (error) {
          console.error("Erreur lors de l'analyse du fichier Excel.", error);
          toast.error("❌ Erreur lors de l'analyse du fichier Excel.!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          reject("Erreur lors de l'analyse du fichier Excel.");
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };
  // const FileUploader = () => {
  //   const [file, setFile] = useState<File | null>(null); // Stocke l'objet fichier
  //   const [fileName, setFileName] = useState<string>(""); // Stocke le nom du fichie
  //   // Gestionnaire pour capturer le fichier sélectionné
  //   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const files = e.target.files;
  //     if (files && files.length > 0) {
  //       setFile(files[0]); // Met à jour l'objet fichier
  //       setFileName(files[0].name); // Met à jour le nom du fichier
  //     }
  //   };
  // };
  const handleImportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      try {
        const data = await importExcelFile(file);
        console.log("Données importées :", data); // Traitez les données importées ici
        alert("Importation réussie !");
      } catch (error) {
        console.error("Erreur :", error);
        toast.error(
          "❌ Le fichier Excel ne contient pas les champs attendus.!",
          {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          }
        );
      }
    } else {
      toast.error("❌ Veuillez sélectionner un fichier avant de soumettre !", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      // alert("Veuillez sélectionner un fichier avant de soumettre.");
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
                    htmlFor="fullName"
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

                {/* Date de naissance */}
                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-lg font-medium text-[#0071bc]"
                  >
                    Date de naissance
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date d'émission */}
                <div>
                  <label
                    htmlFor="issueDate"
                    className="block text-lg font-medium text-[#0071bc]"
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

                {/* Date de début de formation */}
                <div>
                  <label
                    htmlFor="formationDateDebut"
                    className="block text-lg font-medium text-[#0071bc]"
                  >
                    Date de début de formation
                  </label>
                  <input
                    type="date"
                    id="formationDateDebut"
                    name="formationDateDebut"
                    value={formData.formationDateDebut}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Date de fin de formation */}
                <div>
                  <label
                    htmlFor="formationDateFin"
                    className="block text-lg font-medium text-[#0071bc]"
                  >
                    Date de fin de formation
                  </label>
                  <input
                    type="date"
                    id="formationDateFin"
                    name="formationDateFin"
                    value={formData.formationDateFin}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Option de formation */}
                <div>
                  <label
                    htmlFor="formationOption"
                    className="block text-lg font-medium text-[#0071bc]"
                  >
                    Option de formation
                  </label>
                  <select
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    name="formationOption"
                    id="formationOption"
                    value={formData.formationOption}
                    onChange={handleChange}
                  >
                    <option value="">-- Sélectionnez --</option>
                    <option value="Option 1">Option 1</option>
                    <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                  </select>
                </div>

                {/* Ville */}
                <div>
                  <label
                    htmlFor="city"
                    className="block text-lg font-medium text-[#0071bc]"
                  >
                    Ville
                  </label>
                  <select
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                  >
                    <option value="">-- Sélectionnez --</option>
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
                  {/* <div className="flex justify-center">
                      <label
                        htmlFor="file-upload"
                        className="px-8 py-3 text-white bg-[#0071bc] rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 cursor-pointer"
                      >
                        <FaFileExcel className="w-5 h-5" />
                        <span>Importer fichier Excel</span>
                        <FaArrowRight className="w-5 h-5" />
                      </label>

                      <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".xlsx, .xls"
                        onChange={handleFileChange} // Gestion du changement de fichier
                      />
                    </div> */}
                  {fileName && (
                    <p className="mt-2 text-center text-sm text-gray-700">
                      Fichier sélectionné : {fileName}
                    </p>
                  )}
                </div>
              </div>
            </form>
            <ToastContainer /> {/* Conteneur React Toastify */}
            <form className="mt-4" onSubmit={handleImportSubmit}>
              {/* Troisième bouton : Générer le certificat après import */}
              <div className="flex justify-center mb-4">
                <label
                  htmlFor="file-upload"
                  className="px-8 py-3 text-white bg-[#0071bc] rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 cursor-pointer"
                >
                  <FaFileExcel className="w-5 h-5" />
                  <span>Importer fichier Excel</span>
                  <FaArrowRight className="w-5 h-5" />
                </label>

                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange} // Gestion du changement de fichier
                />
              </div>
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
                  backgroundImage: 'url("/model-certificat.jpg")',
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Texte dynamique sur le certificat */}
                <div className="absolute top-[30%] left-[20%] text-left">
                  {/* <p className="text-xl font-bold text-[#0071bc]">
                    {formData.certificateType}
                  </p> */}
                  <p className="text-sm font-bold mt-36">{formData.fullName}</p>
                  <p className="text-sm font-bold">{formData.birthDate}</p>
                  <p className="text-sm font-bold mt-2 -ml-4">
                    {formData.formationOption}
                  </p>
                  <div className="flex gap-2">
                    <p className="text-sm font-bold mt-[14px] ml-[355px]">
                      {formData.city}
                    </p>
                    <p className="text-sm font-bold mt-[14px]">
                      {formData.issueDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-sm font-bold -mt-[68px] ml-[366px]">
                      {formData.formationDateDebut}
                    </p>
                    <p className="text-sm font-bold -mt-[68px] ml-[4px]">
                      {formData.formationDateFin}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
