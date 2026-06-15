# Sistema de Gestión Educativa - Especificación MVP

**Versión:** 1.0  
**Fecha:** Junio 2026  
**Proyecto:** EduManager MVP  
**Duración Estimada:** 4-6 semanas (desarrollo full-time)

---

## 1. VISIÓN DEL PRODUCTO

Una plataforma educativa que permite a **instituciones** gestionar sus cursos, estudiantes y calificaciones. Los tres roles principales (Profesor, Estudiante, Apoderado) interactúan según sus permisos específicos en un entorno multi-tenant.

---

## 2. OBJETIVOS DEL MVP

✅ Validar que la arquitectura multi-tenant es viable  
✅ Demostrar gestión básica de cursos y estudiantes  
✅ Implementar calificaciones y notas de desempeño  
✅ Crear flujo completo de autenticación con 2FA  
✅ Generar un producto deployable y testeado  

---

## 3. ALCANCE: LO QUE HAREMOS

### 3.1 Autenticación & Autorización
- [x] Login/Signup con email y contraseña
- [x] 2FA por email (código de 6 dígitos)
- [x] Recuperación de contraseña
- [x] Roles: Administrador, Profesor, Estudiante, Apoderado
- [x] JWT con refresh tokens
- [x] Multi-tenant: cada institución tiene su propio espacio

### 3.2 Gestión de Instituciones
- [x] Crear institución (admin)
- [x] Invitar profesores a institución
- [x] Dashboard básico de institución
- [x] Parámetros de institución (nombre, logo, etc.)

### 3.3 Gestión de Cursos
- [x] Crear curso (profesor)
- [x] Asignar estudiantes manualmente (profesor)
- [x] Importar estudiantes desde CSV (profesor)
- [x] Listar cursos por profesor/estudiante
- [x] Ver detalles del curso (estudiantes, profesor, período)

### 3.4 Gestión de Estudiantes & Apoderados
- [x] Crear estudiante con apoderado asociado
- [x] Importar estudiantes + apoderados desde CSV
- [x] Un apoderado puede tener múltiples estudiantes
- [x] Asignar estudiante a curso
- [x] Ver lista de estudiantes por curso (profesor)

### 3.5 Calificaciones & Notas
- [x] Profesor carga calificaciones por tarea/evaluación
- [x] Calcular promedio automático por estudiante
- [x] Profesor escribe notas de desempeño
- [x] Estudiante ve sus calificaciones y promedio
- [x] Apoderado ve calificaciones de su estudiante + notas

### 3.6 Tareas
- [x] Crear tarea y asignarla a curso
- [x] Definir fecha de entrega
- [x] Profesor califica tarea (nota)
- [x] Estudiante ve tareas asignadas y calificaciones

### 3.7 Notificaciones
- [x] Email cuando se publica nueva tarea
- [x] Email cuando se carga calificación
- [x] Alerts en app (banner/toast) para eventos importantes
- [x] Centro de notificaciones (historial)

### 3.8 Reportes Básicos
- [x] Descargar calificaciones de curso como CSV
- [x] Reporte de promedio por estudiante
- [x] Historial de actividad simple

---

## 4. LO QUE NO HAREMOS (Fuera del MVP)

❌ Chat/Mensajería en tiempo real  
❌ Asistencia/Attendance system  
❌ Tareas con entregas y revisión iterativa  
❌ Foros de discusión  
❌ Integración con Google Classroom o sistemas externos  
❌ App móvil (responsive web sí)  
❌ Horarios/Calendario de clases  
❌ Pago en línea o facturación  
❌ Análisis avanzado (BI/dashboards complejos)  
❌ Video conferencias  

---

## 5. FUNCIONALIDADES POR ROL

### 5.1 Administrador
- Crear institución
- Invitar profesores
- Ver todas las instituciones
- Configuración del sistema

### 5.2 Profesor
- Crear cursos
- Asignar/importar estudiantes
- Cargar calificaciones
- Escribir notas de desempeño
- Crear tareas
- Ver progreso de estudiantes
- Descargar reportes CSV

### 5.3 Estudiante
- Ver mis cursos
- Ver tareas asignadas
- Ver mis calificaciones y promedio
- Ver notas de desempeño
- Recibir notificaciones

### 5.4 Apoderado
- Ver estudiantes a mi cargo
- Ver cursos de mis estudiantes
- Ver calificaciones y promedio
- Ver notas de desempeño
- Recibir notificaciones de cambios importantes

---

## 6. STACK TECNOLÓGICO

### Frontend
- **Framework:** Angular 17+
- **Lenguaje:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Angular HttpClient + RxJS
- **Formularios:** Reactive Forms
- **Validación:** Built-in validators + custom validators
- **Guards:** Route guards para autorización

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Lenguaje:** TypeScript
- **ORM:** TypeORM
- **Validación:** class-validator + class-transformer
- **Autenticación:** JWT (jsonwebtoken)
- **Email:** Nodemailer
- **2FA:** speakeasy

### Base de Datos
- **Primary:** PostgreSQL 14+
- **Migrations:** TypeORM migrations
- **Seeding:** Script simple en TypeORM

### DevOps & Testing
- **Testing Frontend:** Jasmine + Karma
- **Testing Backend:** Jest
- **Linting:** ESLint + Prettier
- **Docker:** Dockerfile para backend + docker-compose
- **CI/CD:** GitHub Actions (opcional para MVP)

---

## 7. ARQUITECTURA DE BASE DE DATOS (ESQUEMA SIMPLE)

```
ENTIDADES PRINCIPALES:

Institution
├── id, name, slug, logo_url, created_at

User (Multi-tenant)
├── id, email, password_hash, first_name, last_name
├── role (admin, professor, student, guardian)
├── institution_id (FK)
├── two_factor_enabled, created_at

Course
├── id, institution_id (FK), professor_id (FK)
├── name, description, academic_year, semester
├── created_at

StudentEnrollment
├── id, student_id (FK), course_id (FK)
├── enrolled_at

Teacher (Vincula profesor a institución)
├── id, user_id (FK), institution_id (FK)

Student (Vincula estudiante a apoderado)
├── id, user_id (FK), guardian_id (FK)
├── institution_id (FK)

Guardian
├── id, user_id (FK), institution_id (FK)

Task
├── id, course_id (FK), professor_id (FK)
├── title, description, due_date
├── created_at

Grade
├── id, task_id (FK), student_id (FK)
├── score, percentage, created_at

PerformanceNote
├── id, student_id (FK), professor_id (FK)
├── course_id (FK), content
├── created_at

Notification
├── id, user_id (FK), type, content
├── read, created_at

AuditLog (opcional)
├── id, user_id, action, entity, entity_id
├── timestamp
```

---

## 8. FLUJOS PRINCIPALES (Happy Path)

### 8.1 Onboarding - Crear Institución y Profesor
```
1. Admin crea institución (nombre, slug)
2. Admin invita profesor por email
3. Profesor hace signup (email pre-llenado)
4. Profesor activa 2FA
5. Profesor accede a dashboard
```

### 8.2 Crear Curso y Asignar Estudiantes
```
Opción A - Manual:
1. Profesor crea curso
2. Profesor va a "Estudiantes"
3. Profesor busca y asigna estudiantes existentes
4. Confirmación: estudiante agregado

Opción B - CSV:
1. Profesor crea curso
2. Profesor descarga template CSV
3. Profesor completa: nombre, email, apoderado_email
4. Profesor sube CSV
5. Sistema crea estudiantes + apoderados si no existen
6. Asigna estudiantes al curso
7. Envía emails de invitación
```

### 8.3 Cargar Calificación
```
1. Profesor crea tarea
2. Profesor carga calificación para cada estudiante
3. Sistema calcula promedio automático
4. Email notifica a estudiante y apoderado
5. Estudiante/Apoderado ven calificación en dashboard
```

### 8.4 Apoderado ve Progreso
```
1. Apoderado hace login
2. Ve lista: "Mis estudiantes"
3. Selecciona estudiante
4. Ve: Cursos > Tareas > Calificaciones > Promedio
5. Ve: Notas de desempeño del profesor
```

---

## 9. ENTIDADES CLAVE & RELACIONES

| Entidad | Relación | Notas |
|---------|----------|-------|
| Institution | 1:N Users, Courses | Multi-tenant |
| User | 1:1 Guardian/Student/Teacher | Polimórfico |
| Course | N:M Students (via StudentEnrollment) | Por profesor |
| Task | 1:N Grades | Evaluaciones |
| Grade | 1:1 Task, 1:1 Student | Nota individual |
| Guardian | 1:N Students | 1 apoderado, muchos hijos |
| Notification | 1:N Users | Log de eventos |

---

## 10. ENDPOINTS API (v1) - RESUMEN

### Autenticación
```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/2fa/verify
POST   /api/v1/auth/refresh
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password
```

### Instituciones
```
POST   /api/v1/institutions (admin)
GET    /api/v1/institutions/:id
PATCH  /api/v1/institutions/:id
POST   /api/v1/institutions/:id/invite-professor
```

### Cursos
```
POST   /api/v1/courses (profesor)
GET    /api/v1/courses (listado por rol)
GET    /api/v1/courses/:id
PATCH  /api/v1/courses/:id
```

### Estudiantes
```
POST   /api/v1/courses/:courseId/students (asignar)
POST   /api/v1/courses/:courseId/students/import-csv
GET    /api/v1/courses/:courseId/students
DELETE /api/v1/courses/:courseId/students/:studentId
```

### Calificaciones
```
POST   /api/v1/tasks (crear tarea)
POST   /api/v1/tasks/:taskId/grades (cargar calificaciones)
PATCH  /api/v1/tasks/:taskId/grades/:gradeId
GET    /api/v1/courses/:courseId/grades (reporte)
GET    /api/v1/students/:studentId/grades
```

### Notas de Desempeño
```
POST   /api/v1/performance-notes (profesor crea)
GET    /api/v1/students/:studentId/performance-notes
```

### Notificaciones
```
GET    /api/v1/notifications
PATCH  /api/v1/notifications/:id/read
DELETE /api/v1/notifications/:id
```

---

## 11. PANTALLAS PRINCIPALES (Frontend)

### Profesor
- Dashboard: resumen cursos, estudiantes, tareas pendientes
- Cursos: crear, listar, editar
- Estudiantes: asignar, importar CSV, listar por curso
- Tareas: crear, listar, cargar calificaciones
- Reportes: descargar CSV de notas

### Estudiante
- Dashboard: mis cursos, mis tareas
- Cursos: listar, ver detalles
- Calificaciones: ver notas, promedio, detalles por tarea
- Notificaciones: historial

### Apoderado
- Dashboard: mis estudiantes
- Estudiante Detail: cursos, calificaciones, promedio, notas
- Notificaciones: historial

### Admin
- Dashboard: crear institución, invitar profesores
- Instituciones: listar, editar

---

## 12. DATOS INICIALES (SEED)

Para testing y demo, el MVP incluirá:
- 1 Institución de ejemplo
- 2 Profesores
- 10 Estudiantes
- 5 Apoderados
- 3 Cursos
- 5 Tareas
- Algunas calificaciones pre-cargadas

---

## 13. CRITERIOS DE ACEPTACIÓN

### Frontend
- [ ] Todas las pantallas son responsive (mobile-first)
- [ ] 80%+ coverage en tests para servicios críticos
- [ ] Sin console errors o warnings
- [ ] Formularios validados y con mensajes claros
- [ ] UX consistente con Tailwind

### Backend
- [ ] 70%+ coverage en tests (controladores + servicios)
- [ ] Validación en todas las entradas
- [ ] Manejo de errores consistente
- [ ] API documentation (Swagger o similar)
- [ ] Migrations ejecutables

### General
- [ ] Código en TypeScript estricto
- [ ] README con instrucciones de setup
- [ ] Variables de entorno documentadas
- [ ] Docker functional
- [ ] Deployable en Heroku o similar

---

## 14. TIMELINE ESTIMADO (Desarrollo Full-Time)

```
Semana 1:
  - Setup proyecto (repos, env, docker-compose)
  - Autenticación backend (login, 2FA, JWT)
  - Login/signup frontend

Semana 2:
  - Multi-tenancy setup (middleware, migrations)
  - Gestión de instituciones (crear, invitar)
  - Tests iniciales backend

Semana 3:
  - CRUD de cursos
  - Asignar estudiantes (manual + CSV)
  - Dashboard profesor básico

Semana 4:
  - Calificaciones y tareas
  - Dashboard estudiante
  - Notificaciones por email

Semana 5:
  - Dashboard apoderado
  - Notas de desempeño
  - Reportes CSV

Semana 6:
  - Tests frontend
  - Bugs y pulido
  - Documentación
  - Deploy
```

---

## 15. LIMITACIONES & DECISIONES TÉCNICAS

### Multi-tenancy
- **Implementación:** Schema aislado por institución (row-based filtering)
- **Ventaja:** Simple para MVP, fácil de testear

### Autenticación
- **2FA por email:** Simple, sin dependencias externas
- **Tokens JWT:** Refresh tokens con expires en 1 hora

### Calificaciones
- **Escala:** 0-100 puntos o porcentaje (flexible)
- **Promedio:** Promedio aritmético simple

### Notificaciones
- **Email:** Usando Nodemailer (SMTP)
- **In-app:** Simple toast/banner, sin real-time

### CSV
- **Encoding:** UTF-8
- **Separador:** Coma
- **Validación:** Pre-validación antes de importar

---

## 16. PRÓXIMOS PASOS POST-MVP

- [ ] Chat profesor-estudiante
- [ ] Sistema de asistencia
- [ ] Entregas de tareas (upload + comentarios)
- [ ] Horarios y calendario
- [ ] App móvil nativa
- [ ] Integración SSO (Google, Microsoft)
- [ ] BI y dashboards avanzados
- [ ] Pagos y planes
- [ ] Multi-idioma

---

## 17. RECURSOS & REFERENCIAS

### Documentación
- Angular: https://angular.io/docs
- Express: https://expressjs.com/
- TypeORM: https://typeorm.io/
- PostgreSQL: https://www.postgresql.org/docs/

### Librerías Clave
- jsonwebtoken
- class-validator
- speakeasy (2FA)
- nodemailer
- papaparse (CSV parsing)
- rxjs

---

**Documento elaborado:** Junio 2026  
**Estado:** APROBADO PARA DESARROLLO  
**Próxima revisión:** Fin de Semana 2
