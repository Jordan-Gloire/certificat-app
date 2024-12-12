-- CreateTable
CREATE TABLE "Certificate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "birthDate" TEXT,
    "city" TEXT NOT NULL,
    "formationDateDebut" DATETIME,
    "formationDateFin" DATETIME,
    "formationOption" TEXT,
    "issueDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);