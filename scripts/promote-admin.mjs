import { PrismaClient } from "@prisma/client";
import {
  parsePromotionArgs,
  promoteAdministrator,
} from "./lib/promote-admin.mjs";

const prisma = new PrismaClient();

try {
  const { email } = parsePromotionArgs(process.argv.slice(2));
  const promotedEmail = await promoteAdministrator(prisma, email);
  process.stdout.write(`Promoção registrada para ${promotedEmail}.\n`);
} catch (error) {
  process.stderr.write(
    `${error instanceof Error ? error.message : "Falha desconhecida ao promover usuário."}\n`,
  );
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
