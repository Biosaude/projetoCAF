import { PrismaClient } from "@prisma/client";

if (process.env.NODE_ENV !== "test") {
  process.stderr.write(
    "Validação recusada: defina NODE_ENV=test e use exclusivamente um banco descartável.\n",
  );
  process.exit(1);
}

const prisma = new PrismaClient();
const expectedTables = [
  "Account",
  "AuditLog",
  "Permission",
  "Role",
  "RolePermission",
  "Session",
  "User",
  "UserRole",
  "VerificationToken",
];
const expectedEnums = ["AuditAction", "RoleKey", "UserStatus"];
const expectedRoles = ["ADMIN", "ANALYST", "MANAGER", "VIEWER"];
const expectedForeignKeys = [
  "Account_userId_fkey",
  "AuditLog_userId_fkey",
  "RolePermission_permissionId_fkey",
  "RolePermission_roleId_fkey",
  "Session_userId_fkey",
  "UserRole_roleId_fkey",
  "UserRole_userId_fkey",
];
const expectedIndexes = [
  "Account_provider_providerAccountId_key",
  "Account_userId_idx",
  "AuditLog_action_createdAt_idx",
  "RolePermission_permissionId_idx",
  "Session_sessionToken_key",
  "Session_userId_idx",
  "UserRole_roleId_idx",
];

function assertExact(actual, expected, label) {
  const normalized = [...actual].sort();
  if (JSON.stringify(normalized) !== JSON.stringify(expected)) {
    throw new Error(
      `${label} inválidos. Esperado: ${expected.join(", ")}; obtido: ${normalized.join(", ")}`,
    );
  }
}

try {
  await prisma.$queryRaw`SELECT 1`;
  const tables = await prisma.$queryRaw`
    SELECT table_name AS name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `;
  const presentTables = new Set(tables.map(({ name }) => name));
  const missingTables = expectedTables.filter(
    (table) => !presentTables.has(table),
  );
  if (missingTables.length)
    throw new Error(`Tabelas ausentes: ${missingTables.join(", ")}`);

  const enums = await prisma.$queryRaw`
    SELECT typname AS name
    FROM pg_type
    WHERE typname IN ('AuditAction', 'RoleKey', 'UserStatus')
  `;
  assertExact(
    enums.map(({ name }) => name),
    expectedEnums,
    "Enums",
  );

  const roles = await prisma.role.groupBy({
    by: ["key"],
    _count: { _all: true },
    orderBy: { key: "asc" },
  });
  assertExact(
    roles.map(({ key }) => key),
    expectedRoles,
    "Perfis",
  );
  const duplicates = roles.filter(({ _count }) => _count._all !== 1);
  if (duplicates.length) {
    throw new Error(
      `Perfis duplicados: ${duplicates.map(({ key }) => key).join(", ")}`,
    );
  }

  const foreignKeys = await prisma.$queryRaw`
    SELECT constraint_name AS name
    FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND constraint_type = 'FOREIGN KEY'
  `;
  const presentForeignKeys = new Set(foreignKeys.map(({ name }) => name));
  const missingForeignKeys = expectedForeignKeys.filter(
    (foreignKey) => !presentForeignKeys.has(foreignKey),
  );
  if (missingForeignKeys.length) {
    throw new Error(`Foreign keys ausentes: ${missingForeignKeys.join(", ")}`);
  }

  const indexes = await prisma.$queryRaw`
    SELECT indexname AS name
    FROM pg_indexes
    WHERE schemaname = 'public'
  `;
  const presentIndexes = new Set(indexes.map(({ name }) => name));
  const missingIndexes = expectedIndexes.filter(
    (index) => !presentIndexes.has(index),
  );
  if (missingIndexes.length) {
    throw new Error(`Índices ausentes: ${missingIndexes.join(", ")}`);
  }

  process.stdout.write(
    `Banco de autenticação validado: ${expectedTables.length} tabelas, ${expectedEnums.length} enums, ${expectedForeignKeys.length} FKs, ${expectedIndexes.length} índices e ${expectedRoles.length} perfis únicos.\n`,
  );
} finally {
  await prisma.$disconnect();
}
