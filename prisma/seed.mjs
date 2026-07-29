import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const roles = [
  ["ADMIN", "Administrador"],
  ["MANAGER", "Gestor"],
  ["ANALYST", "Analista"],
  ["VIEWER", "Visualizador"],
];
const permissions = [
  ["organization.read", "Visualizar a organização"],
  ["master-data.read", "Visualizar cadastros estruturais"],
  ["quotation.read", "Visualizar solicitações e propostas"],
  ["audit.read", "Visualizar auditoria"],
];

try {
  await prisma.$transaction([
    ...roles.map(([key, name]) =>
      prisma.role.upsert({
        where: { key },
        update: { name },
        create: { key, name },
      }),
    ),
    ...permissions.map(([key, description]) =>
      prisma.permission.upsert({
        where: { key },
        update: { description },
        create: { key, description },
      }),
    ),
  ]);
} finally {
  await prisma.$disconnect();
}
