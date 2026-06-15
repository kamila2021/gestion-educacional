# EduManager 🎓 — Plataforma Multi-Tenant de Gestión Educativa

[![GitLab CI/CD](https://img.shields.io/badge/GitLab%20CI%2FCD-passing-brightgreen?logo=gitlab&logoColor=white)](https://gitlab.com)
[![Angular](https://img.shields.io/badge/Angular%2017.3.8-DF0030?logo=angular&logoColor=white)](https://angular.dev)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-38BDF8?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

**EduManager** es una plataforma educativa multi-tenant diseñada para permitir a colegios e instituciones gestionar cursos, calificaciones, alumnos y apoderados en un entorno unificado de alta seguridad. 

Este repositorio alberga el **MVP de EduManager** estructurado como un **Monorepo** moderno utilizando **npm workspaces**. Cuenta con autenticación robusta mediante tokens JWT, seguridad de doble factor (2FA TOTP), una interfaz de usuario premium con diseño responsivo y oscuro, y un pipeline de integración continua (CI/CD) completamente configurado para GitLab.

---

## 🚀 Arquitectura del Proyecto

El proyecto se organiza bajo una estructura de monorepo que facilita la sincronización de tipos y el desarrollo unificado:

```
gestion-educacional/
├── packages/
│   ├── backend/       # API REST construida con Express, TypeScript y TypeORM
│   ├── frontend/      # Aplicación SPA construida con Angular 17 y Tailwind CSS v4
│   └── shared/        # Tipos y constantes compartidas entre cliente y servidor
├── .gitlab-ci.yml     # Pipeline completo de GitLab CI/CD
├── docker-compose.yml # Contenedor de base de datos PostgreSQL
└── package.json       # Configuración global del monorepo y scripts
```

---

## 💎 Características Clave Implementadas (Semana 1)

### 🔑 Autenticación Segura y Robustez de Sesión (JWT)
*   **Registro (Signup) con Fuerza de Clave**: Pantalla premium que cuenta con un **indicador dinámico de seguridad de la contraseña** (Débil/Medio/Fuerte) y validación de concordancia en tiempo real.
*   **Inicio de Sesión (Login)**: Flujo inteligente que detecta si el usuario tiene activo el doble factor de autenticación (2FA) para redireccionarlo dinámicamente a la verificación de seguridad.
*   **Refresh Token con Identificador Único**: Implementación de renovación automática de tokens que incluye un JWT ID (`jti`) autogenerado (`uuidv4`). Esto resuelve el problema de colisión por claves duplicadas al realizar peticiones concurrentes de inicio de sesión.
*   **Cierre de Sesión Seguro**: Invalida de forma lógica los tokens de refresco eliminándolos de la base de datos PostgreSQL.

### 🛡️ Seguridad Avanzada 2FA TOTP
*   Flujo completo de registro y verificación del doble factor mediante algoritmos estándar TOTP (compatible con Google Authenticator y Authy).
*   Generación dinâmica de códigos QR base64 en la configuración.
*   Pantalla de verificación del código de 6 dígitos con diseño monospace de espaciado ancho (`tracking-[0.75em]`) y estética de tarjeta de cristalera (*glassmorphism*).

### 🖥️ Interfaz de Usuario de Alta Gama (Aesthetics First)
*   Paleta de colores oscura y minimalista basada en tonalidades de índigo y violeta oscuro (`bg-[#080b11]`).
*   Tipografías premium de Google Fonts (**Outfit** e **Inter**).
*   **Dashboard Placeholder**: Panel de control con métricas animadas que simulan cursos activos, estudiantes matriculados, calificaciones pendientes y estado del 2FA. Incluye badges responsivos del rol y un indicador luminoso pulsante para mostrar el estado de la sesión activa.
*   **Responsive & Mobile-First**: Todo el diseño está preparado para adaptarse suavemente a dispositivos móviles.

### ⚙️ Integración Continua (CI/CD) en GitLab
*   Pipeline multicapa configurado en [.gitlab-ci.yml](.gitlab-ci.yml).
*   **Caching inteligente**: Almacena en caché dependencias `node_modules` para optimizar los tiempos de ejecución de la pipeline en base al hash de `package-lock.json`.
*   **Base de Datos Paralela en Test**: Usa servicios dinámicos de GitLab para instanciar un contenedor `postgres:15-alpine` que sirve a las pruebas de integración del backend con inicialización del esquema automático.
*   **Pruebas de Frontend Headless**: Configurado el aprovisionamiento de Chromium a nivel de contenedor y un launcher personalizado `ChromeHeadlessNoSandbox` para permitir que las pruebas de Karma se ejecuten de manera headless en la fase de test bajo el usuario root del contenedor.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend**: Angular 17.3.8 (módulos tradicionales), Tailwind CSS v4, PostCSS, Karma, Jasmine.
*   **Backend**: Express, TypeScript, TypeORM, PostgreSQL, Jest, Ts-Jest, BcryptJS, Speakeasy, QrCode.
*   **Compartido (`@edumanager/shared`)**: Tipos TypeScript y enumeradores como `UserRole`.
*   **Infraestructura & CI/CD**: Docker & Docker Compose, GitLab CI/CD.

---

## 🚦 Instrucciones para Ejecución Local

### 1. Clonar e Instalar Dependencias
```bash
git clone https://github.com/kamila2021/gestion-educacional.git
cd gestion-educacional
npm install --legacy-peer-deps
```

### 2. Configurar Variables de Entorno
Copia los archivos de ejemplo y configura tus credenciales locales:
```bash
cp packages/backend/.env.example packages/backend/.env
```

### 3. Iniciar la Base de Datos (PostgreSQL)
Levanta la base de datos usando Docker:
```bash
npm run db:up
```
*La base de datos estará disponible en el puerto `5433` de tu localhost.*

### 4. Ejecutar Entorno de Desarrollo
Para arrancar el backend y el frontend en simultáneo:

*   **Iniciar Backend**:
    ```bash
    npm run dev:backend
    ```
    *(Corre en http://localhost:3000)*

*   **Iniciar Frontend**:
    ```bash
    npm run dev:frontend
    ```
    *(Corre en http://localhost:4200)*

---

## 🧪 Pruebas del Proyecto

### Pruebas Unitarias del Frontend
Ejecuta los tests unitarios con Karma:
```bash
npm run test --workspace=@edumanager/frontend -- --watch=false --browsers=ChromeHeadless
```
*(Para entornos de CI/CD o contenedores Docker corriendo como root, usa `--browsers=ChromeHeadlessNoSandbox`)*
*Resultado: **27 pruebas completadas exitosamente (100% de éxito)***

### Pruebas de Integración del Backend
Ejecuta las pruebas de base de datos con Jest:
```bash
npm run test:backend
```
*Resultado: **4 suites de integración completadas exitosamente (100% de éxito)***

---

## ⚙️ Configuración del Pipeline en GitLab

La pipeline de GitLab realiza las siguientes tareas:
1.  **Fase `install`**: Descarga y cachea dependencias mediante `npm ci`.
2.  **Fase `build`**: Compila en orden de dependencia: primero `@edumanager/shared`, luego el backend y finalmente el frontend Angular.
3.  **Fase `test`**:
    *   `test:backend`: Inicia un contenedor postgres temporal de servicios y corre las pruebas Jest.
    *   `test:frontend`: Descarga Chromium a nivel de contenedor de forma automatizada y ejecuta la suite de tests de Karma de manera headless utilizando el launcher `ChromeHeadlessNoSandbox`.
