"use server";
import prisma from "@/lib/db";

export const getCertificates = async () => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        createdAt: "desc", // Tri en ordre décroissant
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

    return certificates;
  } catch (error) {
    console.error("Erreur lors de la récupération des certificats :", error);
    throw new Error("Erreur lors de la récupération des certificats");
  }
};
