"use server";
import prisma from "@/lib/db";

export const getCertificates = async () => {
  try {
    // Récupère tous les certificats depuis la base de données
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        createdAt: "desc", // Tri en ordre décroissant par la date de création
      },
      select: {
        id: true,
        fullName: true,
        birthDate: true,
        city: true,
        formationDateDebut: true,
        formationDateFin: true,
        formationOption: true,
        issueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Si tu veux peut-être manipuler ou filtrer les résultats avant de les retourner, tu peux le faire ici
    const certi = certificates.map(certificate => ({
      id: certificate.id,
      fullName: certificate.fullName,
      birthDate: certificate.birthDate,
      city: certificate.city,
      formationDateDebut: certificate.formationDateDebut,
      formationDateFin: certificate.formationDateFin,
      formationOption: certificate.formationOption,
      issueDate: certificate.issueDate,
      createdAt: certificate.createdAt,
      updatedAt: certificate.updatedAt,
    }));

    // Retourne les certificats formatés
    return certi;
  } catch (error) {
    // Gestion des erreurs, logs et message générique
    console.error("Erreur lors de la récupération des certificats :", error);
    throw new Error("Erreur lors de la récupération des certificats");
  }
};
