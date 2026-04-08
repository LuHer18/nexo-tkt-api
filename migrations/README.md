# Migraciones

Este directorio queda reservado para el historial de migraciones del backend.

## Enfoque recomendado
Usar una herramienta de migraciones como:

- **Prisma Migrate**
- o una alternativa equivalente si luego se decide otro stack

## Lineamientos
- Cada cambio estructural en base de datos debe quedar versionado en migraciones
- No editar migraciones ya aplicadas en entornos compartidos
- Mantener consistencia entre modelo de datos, validaciones y permisos

## Recomendación actual
Como siguiente paso, cuando se inicie el backend:
1. Crear proyecto Node.js + TypeScript
2. Instalar Prisma
3. Configurar `DATABASE_URL`
4. Levantar PostgreSQL con Docker
5. Crear primera migración base
