import Header from "@/app/components/Header";
import React from "react";
import { getCertificateById } from "@/app/actions/getCertificateById";
import { Certificate } from "@prisma/client";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  let certificate: Certificate | null = null;

  try {
    certificate = await getCertificateById(Number(id)); // Convertir en nombre
    if (!certificate) {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du certificat :", error);
  }

  return (
    <>
      <Header />
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/hero (2).jpg')" }}
      >
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-xl w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
            Détails du certificat
          </h1>
          {certificate ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <p>
                  <strong className="text-blue-600">Nom:</strong>{" "}
                  {certificate.fullName}
                </p>
                {/* <p>
                  <strong className="text-blue-600">Type:</strong>{" "}
                  {certificate.certificateType}
                </p> */}
                <p>
                  <strong className="text-blue-600">Date:</strong>{" "}
                  {new Date(certificate.issueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-200">
                  Télécharger le certificat
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">Certificat introuvable</p>
          )}
        </div>
      </div>
    </>
  );
}
