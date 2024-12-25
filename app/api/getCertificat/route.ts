import { certificatTable } from "../../data/db";

export async function GET() {
  return Response.json(certificatTable);
}
