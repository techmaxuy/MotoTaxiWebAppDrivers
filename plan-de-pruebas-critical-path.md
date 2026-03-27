# Plan de Pruebas: Critical Path (Ruta Crítica)

Este documento detalla los flujos de prueba principales de la aplicación MembershipBase, enfocándose en las áreas críticas para el correcto funcionamiento del sistema.

## Autenticación e Ingreso

Página: `/login`
Chequeo 1: Ingresar credenciales válidas redirige exitosamente al perfil de usuario o panel principal (`/profile` o inicio).
Chequeo 2: Ingresar credenciales inválidas muestra el error adecuado en el formulario (ej. "Credenciales incorrectas" o "Usuario no encontrado").
Chequeo 3: Hacer clic en el enlace de recuperación de contraseña permite enviar un correo de cambio.

Página: `/register`
Chequeo 1: Completar el formulario con datos válidos crea la cuenta, envía correo de verificación (si aplica) y redirige al setup o login.
Chequeo 2: Intentar registrarse con un correo ya existente muestra un error descriptivo en el formulario.
Chequeo 3: Intentar registrar contraseñas débiles o campos vacíos activa la validación del formulario evitando el envío.

## Gestión de Cuenta (Usuario Final)

Página: `/profile`
Chequeo 1: La información personal del usuario logueado (nombre, email) carga correctamente desde la base de datos.
Chequeo 2: Actualizar la información del perfil guarda los datos y refleja el cambio inmediatamente de forma exitosa.
Chequeo 3: Ingresar a esta página sin estar autenticado redirige automáticamente a `/login`.

Página: `/subscription`
Chequeo 1: Al ingresar, se listan los diferentes planes y su estado actual de suscripción.
Chequeo 2: El flujo de pago o mejora de plan (Upgrade) procesa correctamente la solicitud de Checkout (ej. Stripe) de manera segura.

Página: `/setup`
Chequeo 1: El flujo de ingreso para usuarios primerizos (Onboarding) guarda sus preferencias iniciales correctamente y los redirige al inicio de la app.
Chequeo 2: Usuarios que ya completaron el setup e intentan volver manualmente a `/setup` son redirigidos fuera de la página.

## Administración y Panel de Control

Página: `/admin`
Chequeo 1: El panel muestra estadísticas correctas en las tarjetas métricas (total de usuarios, verificados, administradores).
Chequeo 2: Si un usuario con rol estándar (no administrador) intenta acceder a esta página, es bloqueado y redirigido fuera de la vista administrativa.

Página: `/admin/users`
Chequeo 1: La tabla de usuarios carga datos desde la base de datos mostrando roles, correos y estado de verificación.
Chequeo 2: El administrador puede cambiar roles a usuarios (asignar/quitar admin) o modificar la verifiación sin alterar sus propios permisos permanentemente por error crìtico.
Chequeo 3: Opciones de filtrado o búsqueda dentro del listado de usuarios devuelven los resultados correctos.

Página: `/admin/settings`
Chequeo 1: El administrador puede visualizar y modificar los ajustes de la plataforma global y los cambios persisten tras guardar.
Chequeo 2: El acceso a estas configuraciones está estrictamente protegido y requiere sesión y rol `ADMIN` para guardar cambios en la base de datos.
