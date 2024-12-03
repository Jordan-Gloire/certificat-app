"use server";
import prisma from "@/lib/db";

interface CertificateData {
    fullName: string;
    city: string;
    issueDate: string;
    certificateType: string;
  }
  
export async function addCerti(data: CertificateData) {
    const certi = await prisma.certificate.create({ data });
    return certi;
}