"use client";
import { jsPDF } from "jspdf";
import React, { useState } from "react";
import Header from "../../components/Header";
import { FaFilePdf, FaFileExcel, FaArrowRight } from "react-icons/fa";
import { addCerti } from "@/app/actions/addCerti";
import { Bounce, toast, ToastContainer } from "react-toastify"; // Importation de Toastify
import "react-toastify/dist/ReactToastify.css"; // Importation des styles de Toastify
import { read, utils } from "xlsx";
import JSZip from "jszip";
import { saveAs } from "file-saver";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"

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
  const [isLoading, setIsLoading] = useState(false); // Gérer l'état de chargement

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
    }
  };
  const [showPreview, setShowPreview] = useState(false); // State pour afficher l'aperçu

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setShowPreview(false); // Met à jour l'aperçu dès que l'utilisateur modifie un champ
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
      setIsLoading(true); // Mettre le bouton en mode chargement
      // Étape 1 : Envoyer les données au backend pour les enregistrer dans la base de données
      // const formattedIssueDate = new Date(issueDate);
      // const savedCertification = await addCerti({
      //   fullName,
      //   issueDate: formattedIssueDate.toISOString(),
      //   city,
      //   birthDate: formattedIssueDate.toISOString(),
      //   formationDateDebut: formattedIssueDate.toISOString(),
      //   formationDateFin: formattedIssueDate.toISOString(),
      //   formationOption: formattedIssueDate.toISOString(),
      // });
      // console.log("Certificat enregistré ", savedCertification);

      // Étape 2 : Générer le certificat PDF
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [842, 595], // Taille A4 en pixels
      });

      // Ajout de l'image du certificat comme arrière-plan
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

        // Ajouter le texte dynamique avec des positions ajustées
        doc.setFont("times", "normal"); // Police similaire au certificat
        doc.setFontSize(16); // Taille de police adaptée

        // Nom
        doc.text(fullName, 170, 339); // Ajuster la position
        // Date de naissance
        doc.text(birthDate, 150, 355);
        // Option de formation
        doc.text(formationOption, 145, 386);
        // Date début de formation
        doc.text(formationDateDebut, 535, 370); // Ajusté pour être aligné avec "du"
        // Date fin de formation
        doc.text(formationDateFin, 610, 370); // Aligné après "au"
        // Ville
        doc.text(city, 523, 419); // Aligné avec "Fait à"
        // Date d'émission
        doc.text(issueDate ,595, 419); // Aligné après la ville

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
    } finally {
      setIsLoading(false); // Arrêter le mode chargement
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
  
  // FONCTION L'IMPORT DU FILE EXCEL

  const importExcelFile = async (file: File): Promise<dataFromExcel[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target?.result;
        if (!data) return reject("Erreur lors de la lecture du fichier.");

        try {
          const workbook = read(new Uint8Array(data as ArrayBuffer), { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];

          const rawData = utils.sheet_to_json(sheet) as unknown as dataFromExcel[];

          const requiredFields = [
            "fullName",
            "issueDate",
            "birthDate",
            "formationDateDebut",
            "formationDateFin",
            "formationOption",
            "city",
          ];

          const validatedData = rawData.filter((row) =>
            requiredFields.every((field) => field in row)
          );

          if (validatedData.length === 0) {
            return reject("Le fichier Excel ne contient pas les champs attendus.");
          }

          resolve(validatedData);
        } catch (error) {
          console.error("Erreur lors de l'analyse du fichier Excel.", error);
          reject("Erreur lors de l'analyse du fichier Excel.");
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const handleImportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput?.files?.[0];

    if (file) {
      try {
        // Étape 1: Lecture et validation du fichier Excel
        const data = await importExcelFile(file);
        console.log('Données importées:', data);

        toast.success("📄 Données importées avec succès !", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "light",
          transition: Bounce,
        });

        // Étape 2: Créer le fichier ZIP avec les certificats PDF
        const zip = new JSZip();

        // Étape 3: Traitement des données et génération de certificats PDF
        for (const element of data) {
          const doc = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [842, 595],
          });

          const imageUrl = "/model-certificat.jpg";
          const img = await fetch(imageUrl).then((res) => res.blob());
          const reader = new FileReader();

          // Assurer que l'image est chargée avant d'ajouter du texte au PDF
          reader.onload = async () => {
            // Ajouter l'image du modèle de certificat
            doc.addImage(reader.result as string, "JPEG", 0, 0, 842, 595);

            // Ajouter le texte dynamique (données du fichier Excel)
            doc.setFont("times", "normal"); // Police similaire au certificat
            doc.setFontSize(16);
            // doc.text(element.fullName, 200, 300);
            // doc.text(formatDate(element.birthDate), 200, 350);
            // doc.text(formatDate(element.formationDateFin), 200, 400);
            // doc.text(formatDate(element.formationDateDebut), 200, 450);
            // doc.text(element.formationOption, 200, 500);
            // doc.text(formatDate(element.issueDate), 200, 550);
            // doc.text(element.city, 200, 600);
             // Nom
            doc.text(element.fullName, 170, 339); // Ajuster la position
            // Date de naissance
            doc.text(formatDate(element.birthDate), 150, 355);
            // Option de formation
            doc.text(formatDate(element.formationOption), 145, 386);
            // Date début de formation
            doc.text(formatDate(element.formationDateDebut), 535, 370); // Ajusté pour être aligné avec "du"
            // Date fin de formation
            doc.text(formatDate(element.formationDateFin), 610, 370); // Aligné après "au"
            // Ville
            doc.text(element.city, 523, 419); // Aligné avec "Fait à"
            // Date d'émission
            doc.text(formatDate(element.issueDate),595, 419); // Aligné après la ville

            // Créer un blob PDF
            const pdfBlob = doc.output("blob");
            zip.file(`${element.fullName}_certificat.pdf`, pdfBlob);

            // Étape 4: Enregistrer les données dans la base de données via Prisma
            function processDate(date: Date): string {
              // Format the date as needed
              return date.toISOString().slice(0, 10); // Return the date in the format "YYYY-MM-DD"
            }
            // Sérialiser les dates avant de les envoyer
            const serializedData = {
              fullName: element.fullName,
              issueDate: processDate(new Date(element.issueDate)),
              birthDate: processDate(new Date(element.birthDate)),
              formationDateDebut: processDate(new Date(element.formationDateDebut)),
              formationDateFin: processDate(new Date (element.formationDateFin)),
              formationOption: element.formationOption,
              city: element.city,
            };

            // Appel à l'API pour enregistrer les données dans la base de données
            await addCerti(serializedData);
          };

          reader.readAsDataURL(img);
        }

        // Étape 5: Télécharger le fichier ZIP avec tous les certificats générés
        const zipContent = await zip.generateAsync({ type: "blob" });
        saveAs(zipContent, "certificats.zip");

        toast.success("📂 Certificats générés et téléchargés avec succès !", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "light",
          transition: Bounce,
        });
      } catch (error) {
        console.error("Erreur lors de l'importation:", error);
        toast.error("❌ Une erreur est survenue lors de l'importation.", {
          position: "bottom-right",
          autoClose: 3000,
          theme: "light",
        });
      }
    } else {
      toast.error("❌ Veuillez sélectionner un fichier avant de soumettre !", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "light",
      });
    }
  };

  // Fonction pour formater la date (30/12/2020) au format lisible
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return ""; // Si dateString est vide ou undefined, retourner une chaîne vide.

    // Si dateString est déjà un objet Date, on le formate directement
    if (typeof dateString === 'string') {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString(); // Retourne une date lisible
      }
    }

    // Si dateString est une chaîne, on peut la convertir en Date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString(); // Retourne une date lisible
    }

    // Si dateString est un nombre (ex : Excel serial date), convertissons-la
    if (!isNaN(Number(dateString))) {
      const excelDate = parseInt(dateString, 10);
      const msPerDay = 86400000; // Nombre de millisecondes dans un jour
      const excelStartDate = new Date(1900, 0, 1); // Excel commence ses dates le 1er janvier 1900
      const date = new Date(excelStartDate.getTime() + (excelDate - 2) * msPerDay); // -2 car Excel considère 1900 comme année bissextile
      return date.toLocaleDateString(); // Retourne une date lisible
    }

    // Si dateString est une chaîne au format "DD/MM/YYYY", on la divise et la reformate
    if (typeof dateString === 'string' && dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      const formattedDate = `${year}-${month}-${day}`;
      const date = new Date(formattedDate);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString(); // Retourne une date lisible
      }
    }

    return dateString; // Si aucune condition n'est remplie, on retourne la date brute.
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
          <div className="mt-8 max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-xl border-t-8 border-blue-500">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Grille pour les champs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
                  {/* Nom du participant */}
                  <div>
                    <label htmlFor="fullName" className="block text-lg font-medium text-[#0071bc]">
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
                    <label htmlFor="birthDate" className="block text-lg font-medium text-[#0071bc]">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Date d'émission */}
                  <div>
                    <label htmlFor="issueDate" className="block text-lg font-medium text-[#0071bc]">
                      {"Date d'émission"}
                    </label>
                    <input
                      type="date"
                      id="issueDate"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleChange}
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Date de début de formation */}
                  <div>
                    <label htmlFor="formationDateDebut" className="block text-lg font-medium text-[#0071bc]">
                      Début de formation
                    </label>
                    <input
                      type="date"
                      id="formationDateDebut"
                      name="formationDateDebut"
                      value={formData.formationDateDebut}
                      onChange={handleChange}
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Date de fin de formation */}
                  <div>
                    <label htmlFor="formationDateFin" className="block text-lg font-medium text-[#0071bc]">
                      Date de fin de formation
                    </label>
                    <input
                      type="date"
                      id="formationDateFin"
                      name="formationDateFin"
                      value={formData.formationDateFin}
                      onChange={handleChange}
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Option de formation */}
                  <div>
                    <label htmlFor="formationOption" className="block text-lg font-medium text-[#0071bc]">
                      Option de la formation
                    </label>
                    <select
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      name="formationOption"
                      id="formationOption"
                      value={formData.formationOption}
                      onChange={handleChange}
                    >
                      <option value="">-- Sélectionnez --</option>
                      <option value="Comptabilité">Comptabilité</option>
                      <option value="Ressources humaines">Ressources humaines</option>
                      <option value="Banque finances">Banque finances</option>
                    </select>
                  </div>
                  {/* <div className="md:col-span-2">
                    <label htmlFor="city" className="block text-lg font-medium text-[#0071bc]">
                      Formations
                    </label>
                    <Select
                      value={formData.formationOption}
                      required
                      name="formationOption"
                      onValueChange={handleChange}
                    >
                      <SelectTrigger className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="-- Sélectionnez --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Option de la formation</SelectLabel>
                          <SelectItem value="comptabilité">Comptabilité</SelectItem>
                          <SelectItem value="ressources humaines">Ressources humaines</SelectItem>
                          <SelectItem value="assistanat de direction">Assistanat de direction</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div> */}

                  {/* Ville avec largeur de 2 colonnes */}
                  <div className="md:col-span-2">
                    <label htmlFor="city" className="block text-lg font-medium text-[#0071bc]">
                      Ville
                    </label>
                    <select
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                  {/* <div className="md:col-span-2">
                    <label htmlFor="city" className="block text-lg font-medium text-[#0071bc]">
                      Ville
                    </label>
                    <Select
                      value={formData.city}
                      required
                      name="city"
                      onValueChange={handleChange}
                    >
                      <SelectTrigger className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="-- Sélectionnez --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Villes</SelectLabel>
                          <SelectItem value="pointe-noire">Pointe-Noire</SelectItem>
                          <SelectItem value="brazzaville">Brazzaville</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div> */}

                  
                </div>
                
              

                {/* Bouton de génération */}
                <div className="mt-6 grid grid-cols-1 gap-4">
                  {/* Premier bouton : Générer le certificat */}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isLoading} // Désactiver le bouton pendant le chargement
                      className="px-8 py-3 text-white bg-[#0071bc] rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <svg
                          className="animate-spin h-5 w-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 0114.607-5.243l3.131 3.131A12 12 0 004 12z"
                          ></path>
                        </svg>
                      ) : (
                        <>
                          <FaFilePdf className="w-5 h-5" />
                          <span>Générer le certificat</span>
                          <FaArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
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
               {/* Affichage du nom du fichier */}
              {fileName && (
                <div className="text-lg text-center font-semibold my-4">
                  Fichier importé: <span className="text-blue-600">{fileName}</span>
                </div>
              )}
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
                  <p className="text-sm font-bold  ">{formData.fullName}</p>
                  <p className="text-sm font-bold">{formData.birthDate}</p>
                  <p className="text-sm font-bold ">
                    {formData.formationOption}
                  </p>
                  <div className="flex gap-2">
                    <p className="text-sm font-bold">
                      {formData.city}
                    </p>
                    <p className="text-sm font-bold ">
                      {formData.issueDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p className="text-sm font-bold  ">
                      {formData.formationDateDebut}
                    </p>
                    <p className="text-sm font-bold ">
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
