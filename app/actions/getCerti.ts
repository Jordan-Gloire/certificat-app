"use server";
// app/actions/certificateActions.ts
import prisma from '@/lib/db';

export const getCertificates = async (page: number = 1, limit: number = 10) => {
  try {
    // Calculer combien d'éléments sauter
    const skip = (page - 1) * limit;

    const certificates = await prisma.certificate.findMany({
      orderBy: {
        createdAt: 'desc', // Tri en ordre décroissant
      },
      skip, // Sauter un certain nombre d'éléments
      take: limit, // Limiter le nombre d'éléments récupérés
    });

    // Compter le nombre total de certificats pour connaître le nombre de pages
    const totalCertificates = await prisma.certificate.count();
    const totalPages = Math.ceil(totalCertificates / limit);

    return {
      certificates,
      totalCertificates,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des certificats :', error);
    throw new Error('Erreur lors de la récupération des certificats');
  }
};

