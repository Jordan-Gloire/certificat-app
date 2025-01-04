import { certificatTable } from "../../data/db";

export async function POST(request: Request) {
  const certificat = await request.json();

  const newCertificat = {
    id: certificatTable.length + 1,
    createdAt: certificat.createdAt,
    updatedAt: certificat.updatedAt,
    fullName: certificat.fullName,
    issueDate: certificat.issueDate,
    birthDate: certificat.birthDate,
    formationDateDebut: certificat.formationDateDebut,
    formationDateFin: certificat.formationDateFin,
    formationOption: certificat.formationOption,
    city: certificat.city,
  };

  certificatTable.push(newCertificat);

  return Response.json(newCertificat);
}
