# AI Context - MemberBase

Este archivo está diseñado para mantener el contexto persistente del proyecto y asistir a la Inteligencia Artificial (o a nuevos desarrolladores) en futuras sesiones de trabajo. Debe ser revisado al inicio de las interacciones y actualizado constantemente según la política #6 del proyecto.

## 1. Información General del Proyecto
- **Nombre:** MemberBase
- **Descripción:** Sistema completo de autenticación de usuarios con panel de administración, perfil de usuario y configuración del sistema, preparado para ser usado como base (template) para múltiples proyectos.
- **Stack Tecnológico:**
  - **Framework:** Next.js 15 (App Router)
  - **Autenticación:** NextAuth v5 (Login con email/password y OAuth: Google, GitHub, Microsoft)
  - **Base de Datos:** PostgreSQL en Neon, usando Prisma ORM
  - **Almacenamiento:** Azure Blob Storage (ej. Avatares)
  - **Email:** Resend (verificación de emails y correos del sistema)
  - **Internacionalización:** next-intl (soporte nativo para Español e Inglés, Selector de idioma)
  - **Estilos:** Tailwind CSS con componentes modernos en Dark mode por defecto.
  - **Testing E2E:** Playwright (tests automatizados en la carpeta `e2e/`)

## 2. Arquitectura y Estructura Crítica
- `src/core/`: Contiene el sistema base (Auth, Admin panel, Profile, utilidades compartidas). **Regla Inquebrantable:** No modificar directamente a menos que sea una actualización global de MemberBase.
- `src/features/`: Directorio destinado a **crear las nuevas funcionalidades** específicas de la aplicación final. Cada nueva feature debe contener internamente sus carpetas: `components`, `actions`, `types`.
- `src/app/[locale]/`: Manejo de rutas y layouts, todas internacionalizadas de fábrica.
- `prisma/schema.prisma`: Esquema de la base de datos. Al crear nuevas features, los modelos deben relacionarse aquí (comúnmente vinculados al modelo `User`).
- `.agents/`: Carpeta para directrices, políticas y registros internos de la IA. Incluye historial de errores (`installation-errors.md`) y reglas maestras (`rules/proyect-policies.md`).

## 3. Políticas y Flujos de Trabajo Actuales (Resumen)
1. **Testing de Rutas Críticas:** Si se modifican flujos primarios, se debe actualizar el plan de pruebas respectivo y sincronizar los tests E2E en Playwright ubicados en `e2e/`.
2. **Manejo de Errores:** Todos los errores de consola, instalaciones o de código no triviales que requieran iteración deben registrarse en `.agents/installation-errors.md` para evitar repetir bloqueos pasados.
3. **Actualización de Contexto:** Cualquier nueva librería de peso de backend/frontend añadida, decisiones de arquitectura o nuevas "features" significativas, **deben quedar documentadas en este archivo**.

## 4. Estado Actual y Registro de Hitos
- **2026-03-27:** Creación del archivo de contexto base extrayendo toda la información vital del README. Integración de la política de actualización de contexto en las reglas del sistema para asegurar la continuidad entre hilos de conversación.
