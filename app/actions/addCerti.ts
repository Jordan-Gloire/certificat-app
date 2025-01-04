"use server"
import prisma from "@/lib/db";


interface CertificateData {
  fullName: string;
  city: string;
  issueDate: string;
  birthDate: string;
  formationDateDebut: string;
  formationDateFin: string;
  formationOption: string;
}

export async function addCerti(data: CertificateData) {
  if (!data || !data.fullName || !data.city || !data.issueDate) {
    throw new Error("Les données du certificat sont invalides ou manquantes.");
  }

  try {
    const newCertificate = await prisma.certificate.create({
      data: {
        fullName: data.fullName,
        city: data.city,
        issueDate: new Date(data.issueDate),
        birthDate: data.birthDate ? data.birthDate.toString() : null,
        formationDateDebut: data.formationDateDebut ? new Date(data.formationDateDebut) : null,
        formationDateFin: data.formationDateFin ? new Date(data.formationDateFin) : null,
        formationOption: data.formationOption,
      },
    });

    return newCertificate;
  } catch (error) {
    console.error("Error adding certificate:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
