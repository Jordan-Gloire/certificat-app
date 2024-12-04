"use server";
// app/actions/certificateActions.ts
import prisma from '@/lib/db';

export const getCertificates = async () => {
  try {
    const certificates = await prisma.certificate.findMany({
      orderBy: {
        createdAt: 'desc', // Tri en ordre décroissant
      },
    });

    return certificates;
  } catch (error) {
    console.error('Erreur lors de la récupération des certificats :', error);
    throw new Error('Erreur lors de la récupération des certificats');
  }
};


