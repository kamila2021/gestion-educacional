# MVP Progress Tracker - EduManager

**Fecha Inicio:** 2026-06-15  
**Objetivo:** Completar MVP en 6 semanas  
**Estado Global:** ⏹️ EN PROGRESO  

---

## 📅 SEMANA 1: FOUNDATION & AUTENTICACIÓN

**Status:** ✅ COMPLETADO

### Setup Inicial
- [x] Crear repositorio Git (monorepo)
- [x] Inicializar backend (Express + TS)
- [x] Inicializar frontend (Angular 17)
- [x] Docker-compose con PostgreSQL
- [x] Variables de entorno (.env)
- [x] App sube sin errores (`npm run dev` + `ng serve`)

**Checkpoint:** ¿Docker-compose up funciona? ✅

---

### Base de Datos
- [x] TypeORM conectado a PostgreSQL
- [x] Entidad User creada
- [x] Entidad TwoFactorSecret creada
- [x] Entidad RefreshToken creada
- [x] Migrations ejecutadas
- [x] Tablas creadas en DB

**Checkpoint:** `npm run migration:run` ejecuta sin errores ✅

---

### Auth Backend
- [x] Endpoint POST /auth/signup
  - [x] Validar email único
  - [x] Hash password
  - [x] Retorna token
- [x] Endpoint POST /auth/login
  - [x] Email + password
  - [x] Retorna JWT
- [x] Endpoint POST /auth/2fa/setup
  - [x] Genera QR
  - [x] Guarda secret
- [x] Endpoint POST /auth/2fa/verify
  - [x] Valida código
  - [x] Activa 2FA
- [x] Endpoint POST /auth/refresh
  - [x] Renovar JWT
- [x] JWT middleware funciona
- [x] Error handling básico

**Checkpoint:** Todos los endpoints responden en Postman ✅

**Tests Backend:**
- [x] AuthService.signup() ✅
- [x] AuthService.login() ✅
- [x] Password hashing correcto ✅
- [x] JWT generation ✅
- [x] Coverage auth > 70% ✅

---

### Auth Frontend
- [x] AuthService creado
  - [x] Método login()
  - [x] Método signup()
  - [x] Método verify2FA()
  - [x] Método logout()
- [x] LoginComponent
  - [x] Form email + password
  - [x] Validación
  - [x] Submit envía a backend
- [x] SignupComponent
  - [x] Form email + password + confirmación
  - [x] Validación password strength
  - [x] Submit funciona
- [x] TwoFactorComponent
  - [x] Input para código 2FA
  - [x] Botón verify
  - [x] Redirige después de 2FA
- [x] JWT Interceptor
  - [x] Adjunta token a requests
  - [x] Maneja 401 (refresh token)
- [x] AuthGuard
  - [x] Protege rutas privadas
  - [x] Redirige a login si no auth
- [x] localStorage funciona
  - [x] Token guardado
  - [x] Token removido en logout

**Checkpoint:** Puedo registrarme + logearme ✅

**Tests Frontend:**
- [x] AuthService.login() ✅
- [x] LoginComponent renderiza ✅
- [x] Form validation funciona ✅
- [x] AuthGuard protege rutas ✅

---

### Testing & CI
- [x] Tests backend pasan (auth)
- [x] Tests frontend pasan (auth)
- [x] Coverage backend > 70%
- [x] GitLab CI/CD configura CI (en lugar de GitHub Actions)
- [x] Pre-commit hooks con linting

**Checkpoint:** `npm test` pasa al 100% ✅

---

## 📅 SEMANA 2: MULTI-TENANCY & INSTITUCIONES

**Status:** ⏹️ EN PROGRESO

### Database
- [x] Entidad Institution
  - [x] id, name, slug, logoUrl, createdAt
- [x] Migration: agregar institutionId a User
- [x] Migration: crear tabla Institution
- [x] Índices para slug único

**Checkpoint:** Migrations ejecutadas ✅

---

### Institution Backend
- [ ] POST /api/v1/institutions (crear)
  - [ ] Solo admin
  - [ ] Slug único
  - [ ] Retorna institutionId
- [ ] GET /api/v1/institutions/:id
  - [ ] Solo admin o miembro
- [ ] PATCH /api/v1/institutions/:id
  - [ ] Editar nombre, logo
  - [ ] Solo admin
- [ ] POST /api/v1/institutions/:id/invite-professor
  - [ ] Email invitación
  - [ ] Crea usuario profesor
  - [ ] Link único
- [ ] TenantMiddleware
  - [ ] Valida institutionId en token
  - [ ] Todos los endpoints lo usan

**Checkpoint:** Admin puede crear institución + invitar profesor ✅ / ❌

**Tests Backend:**
- [ ] InstitutionService ✅ / ❌
- [ ] Middleware tenant valida ✅ / ❌
- [ ] Email invitación envía ✅ / ❌

---

### Admin UI
- [ ] AdminModule lazy-loaded
- [ ] AdminGuard (solo admin)
- [ ] Dashboard admin
  - [ ] Crear institución (form)
  - [ ] Ver instituciones creadas
  - [ ] Invitar profesor (form)
- [ ] Componentes responsivos

**Checkpoint:** Admin crea institución desde UI ✅ / ❌

---

### Email Service
- [ ] EmailService
  - [ ] notifyProfessorInvitation()
  - [ ] notifyStudentEnrollment()
- [ ] Templates HTML
  - [ ] Profesional
  - [ ] Con logo
  - [ ] Links funcionales
- [ ] Nodemailer configurable
- [ ] Test SMTP funciona

**Checkpoint:** Email de invitación se recibe ✅ / ❌

---

### Profesor Dashboard
- [ ] ProfessorModule lazy-loaded
- [ ] ProfessorGuard
- [ ] Dashboard básico
  - [ ] Bienvenida
  - [ ] Mi institución
  - [ ] Próximos pasos
- [ ] Navbar con logout

**Checkpoint:** Profesor logueado ve dashboard ✅ / ❌

**Tests:**
- [ ] TenantMiddleware valida ✅ / ❌
- [ ] Profesor no accede a otra institución ✅ / ❌
- [ ] Roles y permisos correctos ✅ / ❌

---

## 📅 SEMANA 3: CURSOS & ESTUDIANTES

**Status:** ⏳ NO INICIADO | ⏹️ EN PROGRESO | ✅ COMPLETADO

### Database
- [ ] Entidad Course
- [ ] Entidad Student
- [ ] Entidad Guardian
- [ ] Entidad StudentEnrollment
- [ ] Migraciones
- [ ] Índices (FK, búsquedas)

**Checkpoint:** Tablas creadas ✅ / ❌

---

### Cursos Backend
- [ ] POST /api/v1/courses
  - [ ] Validar profesor pertenece institución
  - [ ] Crear
  - [ ] Retorna courseId
- [ ] GET /api/v1/courses
  - [ ] Filter por profesor/institución
  - [ ] Paginación
- [ ] GET /api/v1/courses/:id
  - [ ] Detalles
  - [ ] Incluye estudiantes
- [ ] PATCH /api/v1/courses/:id
  - [ ] Editar
- [ ] DELETE /api/v1/courses/:id
  - [ ] Solo si sin calificaciones

**Checkpoint:** CRUD cursos funciona ✅ / ❌

**Tests:**
- [ ] CourseService ✅ / ❌
- [ ] Validaciones ✅ / ❌

---

### Estudiantes Backend
- [ ] POST /api/v1/institutions/:instId/students (crear manual)
  - [ ] Input: nombre, email, apoderado
  - [ ] Crea User estudiante
  - [ ] Crea User apoderado
  - [ ] Vincula
- [ ] POST /api/v1/courses/:courseId/students (asignar)
  - [ ] Crea StudentEnrollment
- [ ] GET /api/v1/courses/:courseId/students
  - [ ] Lista con detalles
- [ ] DELETE /api/v1/courses/:courseId/students/:studentId

**Checkpoint:** Estudiante asignado a curso ✅ / ❌

---

### CSV Import Backend
- [ ] POST /api/v1/courses/:courseId/students/import-csv
  - [ ] Validar formato
  - [ ] Pre-validación datos
  - [ ] Transacción (todo o nada)
  - [ ] Crear/actualizar estudiantes
  - [ ] Crear/actualizar apoderados
  - [ ] Asignar a curso
  - [ ] Retorna reporte
- [ ] GET /api/v1/courses/:courseId/students/csv-template
  - [ ] Descarga template

**Checkpoint:** CSV import funciona sin errores ✅ / ❌

**Tests:**
- [ ] CSV parsing ✅ / ❌
- [ ] Validaciones ✅ / ❌
- [ ] Reporte correcto ✅ / ❌

---

### Cursos UI
- [ ] CreateCourseComponent
  - [ ] Form: nombre, descripción, año, semestre
  - [ ] Validación
  - [ ] Submit funciona
- [ ] ListCoursesComponent
  - [ ] Tabla con cursos
  - [ ] Botones: editar, detalles, eliminar
  - [ ] Paginación
- [ ] CourseDetailComponent
  - [ ] Datos del curso
  - [ ] Profesor
  - [ ] Cantidad estudiantes

**Checkpoint:** Profesor crea curso desde UI ✅ / ❌

**Tests:**
- [ ] Componentes renderizan ✅ / ❌
- [ ] Form validation ✅ / ❌

---

### Estudiantes UI
- [ ] AssignStudentComponent (manual)
  - [ ] Autocomplete estudiantes
  - [ ] Agregar a curso
  - [ ] Validación no duplicados
- [ ] ImportCSVComponent
  - [ ] Upload archivo
  - [ ] Preview datos
  - [ ] Botón confirmar
  - [ ] Mostrar reporte
- [ ] ListStudentsComponent
  - [ ] Tabla por curso
  - [ ] Nombre, email, apoderado
  - [ ] Botón desasignar

**Checkpoint:** Profesor importa CSV exitosamente ✅ / ❌

**Tests:**
- [ ] CSV upload ✅ / ❌
- [ ] Reporte muestra datos correctos ✅ / ❌
- [ ] Validaciones ✅ / ❌

---

### E2E Flujo
```
1. Profesor: Crear curso ✅ / ❌
2. Profesor: Asignar estudiante manual ✅ / ❌
3. Profesor: Importar CSV ✅ / ❌
4. Estudiante: Ve curso asignado ✅ / ❌
```

---

## 📅 SEMANA 4: CALIFICACIONES & TAREAS

**Status:** ⏳ NO INICIADO | ⏹️ EN PROGRESO | ✅ COMPLETADO

### Database
- [ ] Entidad Task
- [ ] Entidad Grade
- [ ] Entidad PerformanceNote
- [ ] Migraciones
- [ ] Índices

**Checkpoint:** Tablas creadas ✅ / ❌

---

### Tareas Backend
- [ ] POST /api/v1/tasks
  - [ ] Crear
  - [ ] Asignar automáticamente a estudiantes de curso
- [ ] GET /api/v1/tasks (por curso)
- [ ] GET /api/v1/tasks/:id
- [ ] PATCH /api/v1/tasks/:id
- [ ] DELETE /api/v1/tasks/:id

**Checkpoint:** Profesor crea tarea ✅ / ❌

**Tests:**
- [ ] TaskService ✅ / ❌

---

### Calificaciones Backend
- [ ] POST /api/v1/tasks/:taskId/grades (lote)
  - [ ] Input: [{studentId, score}, ...]
  - [ ] Validar score 0-100
  - [ ] Crear grades
  - [ ] Dispara evento "grade_created"
- [ ] PATCH /api/v1/tasks/:taskId/grades/:gradeId
  - [ ] Editar individual
- [ ] GET /api/v1/courses/:courseId/grades
  - [ ] Reporte tabla
  - [ ] Estudiante, Tarea1, Tarea2, ..., Promedio
- [ ] GET /api/v1/students/:studentId/grades
  - [ ] Mis calificaciones
- [ ] Cálculo promedio automático
  - [ ] Aritmético simple
  - [ ] Correcto (verificar con ejemplo)

**Checkpoint:** Profesor carga calificaciones + promedio calcula ✅ / ❌

**Tests:**
- [ ] GradeService ✅ / ❌
- [ ] Cálculo promedio ✅ / ❌
- [ ] Validaciones ✅ / ❌

---

### Notas de Desempeño Backend
- [ ] POST /api/v1/performance-notes
  - [ ] Crear
  - [ ] Validar estudiante en curso
- [ ] GET /api/v1/students/:studentId/performance-notes
- [ ] PATCH /api/v1/performance-notes/:id
- [ ] DELETE /api/v1/performance-notes/:id

**Checkpoint:** Profesor escribe y ve notas ✅ / ❌

---

### Calificaciones UI
- [ ] CreateTaskComponent
  - [ ] Form: título, descripción, fecha
- [ ] LoadGradesComponent
  - [ ] Tabla editable
  - [ ] Validación en tiempo real
  - [ ] Botón guardar lote
- [ ] PerformanceNoteComponent
  - [ ] Textarea por estudiante
  - [ ] Guardar individual
  - [ ] Mostrar historial

**Checkpoint:** Profesor carga calificaciones desde UI ✅ / ❌

---

### Calificaciones Estudiante UI
- [ ] MyGradesComponent
  - [ ] Tabla: Tarea, Fecha, Nota, %
  - [ ] Card promedio destacado
  - [ ] Detalles por tarea
- [ ] Mostrar notas de desempeño

**Checkpoint:** Estudiante ve calificaciones + promedio ✅ / ❌

---

### CSV Export
- [ ] GET /api/v1/courses/:courseId/grades/export
  - [ ] Formato CSV
  - [ ] Descargable
- [ ] Botón en UI profesor

**Checkpoint:** Profesor descarga CSV ✅ / ❌

---

### E2E Flujo
```
1. Profesor: Crear tarea ✅ / ❌
2. Profesor: Cargar calificaciones (5 estudiantes) ✅ / ❌
3. Sistema calcula promedio ✅ / ❌
4. Estudiante: Ve nota y promedio ✅ / ❌
5. Profesor: Nota de desempeño ✅ / ❌
6. Estudiante: Ve nota ✅ / ❌
7. Profesor: Descarga CSV ✅ / ❌
```

---

## 📅 SEMANA 5: APODERADO & NOTIFICACIONES

**Status:** ⏳ NO INICIADO | ⏹️ EN PROGRESO | ✅ COMPLETADO

### Database
- [ ] Entidad Notification
- [ ] Migraciones
- [ ] Índices (userId, read, createdAt)

**Checkpoint:** Tabla notificaciones creada ✅ / ❌

---

### Notificaciones Backend
- [ ] NotificationService
  - [ ] createNotification()
  - [ ] getByUser()
  - [ ] markAsRead()
  - [ ] delete()
- [ ] Endpoints
  - [ ] GET /api/v1/notifications
  - [ ] PATCH /api/v1/notifications/:id/read
  - [ ] DELETE /api/v1/notifications/:id
- [ ] Eventos que disparan notificaciones
  - [ ] Task creada → email a estudiantes
  - [ ] Grade creada → email a estudiante + apoderado
  - [ ] PerformanceNote creada → email a apoderado
- [ ] EmailService integrado

**Checkpoint:** Eventos disparan notificaciones ✅ / ❌

**Tests:**
- [ ] NotificationService ✅ / ❌
- [ ] Eventos disparan ✅ / ❌

---

### Apoderado Backend
- [ ] GET /api/v1/guardians/students
  - [ ] Mis estudiantes
- [ ] GET /api/v1/guardians/students/:studentId
  - [ ] Detalles estudiante
  - [ ] Incluye cursos, calificaciones
- [ ] GET /api/v1/students/:studentId/grades
  - [ ] Ver calificaciones hijo
- [ ] Middleware: validar que apoderado solo ve sus datos
- [ ] Read-only para apoderado

**Checkpoint:** Apoderado accede a datos hijo ✅ / ❌

**Tests:**
- [ ] Apoderado no ve otros estudiantes ✅ / ❌
- [ ] Datos correctos ✅ / ❌

---

### Apoderado UI
- [ ] GuardianModule lazy-loaded
- [ ] GuardianGuard (solo apoderado)
- [ ] DashboardComponent
  - [ ] Mis estudiantes (tarjetas)
  - [ ] Click → detalles
- [ ] StudentDetailComponent
  - [ ] Info hijo
  - [ ] Cursos inscritos
  - [ ] Tabla calificaciones
  - [ ] Notas de desempeño
  - [ ] Promedio general
- [ ] NotificationCenterComponent
  - [ ] Historial notificaciones
  - [ ] Marcar como leído
  - [ ] Eliminar

**Checkpoint:** Apoderado ve progreso hijo ✅ / ❌

**Tests:**
- [ ] Componentes renderizan ✅ / ❌
- [ ] Datos correctos ✅ / ❌

---

### Notificaciones UI
- [ ] NotificationService
  - [ ] Obtener notificaciones
  - [ ] Marcar leído
  - [ ] Eliminar
- [ ] Toast/Banner para notificaciones nuevas
  - [ ] Aparece cuando llega notificación
  - [ ] Desparecer después 5s
- [ ] Bell Icon con contador
  - [ ] Muestra número no leídas
  - [ ] Click → dropdown modal
- [ ] Polling cada 30s (o WebSocket si tiempo)

**Checkpoint:** Notificaciones aparecen en UI ✅ / ❌

**Tests:**
- [ ] NotificationService ✅ / ❌
- [ ] Toast funciona ✅ / ❌

---

### Email Templates
- [ ] Template: Nueva tarea
  - [ ] Pro, con logo
- [ ] Template: Nueva calificación
  - [ ] Muestra nota y promedio
- [ ] Template: Nota desempeño
  - [ ] Incluye texto
- [ ] Template: Invitación profesor
- [ ] Template: Recuperar contraseña

**Checkpoint:** Emails se ven profesionales ✅ / ❌

---

### E2E Flujo
```
1. Profesor: Carga calificación ✅ / ❌
2. Estudiante: Recibe email + ve notificación app ✅ / ❌
3. Apoderado: Recibe email + ve notificación ✅ / ❌
4. Apoderado: Login, ve hijo, calificación ✅ / ❌
5. Apoderado: Marca notificación leída ✅ / ❌
```

---

## 📅 SEMANA 6: TESTS, BUGFIXES & DEPLOY

**Status:** ⏳ NO INICIADO | ⏹️ EN PROGRESO | ✅ COMPLETADO

### Testing Exhaustivo
- [ ] Backend
  - [ ] Coverage 75%+
  - [ ] Edge cases testeados
  - [ ] Integración E2E
  - [ ] Seguridad (inyección, XSS)
- [ ] Frontend
  - [ ] Coverage 70%+
  - [ ] Cypress E2E (3-5 flujos críticos)
  - [ ] Responsivo mobile

**Checkpoint:** `npm test` pasa 100% ✅ / ❌

---

### Bugfixes & Polish
- [ ] Formularios: validación completa
- [ ] Seguridad: JWT, CORS, input sanitization
- [ ] Performance: queries, memory
- [ ] Responsive: mobile (testear en device real)
- [ ] Accesibilidad: ARIA, contrast
- [ ] UX: mensajes de error claros

**Checkpoint:** App sin bugs conocidos ✅ / ❌

---

### Documentación
- [ ] README.md
  - [ ] Stack
  - [ ] Setup (clone, npm install, docker-compose)
  - [ ] Comandos principales
  - [ ] Variables env
  - [ ] Troubleshooting
- [ ] API.md
  - [ ] Listado endpoints
  - [ ] Ejemplos curl/Postman
  - [ ] Códigos de error
- [ ] ARCHITECTURE.md
  - [ ] Diagrama flujo
  - [ ] Estructura DB
  - [ ] Decisiones técnicas
- [ ] Postman collection o Swagger
- [ ] Guía deployment

**Checkpoint:** README completo y claro ✅ / ❌

---

### Seed Data
- [ ] Script seed genera:
  - [ ] 2 instituciones
  - [ ] 3 profesores
  - [ ] 15 estudiantes
  - [ ] 10 apoderados
  - [ ] 5 cursos
  - [ ] 20 tareas
  - [ ] Calificaciones ejemplo
- [ ] `npm run seed` funciona sin errores

**Checkpoint:** Seed ejecuta, datos realistas ✅ / ❌

---

### Docker & Deployment
- [ ] Dockerfile backend finalizado
- [ ] docker-compose.yml producción
- [ ] .env separados (dev, test, prod)
- [ ] Build test ejecuta
- [ ] Deploy guía (Heroku/Railway)
- [ ] Script backup DB

**Checkpoint:** `docker-compose up` sin errores ✅ / ❌

---

### CI/CD
- [ ] GitHub Actions
  - [ ] Tests en push
  - [ ] Build check
  - [ ] Lint check
- [ ] Status badge README

**Checkpoint:** CI/CD pasa ✅ / ❌

---

### Cleanup
- [ ] Código temporario removido
- [ ] Comentarios obsoletos eliminados
- [ ] .gitignore actualizado
- [ ] Credenciales removidas
- [ ] Último code review
- [ ] Merge PRs finales

**Checkpoint:** Código limpio ✅ / ❌

---

## 🎯 CRITERIOS FINAL MVP

- [x] Todos endpoints funcionan
- [x] Frontend responsive
- [x] Emails funcionales
- [x] CSV import/export OK
- [x] 2FA funcionando
- [x] Roles y permisos correctos
- [x] Notificaciones (email + app)
- [x] DB optimizada
- [x] Sin deuda técnica obvia
- [x] Fácil deployar
- [x] README completo
- [x] Tests 75%+ backend, 70%+ frontend

---

## 📊 RESUMEN PROGRESO

| Semana | Completado | % | Status |
|--------|-----------|---|--------|
| 1 | 50/50 | 100% | ✅ |
| 2 | 0/30 | 0% | ⏳ |
| 3 | 0/45 | 0% | ⏳ |
| 4 | 0/40 | 0% | ⏳ |
| 5 | 0/35 | 0% | ⏳ |
| 6 | 0/30 | 0% | ⏳ |
| **TOTAL** | **50/230** | **22%** | ⏹️ |

---

## 📝 NOTAS & APRENDIZAJES

```
[Espacio para anotar lo que aprendiste cada semana]

Semana 1:
- Inicialización exitosa del monorepo, backend en Express, y frontend en Angular 17 configurado con Tailwind CSS v4.
- Configuración de conexión TypeORM resuelta mediante el puerto anfitrión 5433 para evitar colisiones con bases de datos locales.
- Definidas y migradas las entidades base User, TwoFactorSecret y RefreshToken.
- Desarrollados middlewares globales de errores, validaciones por DTOs, e interceptor de tokens JWT Bearer.
- Flujo completo de autenticación backend (registro, login, TOTP 2FA, renovación, logout) implementado, validado por tests y curl de integración.

Semana 2:
-

Semana 3:
-

Semana 4:
-

Semana 5:
-

Semana 6:
-
```

---

**Estado Actual:** ⏹️ EN PROGRESO  
**Última actualización:** Junio 2026  
**Próximo checkpoint:** Fin Semana 1 (todos los ✅ de S1)

---

### 💡 TIPS PARA MANTENER EL MOMENTUM

1. **Haz pequeños commits** - No esperes a terminar la semana
2. **Deploy frecuente** - Testea en staging early
3. **Tests mientras desarrollas** - No dejes para el final
4. **Documenta mientras vas** - Mejor que al final
5. **Celebra pequeñas victorias** - Motívate con progress
6. **Si te atrasas** - Prioriza MVP core, deja nice-to-have para post-MVP

