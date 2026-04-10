import bcrypt from "bcryptjs";

import { prisma } from "../src/shared/infrastructure/database/prisma/client";

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

const ticketTypes = [
  ["new_dev", "Desarrollo nuevo", false, false, true],
  ["observation_existing", "Observación o soporte sobre desarrollo existente", true, true, false],
  ["observation_external", "Observación o soporte sin desarrollo previo del equipo", true, true, false],
] as const;

const ticketStatuses = [
  ["new", "Nuevo"],
  ["assigned", "Asignado"],
  ["in_estimation", "En estimación"],
  ["estimated", "Estimado"],
  ["in_approval", "En aprobación"],
  ["approved", "Aprobado"],
  ["rejected", "Rechazado"],
  ["in_progress", "En progreso"],
  ["deployed_dev", "Desplegado en dev"],
  ["observed", "Observado"],
  ["in_adjustment", "En ajuste"],
  ["validated", "Validado"],
  ["conformity", "A conformidad"],
  ["closed", "Cerrado"],
  ["cancelled", "Cancelado"],
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

  for (const [code, name, requiresDiagnosis, requiresSolution, requiresFeaturesLog] of ticketTypes) {
    await prisma.ticketType.upsert({
      where: { code },
      update: {
        name,
        requiresDiagnosis,
        requiresSolution,
        requiresFeaturesLog,
      },
      create: {
        code,
        name,
        requiresDiagnosis,
        requiresSolution,
        requiresFeaturesLog,
      },
    });
  }

  for (const [code, name] of ticketStatuses) {
    await prisma.ticketStatus.upsert({
      where: { code },
      update: { name },
      create: {
        code,
        name,
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
  const pmRole = dbRoles.find((role) => role.name === "pm");
  const ctoRole = dbRoles.find((role) => role.name === "cto");
  const qaRole = dbRoles.find((role) => role.name === "qa");
  const developerRole = dbRoles.find((role) => role.name === "developer");

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

  if (pmRole) {
    await prisma.user.upsert({
      where: { email: "pm@nexotkt.local" },
      update: { fullName: "PM Demo", roleId: pmRole.id, isActive: true },
      create: {
        fullName: "PM Demo",
        email: "pm@nexotkt.local",
        passwordHash: await bcrypt.hash("Admin12345*", 10),
        roleId: pmRole.id,
        isActive: true,
      },
    });
  }

  if (ctoRole) {
    await prisma.user.upsert({
      where: { email: "cto@nexotkt.local" },
      update: { fullName: "CTO Demo", roleId: ctoRole.id, isActive: true },
      create: {
        fullName: "CTO Demo",
        email: "cto@nexotkt.local",
        passwordHash: await bcrypt.hash("Admin12345*", 10),
        roleId: ctoRole.id,
        isActive: true,
      },
    });
  }

  if (qaRole) {
    await prisma.user.upsert({
      where: { email: "qa@nexotkt.local" },
      update: { fullName: "QA Demo", roleId: qaRole.id, isActive: true },
      create: {
        fullName: "QA Demo",
        email: "qa@nexotkt.local",
        passwordHash: await bcrypt.hash("Admin12345*", 10),
        roleId: qaRole.id,
        isActive: true,
      },
    });
  }

  if (developerRole) {
    await prisma.user.upsert({
      where: { email: "dev@nexotkt.local" },
      update: { fullName: "Developer Demo", roleId: developerRole.id, isActive: true },
      create: {
        fullName: "Developer Demo",
        email: "dev@nexotkt.local",
        passwordHash: await bcrypt.hash("Admin12345*", 10),
        roleId: developerRole.id,
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
