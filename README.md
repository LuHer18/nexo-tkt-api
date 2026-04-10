# Nexo TKT API

Este directorio contiene el backend principal del proyecto Gestión TKT.

## Recomendación técnica
- Node.js
- TypeScript
- PostgreSQL
- Zod
- Prisma para migraciones y acceso a datos
- JWT con access token + refresh token

## Decisiones iniciales
- La base de datos de desarrollo se levantará con Docker.
- El esquema de base de datos se gestionará con **migraciones** en el backend.
- No se mantendrá un `schema.sql` manual como fuente principal.

## Estructura inicial sugerida
- `migrations/` → historial de migraciones
- `src/` → código fuente del backend
- `prisma/` o equivalente → esquema y migraciones si se usa Prisma

## Estado actual
- Git inicializado
- pnpm + Node.js + TypeScript configurado
- Prisma inicializado
- Docker Compose listo para PostgreSQL local
- Base para autenticación con JWT configurada
- Primera base de Clean Architecture aplicada

## Estructura actual
- `src/app` → bootstrap de aplicación
- `src/shared` → configuración, errores, middlewares y adaptadores compartidos
- `src/modules/*/domain` → contratos y tipos del dominio
- `src/modules/*/application` → casos de uso
- `src/modules/*/infrastructure` → implementación con Prisma
- `src/modules/*/presentation` → rutas y controladores HTTP

## Autenticación base
- `access token` para autorización API
- `refresh token` en cookie `httpOnly`
- invalidación del refresh token al hacer logout
- rotación del refresh token al refrescar sesión

## Endpoints base disponibles
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/companies`
- `POST /api/companies`
- `GET /api/projects`
- `POST /api/projects`

## Paginación
Los endpoints de listado soportan:

- `page`
- `pageSize`

Y devuelven:

- `data`
- `meta.page`
- `meta.pageSize`
- `meta.total`
- `meta.totalPages`

El orden por defecto en listados es `createdAt desc`.

## Fechas y zona horaria
- Las fechas se almacenan en **UTC** en la base de datos.
- Las respuestas del backend devuelven fechas en formato ISO estándar.
- La conversión a hora local debe hacerse en el frontend según la zona horaria del usuario.

## Regla de conformidad y soporte posterior
- Un ticket de desarrollo no termina al desplegarse en dev.
- El ticket solo se considera formalmente finalizado cuando queda **a conformidad**.
- Las observaciones previas a conformidad deben seguir acumulando tiempo al desarrollo original.
- Las incidencias posteriores a conformidad deben registrarse como soporte independiente relacionado al ticket origen.

## Seed inicial
Se incluye un seed base con roles, permisos y un usuario demo:

- email: `leader@nexotkt.local`
- password: `Admin12345*`

Ejecutar con:

```bash
pnpm db:seed
```
