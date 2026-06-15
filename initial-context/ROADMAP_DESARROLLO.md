# Roadmap de Desarrollo - EduManager MVP

**Duración:** 6 semanas (desarrollo full-time)  
**Equipo:** 1 desarrolladora fullstack  
**Stack:** Angular + Express + TypeScript + PostgreSQL  

---

## 📅 SEMANA 1: FOUNDATION & AUTENTICACIÓN

### 🎯 Objetivo
Tener un proyecto funcional con autenticación básica (login/signup) y estructura lista.

### ✅ Tareas

#### 1.1 Setup Inicial (2-3 horas)
- [x] Crear repositorio Git (monorepo)
- [x] Inicializar backend (Express + TypeScript)
- [x] Inicializar frontend (Angular 17)
- [x] Crear docker-compose.yml con PostgreSQL
- [x] Configurar variables de entorno (.env)
- [x] Validar que la app sube sin errores

**Entregable:** Repos listos, docker-compose up funciona

#### 1.2 Base de Datos & Entities (3 horas)
- [x] Crear conexión TypeORM a PostgreSQL
- [x] Crear entidades base:
  - User (email, password, firstName, lastName, role, institutionId)
  - TwoFactorSecret (userId, secret, enabled)
  - RefreshToken (userId, token, expiresAt)
- [x] Crear migrations iniciales
- [x] Validar que las tablas se crean correctamente

**Entregable:** Schema DB funcional

#### 1.3 Auth Backend (5 horas)
- [x] Implementar:
  - POST /api/v1/auth/signup (validar email único)
  - POST /api/v1/auth/login (email + password)
  - POST /api/v1/auth/2fa/setup (generar QR)
  - POST /api/v1/auth/2fa/verify (verificar código 2FA)
  - POST /api/v1/auth/refresh (renovar JWT)
  - POST /api/v1/auth/logout
- [x] Implementar JWT middleware
- [x] Hash contraseñas con bcrypt
- [x] Validar DTOs
- [x] Error handling básico

**Entregable:** Endpoints auth testeados en Postman

#### 1.4 Auth Frontend (4 horas)
- [x] Crear módulo auth
- [x] Crear AuthService (login, signup, 2FA)
- [x] Crear componentes:
  - [x] LoginComponent
  - [x] SignupComponent
  - [x] TwoFactorComponent
- [x] Implementar jwt-interceptor
- [x] Guards de ruta (AuthGuard)
- [x] Store token en localStorage

**Entregable:** Formularios de login/signup funcionales

#### 1.5 Testing Básico (2 horas)
- [x] Tests unitarios backend (AuthService)
- [x] Tests E2E / integrados frontend (login flow completo)
- [x] Setup CI/CD básico (GitLab CI/CD en lugar de GitHub Actions)

### 📊 Criterios de Aceptación
- [x] Usuario puede registrarse y recibir email de verificación
- [x] Usuario puede hacer login con email/contraseña
- [x] 2FA funciona (generar + verificar código)
- [x] Tokens JWT se generan y renuevan correctamente
- [x] Frontend guarda token y redirige según autenticación
- [x] 70%+ test coverage en auth

### 🧪 Testing
```bash
# Backend
npm test -- auth.service.test.ts --coverage

# Frontend
ng test --include='**/auth/**' --code-coverage

# Manual (Postman)
1. POST /auth/signup → recibe token
2. POST /auth/login → recibe JWT
3. POST /auth/2fa/setup → recibe QR
4. POST /auth/2fa/verify → acceso confirmado
```

---

## 📅 SEMANA 2: MULTI-TENANCY & INSTITUCIONES

### 🎯 Objetivo
Soportar múltiples instituciones aisladas. Cada institución tiene su propio contexto.

### ✅ Tareas

#### 2.1 Entities & Database (3 horas)
- [x] Crear entidad Institution
  - name, slug, logoUrl, createdAt
- [x] Agregar institutionId a User (FK)
- [x] Crear middleware que valide institutionId del token
- [x] Migrations para agregar columnas

**Entregable:** Datos aislados por institución

#### 2.2 Institución Backend (4 horas)
- [ ] POST /api/v1/institutions (solo admin)
  - Validar slug único
  - Retorna institutionId
- [ ] GET /api/v1/institutions/:id (admin o profesor perteneciente)
- [ ] PATCH /api/v1/institutions/:id (actualizar logo, nombre)
- [ ] POST /api/v1/institutions/:id/invite-professor
  - Envía email de invitación
  - Crea usuario con rol profesor
- [ ] Middleware TenantMiddleware (todos los endpoints validen institutionId)

**Entregable:** CRUD instituciones + invitación de profesores

#### 2.3 Admin Dashboard (3 horas)
- [x] Crear AdminModule (lazy-loaded)
- [x] Dashboard admin:
  - Crear nueva institución
  - Ver lista de instituciones creadas
  - Invitar profesores
- [x] Admin role check en guard

**Entregable:** Admin puede crear instituciones

#### 2.4 Profesor Dashboard Base (2 horas)
- [ ] Crear ProfessorModule
- [ ] Dashboard con:
  - Bienvenida
  - Próximos pasos (crear curso)
  - Mi institución

**Entregable:** Profesor logueado ve dashboard

#### 2.5 Email Service (2 horas)
- [ ] Implementar EmailService en backend
  - Usar Nodemailer
  - Templates HTML básicas
- [ ] Test email en .env (puede usar test SMTP)
- [ ] Envío de invitación profesor funciona

**Entregable:** Profesores reciben email de invitación

### 📊 Criterios de Aceptación
- [x] Admin crea institución y obtiene slug único
- [x] Profesor recibe email de invitación y se registra
- [x] Datos de múltiples instituciones están aislados
- [x] JWT contiene institutionId y se valida en middleware
- [x] Profesor solo ve su institución

### 🧪 Testing
```bash
# Postman flow
1. Admin: POST /institutions → nueva institución creada
2. Admin: POST /institutions/{id}/invite-professor → email enviado
3. Profesor: Recibe email, signup, accede a su institución
```

---

## 📅 SEMANA 3: CURSOS & ASIGNACIÓN ESTUDIANTES

### 🎯 Objetivo
Profesor puede crear cursos y asignar estudiantes (manual + CSV).

### ✅ Tareas

#### 3.1 Entities (2 horas)
- [ ] Course (id, institutionId, professorId, name, description, academicYear, semester)
- [ ] Student (id, userId, guardianId, institutionId)
- [ ] Guardian (id, userId, institutionId)
- [ ] StudentEnrollment (id, studentId, courseId, enrolledAt)
- [ ] Migrations

**Entregable:** Schema para cursos y estudiantes

#### 3.2 Curso Backend (4 horas)
- [ ] POST /api/v1/courses (crear curso)
  - Validar que profesor pertenece a institución
  - Retorna courseId
- [ ] GET /api/v1/courses (listar por profesor/institución)
- [ ] GET /api/v1/courses/:id (detalles)
- [ ] PATCH /api/v1/courses/:id (editar)
- [ ] DELETE /api/v1/courses/:id (borrar si no hay calificaciones)

**Entregable:** CRUD cursos funcional

#### 3.3 Estudiantes Backend (5 horas)
- [ ] POST /api/v1/institutions/:instId/students (crear estudiante manual)
  - Input: nombre, email, nombreApoderado, emailApoderado
  - Crea usuario estudiante + usuario apoderado
  - Los vincula
- [ ] POST /api/v1/courses/:courseId/students (asignar a curso)
- [ ] GET /api/v1/courses/:courseId/students (listar por curso)
- [ ] DELETE /api/v1/courses/:courseId/students/:studentId (desasignar)

#### 3.4 CSV Import Backend (4 horas)
- [ ] POST /api/v1/courses/:courseId/students/import-csv
  - Validar formato CSV
  - Pre-validar datos
  - Crear o actualizar estudiantes + apoderados
  - Asignar a curso
  - Retorna reporte: creados, actualizados, errores
- [ ] Template CSV descargable

**Entregable:** Import CSV funciona

#### 3.5 Profesor UI - Cursos (4 horas)
- [ ] Componente: Crear curso
  - Form: nombre, descripción, año, semestre
  - Validación
- [ ] Componente: Listar cursos
  - Tabla con cursos
  - Botones: editar, ver estudiantes, eliminar
- [ ] Componente: Detalles curso
  - Mostrar datos, profesor, cantidad estudiantes

**Entregable:** Profesor crea cursos desde UI

#### 3.6 Profesor UI - Estudiantes (4 horas)
- [ ] Componente: Asignar estudiante manual
  - Dropdown/autocomplete de estudiantes
  - Agregar a curso
- [ ] Componente: Import CSV
  - Subir archivo
  - Preview datos
  - Confirmar importación
  - Ver reporte (creados, errores)
- [ ] Componente: Listar estudiantes curso
  - Tabla con estudiantes, correo, apoderado

**Entregable:** Profesor asigna estudiantes manual + CSV

#### 3.7 Testing (3 horas)
- [ ] Tests backend: servicios de cursos y estudiantes
- [ ] Tests frontend: componentes de cursos
- [ ] E2E: crear curso + asignar estudiantes

### 📊 Criterios de Aceptación
- [x] Profesor crea curso exitosamente
- [x] Profesor asigna estudiante manualmente
- [x] Profesor importa CSV con múltiples estudiantes
- [x] Sistema crea apoderados automáticamente
- [x] Estudiantes ven el curso asignado
- [x] CSV con errores muestra reporte claro

### 🧪 Testing
```bash
# Manual flow
1. Profesor: Crear curso "Matemática 7°A"
2. Profesor: Agregar estudiante "Juan" manualmente
3. Profesor: Descargar template CSV
4. Profesor: Completar CSV con 10 estudiantes
5. Profesor: Subir CSV → reporte de importación
6. Verificar: Estudiantes ven el curso en su lista
```

---

## 📅 SEMANA 4: CALIFICACIONES & TAREAS

### 🎯 Objetivo
Profesor puede crear tareas y cargar calificaciones. Estudiante ve notas y promedio.

### ✅ Tareas

#### 4.1 Entities (2 horas)
- [ ] Task (id, courseId, professorId, title, description, dueDate)
- [ ] Grade (id, taskId, studentId, score, percentage, createdAt)
- [ ] PerformanceNote (id, studentId, professorId, courseId, content)
- [ ] Migrations

**Entregable:** Schema para tareas y notas

#### 4.2 Tareas Backend (3 horas)
- [ ] POST /api/v1/tasks (crear tarea)
  - Validar que profesor pertenece al curso
  - Asignar a todos estudiantes de curso automáticamente
- [ ] GET /api/v1/tasks (por curso/profesor)
- [ ] GET /api/v1/tasks/:id (detalles)
- [ ] PATCH /api/v1/tasks/:id (editar)
- [ ] DELETE /api/v1/tasks/:id (borrar)

**Entregable:** CRUD tareas funcional

#### 4.3 Calificaciones Backend (5 horas)
- [ ] POST /api/v1/tasks/:taskId/grades (cargar calificaciones lote)
  - Input: [{studentId, score}, ...]
  - Validar score 0-100
  - Generar evento "grade_created"
- [ ] PATCH /api/v1/tasks/:taskId/grades/:gradeId (editar calificación individual)
- [ ] GET /api/v1/courses/:courseId/grades (reporte de calificaciones)
  - Retorna tabla: estudiante, tarea1, tarea2, ..., promedio
- [ ] GET /api/v1/students/:studentId/grades (mis calificaciones)
- [ ] Cálculo automático de promedio (aritmético simple)

**Entregable:** Endpoints de calificaciones funcionales

#### 4.4 Notas de Desempeño Backend (2 horas)
- [ ] POST /api/v1/performance-notes (profesor crea)
  - Validar que estudiante está en curso del profesor
- [ ] GET /api/v1/students/:studentId/performance-notes (ver notas)
- [ ] PATCH /api/v1/performance-notes/:id (editar)
- [ ] DELETE /api/v1/performance-notes/:id (borrar)

**Entregable:** Profesor puede escribir notas de desempeño

#### 4.5 Profesor UI - Calificaciones (4 horas)
- [ ] Componente: Crear tarea
  - Form: título, descripción, fecha entrega
- [ ] Componente: Cargar calificaciones
  - Tabla editable con estudiantes y scores
  - Botón guardar (envía lote)
  - Validación en tiempo real
- [ ] Componente: Notas de desempeño
  - Textarea para cada estudiante
  - Guardar y mostrar historial

**Entregable:** Profesor carga calificaciones desde UI

#### 4.6 Estudiante UI - Calificaciones (3 horas)
- [ ] Componente: Mis calificaciones
  - Tabla: Tarea, Fecha, Calificación, Porcentaje
  - Card de promedio destacado
  - Detalles por tarea
- [ ] Mostrar notas de desempeño del profesor

**Entregable:** Estudiante ve sus notas y promedio

#### 4.7 CSV Export (2 horas)
- [ ] Endpoint GET /api/v1/courses/:courseId/grades/export
  - Formato CSV con todas las notas
- [ ] Botón en UI profesor para descargar

**Entregable:** Profesor puede descargar CSV de notas

#### 4.8 Testing (2 horas)
- [ ] Tests backend: cálculo de promedio, validaciones
- [ ] Tests frontend: carga de calificaciones, visualización
- [ ] E2E: flujo completo profesor-estudiante

### 📊 Criterios de Aceptación
- [x] Profesor crea tarea y se asigna a estudiantes
- [x] Profesor carga calificaciones (lote)
- [x] Promedio se calcula correctamente
- [x] Estudiante ve sus calificaciones y promedio
- [x] Profesor puede descargar CSV de notas
- [x] Notas de desempeño se guardan y muestran

### 🧪 Testing
```bash
# Manual flow
1. Profesor: Crear tarea "Prueba 1"
2. Profesor: Ir a "Cargar calificaciones"
3. Profesor: Cargar 5 notas (ej: 85, 90, 78, 92, 88)
4. Sistema calcula promedio: 86.6
5. Estudiante: Ve calificación y promedio
6. Profesor: Agregar nota de desempeño
7. Estudiante: Ve nota de desempeño
8. Profesor: Descargar CSV
```

---

## 📅 SEMANA 5: NOTIFICACIONES & APODERADO

### 🎯 Objetivo
Apoderado puede ver progreso de estudiante. Notificaciones por email y app.

### ✅ Tareas

#### 5.1 Entities (1 hora)
- [ ] Notification (id, userId, type, title, content, read, createdAt)
- [ ] Migrations

**Entregable:** Tabla de notificaciones lista

#### 5.2 Notificaciones Backend (4 horas)
- [ ] NotificationService
  - notifyNewTask(studentId, taskTitle)
  - notifyGradeCreated(studentId, taskTitle, grade)
  - notifyPerformanceNote(studentId, note)
- [ ] POST /api/v1/notifications (crear)
- [ ] GET /api/v1/notifications (listar por usuario, no leídas primero)
- [ ] PATCH /api/v1/notifications/:id/read
- [ ] DELETE /api/v1/notifications/:id
- [ ] Eventos que generan notificaciones:
  - Nueva tarea (email + in-app)
  - Nueva calificación (email + in-app)
  - Nueva nota de desempeño (email + in-app)

**Entregable:** Eventos disparan notificaciones

#### 5.3 Apoderado Backend (3 horas)
- [ ] GET /api/v1/guardians/students (mis estudiantes)
- [ ] GET /api/v1/guardians/students/:studentId (detalles estudiante)
- [ ] GET /api/v1/students/:studentId/grades (ver calificaciones)
- [ ] Middleware: validar que apoderado solo ve sus estudiantes
- [ ] Endpoints son read-only para apoderado

**Entregable:** Apoderado puede acceder a datos de hijo

#### 5.4 Apoderado UI (4 horas)
- [ ] Crear GuardianModule
- [ ] Componente: Mis estudiantes
  - Tarjetas con foto/nombre
  - Click → detalles
- [ ] Componente: Detalles estudiante
  - Información del hijo
  - Cursos inscritos
  - Tabla de calificaciones
  - Notas de desempeño
  - Promedio general
- [ ] Componente: Notificaciones
  - Centro de notificaciones
  - Listar notificaciones (nuevas primero)
  - Marcar como leído

**Entregable:** Apoderado ve progreso de hijo

#### 5.5 Notificaciones Frontend (3 horas)
- [ ] NotificationService (obtener, marcar leído)
- [ ] Componente: Toast/Banner para notificaciones nuevas
- [ ] Componente: Bell icon con contador
- [ ] Click bell → modal con notificaciones
- [ ] Polling cada 30s o WebSocket (opcional para MVP)

**Entregable:** Notificaciones aparecen en UI

#### 5.6 Email Templates (2 horas)
- [ ] Template: Nueva tarea
- [ ] Template: Nueva calificación
- [ ] Template: Nota de desempeño
- [ ] Template: Invitación profesor
- [ ] Template: Recuperación contraseña

**Entregable:** Emails con formato profesional

#### 5.7 Testing (2 horas)
- [ ] Tests: notificaciones se generan correctamente
- [ ] Tests: apoderado solo ve sus datos
- [ ] E2E: flujo apoderado

### 📊 Criterios de Aceptación
- [x] Apoderado ve sus estudiantes
- [x] Apoderado ve calificaciones de hijo
- [x] Profesor recibe email cuando califica
- [x] Notificaciones aparecen en app
- [x] Apoderado recibe email importante (calificación, nota)
- [x] Notificaciones se pueden marcar como leídas

### 🧪 Testing
```bash
# Manual flow
1. Profesor: Carga calificación
2. Estudiante: Recibe email + ve notificación en app
3. Apoderado: Recibe email + ve notificación
4. Apoderado: Login, ve estudiante, ve calificación
5. Apoderado: Marca notificación como leída
```

---

## 📅 SEMANA 6: TESTS, BUGS & DEPLOY

### 🎯 Objetivo
MVP completo, testeado, documentado y deployable.

### ✅ Tareas

#### 6.1 Testing Exhaustivo (5 horas)
- [ ] Backend
  - Aumentar coverage a 75%+
  - Tests para edge cases
  - Tests de integración (E2E)
  - Tests de seguridad (inyección, XSS)
- [ ] Frontend
  - Tests unitarios para servicios
  - Tests de componentes
  - Tests E2E con Cypress (2-3 flujos críticos)
  - Coverage 70%+

#### 6.2 Bug Fixes & Polish (4 horas)
- [ ] Revisar todos los formularios (validación, UX)
- [ ] Revisar seguridad (JWT, CORS, input sanitization)
- [ ] Revisar performance (queries lentas, memory leaks)
- [ ] Responsive design mobile
- [ ] Accesibilidad (ARIA labels, contrast)

#### 6.3 Documentación (3 horas)
- [ ] README.md en raíz (setup, commands, stack)
- [ ] API.md (listado de endpoints, ejemplos)
- [ ] ARCHITECTURE.md (diagrama de flujo)
- [ ] Comentarios en código complejo
- [ ] Postman collection o Swagger
- [ ] Guía de deployment

#### 6.4 Seed Data Realista (2 horas)
- [ ] Crear seeder que genere:
  - 2 instituciones
  - 3 profesores
  - 15 estudiantes
  - 10 apoderados (algunos con 2 hijos)
  - 5 cursos
  - 20 tareas
  - Calificaciones de ejemplo
- [ ] Script `npm run seed` funciona

#### 6.5 Docker & Deployment (3 horas)
- [ ] Dockerfile backend listo
- [ ] docker-compose.yml de producción
- [ ] Variables env separadas (dev, test, prod)
- [ ] Build test: `docker-compose up` sin errores
- [ ] Documentación de deploy en Heroku/Railway
- [ ] Script de backup de DB

#### 6.6 CI/CD (2 horas)
- [ ] GitHub Actions
  - Tests en cada push
  - Build check
  - Linting check
- [ ] Status badge en README

#### 6.7 Cleanup & Entrega (1 hora)
- [ ] Remover código temporario/comentado
- [ ] Actualizar .gitignore
- [ ] Remover credenciales sensibles
- [ ] Último review de código
- [ ] Merge PRs finales

### 📊 Criterios de Aceptación
- [x] 75%+ coverage backend, 70%+ frontend
- [x] Todos los tests pasan (100%)
- [x] Aplicación deployable en 5 minutos
- [x] README claro y completo
- [x] Sin console.errors ni warnings
- [x] Seed data funciona
- [x] Responsive en mobile

### 🧪 Testing Final
```bash
# Flujo 1: Admin crea institución
1. Signup como admin
2. Crear institución
3. Invitar profesor
4. Profesor se registra

# Flujo 2: Profesor - Completo
1. Profesor: Login
2. Crear curso
3. Importar 5 estudiantes (CSV)
4. Crear 3 tareas
5. Cargar calificaciones
6. Agregar notas de desempeño

# Flujo 3: Estudiante
1. Student: Login
2. Ver cursos
3. Ver tareas
4. Ver calificaciones y promedio
5. Ver notas del profesor

# Flujo 4: Apoderado
1. Guardian: Login
2. Ver hijo
3. Ver calificaciones de hijo
4. Ver notificaciones
```

---

## 🚀 POST MVP (Futura Priorización)

- [ ] Chat tiempo real profesor-estudiante
- [ ] Asistencia/Attendance
- [ ] Entregas de tareas con revisión iterativa
- [ ] Foros de discusión por curso
- [ ] Horarios y calendario
- [ ] Pagos en línea
- [ ] SSO (Google, Microsoft)
- [ ] App móvil nativa
- [ ] BI y reportes avanzados
- [ ] Integración Google Classroom
- [ ] Multi-idioma

---

## 📊 RESUMEN HORAS POR SEMANA

| Semana | Horas | Foco |
|--------|-------|------|
| 1 | 16 | Autenticación + Setup |
| 2 | 14 | Multi-tenancy |
| 3 | 26 | Cursos + Estudiantes |
| 4 | 20 | Calificaciones |
| 5 | 18 | Apoderado + Notificaciones |
| 6 | 15 | Tests + Deploy |
| **TOTAL** | **~109 horas** | **~1.5 semanas full-time por person** |

---

## ✅ CHECKLIST FINAL

Antes de considerar el MVP "done":

- [ ] Todos los endpoints funcionan y están documentados
- [ ] Frontend responsive (testeado en mobile)
- [ ] Emails se envían correctamente
- [ ] CSV import/export funcionan
- [ ] 2FA funciona en ambos roles
- [ ] Roles y permisos están correctos
- [ ] Notificaciones funcionan (email + app)
- [ ] Base de datos está optimizada (índices)
- [ ] Código sin deuda técnica obvia
- [ ] Fácil de deployar
- [ ] README completo
- [ ] Demo grabado (opcional)

---

**Mejoras Potenciales:**
- Semana 1:
  - **Rate Limiting en Auth**: Implementar limitación de tasa (rate limiting) mediante `express-rate-limit` en los endpoints de `/login` y `/signup` para mitigar ataques de fuerza bruta.
  - **Códigos de Respaldo 2FA**: Generar códigos estáticos de recuperación de un solo uso durante la activación del 2FA para evitar el bloqueo de cuentas si se pierde el celular.
  - **Recordar Dispositivo (2FA)**: Añadir cookies seguras para omitir el 2FA en dispositivos de confianza por 30 días.
  - **Inputs Divididos para 2FA en UI**: Mejorar la UX dividiendo el input único de 6 dígitos en 6 casillas independientes con auto-tab y auto-paste inteligente.
  - **Visibilidad de Contraseñas**: Agregar botones para alternar la visualización del texto de la contraseña en login y registro.
- Semana 2:
- Semana 3:
- Semana 4:
- Semana 5:
- Semana 6: 
**Documento actualizado:** Junio 2026  
**Status:** LISTO PARA COMENZAR  
**Próximo checkpoint:** Fin Semana 1
