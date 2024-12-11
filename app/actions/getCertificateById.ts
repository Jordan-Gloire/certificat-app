"use server";
import prisma from "@/lib/db";
import { Certificate } from "@prisma/client";
export const getCertificateById = async (id: number): Promise<Certificate | null> => {
    try {
      const certificate = await prisma.certificate.findUnique({
        where: { id },
      });
  
      if (!certificate) {
        throw new Error('Certificat introuvable');
      }
  
      return certificate;
    } catch (error) {
      console.error('Erreur lors de la récupération du certificat :', error);
      throw new Error('Erreur lors de la récupération du certificat');
    }
  };
  