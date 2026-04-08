import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma";

const rolePermissionsMap: Record<string, string[]> = {
  leader: [
    "company.create",
    "company.update",
    "project.create",
    "project.update",
    "ticket.create",
    "ticket.update",
    "ticket.estimation.approve",
    "ticket.observe",
    "ticket.validate",
    "ticket.close",
    "ticket.cancel",
    "ticket.report.view",
  ],
  pm: [
    "ticket.update",
    "ticket.assign",
    "ticket.reassign",
    "ticket.cancel",
    "ticket.report.view",
  ],
  cto: [
    "ticket.create",
    "ticket.estimation.approve",
    "ticket.validate",
    "ticket.cancel",
    "ticket.report.view",
  ],
  qa: [
    "ticket.create",
    "ticket.update",
    "ticket.observe",
    "ticket.validate",
    "ticket.close",
  ],
  developer: [],
};

const permissions = [
  ["company.create", "Crear empresa"],
  ["company.update", "Editar empresa"],
  ["project.create", "Crear proyecto"],
  ["project.update", "Editar proyecto"],
  ["ticket.create", "Crear ticket"],
  ["ticket.update", "Editar ticket"],
  ["ticket.assign", "Asignar ticket"],
  ["ticket.reassign", "Reasignar ticket"],
  ["ticket.estimation.approve", "Aprobar estimación"],
  ["ticket.observe", "Registrar observación"],
  ["ticket.validate", "Validar ticket"],
  ["ticket.close", "Cerrar ticket"],
  ["ticket.cancel", "Cancelar ticket"],
  ["ticket.report.view", "Ver reportes"],
] as const;

const roles = [
  ["leader", "Líder"],
  ["pm", "Project Manager"],
  ["cto", "CTO"],
  ["qa", "QA"],
  ["developer", "Desarrollador"],
] as const;

async function main() {
  for (const [code, name] of permissions) {
    await prisma.permission.upsert({
      where: { code },
      update: { name },
      create: {
        code,
        name,
      },
    });
  }

  for (const [name, description] of roles) {
    await prisma.role.upsert({
      where: { name },
      update: { description },
      create: {
        name,
        description,
      },
    });
  }

  const dbPermissions = await prisma.permission.findMany();
  const dbRoles = await prisma.role.findMany();

  for (const role of dbRoles) {
    const allowedCodes = rolePermissionsMap[role.name] ?? [];

    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });

    for (const permissionCode of allowedCodes) {
      const permission = dbPermissions.find((item) => item.code === permissionCode);

      if (!permission) continue;

      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  const leaderRole = dbRoles.find((role) => role.name === "leader");

  if (leaderRole) {
    await prisma.user.upsert({
      where: { email: "leader@nexotkt.local" },
      update: {
        fullName: "Leader Demo",
        roleId: leaderRole.id,
        isActive: true,
      },
      create: {
        fullName: "Leader Demo",
        email: "leader@nexotkt.local",
        passwordHash: await bcrypt.hash("Admin12345*", 10),
        roleId: leaderRole.id,
        isActive: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
