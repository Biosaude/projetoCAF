export function parsePromotionArgs(argv) {
  const args = new Map(
    argv.map((argument) => {
      const [key, ...value] = argument.split("=");
      return [key, value.join("=")];
    }),
  );
  const email = args.get("--email")?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    throw new Error("Informe explicitamente --email=usuario@empresa.com.");
  }
  if (args.get("--confirm") !== "PROMOTE_ADMIN") {
    throw new Error(
      "Confirmação ausente. Use --confirm=PROMOTE_ADMIN para autorizar a promoção.",
    );
  }
  return { email };
}

export async function promoteAdministrator(client, email) {
  return client.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: { email },
      include: { roles: { include: { role: true } } },
    });
    if (!user) {
      throw new Error(
        "Usuário não encontrado. Faça o primeiro login antes da promoção.",
      );
    }

    const adminRole = await transaction.role.findUnique({
      where: { key: "ADMIN" },
    });
    if (!adminRole) {
      throw new Error(
        "Perfil Administrador não encontrado. Execute as migrations.",
      );
    }

    const previousRoles = user.roles.map(({ role }) => role.key);
    await transaction.userRole.deleteMany({ where: { userId: user.id } });
    await transaction.userRole.create({
      data: {
        userId: user.id,
        roleId: adminRole.id,
        assignedBy: "controlled-cli",
      },
    });
    await transaction.auditLog.create({
      data: {
        action: "ROLE_CHANGED",
        entity: "User",
        entityId: user.id,
        userId: user.id,
        metadata: {
          source: "scripts/promote-admin.mjs",
          previousRoles,
          role: "ADMIN",
          explicitlyConfirmed: true,
        },
      },
    });
    return user.email;
  });
}
