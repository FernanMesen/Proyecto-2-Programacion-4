# 💼 Bolsa de Empleo

---

## ¿Qué es esto?
Sistema web tipo SPA (Single Page Application) para gestión de una bolsa de empleo. Permite a empresas publicar puestos de trabajo y a oferentes registrar sus habilidades, con un sistema de búsqueda y coincidencia entre ambos.

---

## Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite + React Router |
| Backend | Spring Boot 3.2 + Java 21 |
| Base de datos | MySQL |
| Seguridad | JWT (Json Web Token) |

---

## Requisitos previos
- **Java 21** o superior
- **Maven 3.x**
- **Node.js 18** o superior
- **MySQL** corriendo localmente

---

## Instalación y configuración

### 1. Base de datos
Abrí MySQL Workbench (u otro cliente) y ejecutá el archivo `database.sql`.  
Esto crea la base de datos, las tablas y un usuario administrador inicial.

```sql
-- O desde terminal:
mysql -u root -p < database.sql
```

### 2. Configurar el backend
Abrí el archivo `backend/src/main/resources/application.properties` y ajustá las credenciales de MySQL:

```properties
spring.datasource.username=root
spring.datasource.password=TU_CONTRASEÑA
```

---

## Cómo correr el proyecto

### Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
El backend queda disponible en **http://localhost:8080**

### Frontend (React)
Abrí una segunda terminal:
```bash
cd frontend
npm install    # solo la primera vez
npm run dev
```
El frontend queda disponible en **http://localhost:5173**

> El frontend redirige automáticamente las llamadas `/api/*` al backend gracias al proxy de Vite.

---

## Estructura del proyecto

```
bolsa-empleo/
├── database.sql               ← Script de base de datos (ejecutar primero)
├── backend/                   ← Spring Boot (Java)
│   └── src/main/java/com/bolsaempleo/
│       ├── config/            ← Seguridad, CORS, JWT
│       ├── model/             ← Entidades (Usuario, Empresa, Puesto, etc.)
│       ├── repository/        ← Acceso a datos
│       ├── service/           ← Lógica de negocio
│       ├── controller/        ← Endpoints REST
│       └── dto/               ← Objetos de transferencia
└── frontend/                  ← React + Vite
    └── src/
        ├── app/               ← Configuración de rutas
        ├── features/          ← Módulos por funcionalidad
        │   ├── auth/          ← Login y contexto de autenticación
        │   ├── public/        ← Páginas públicas
        │   ├── registro/      ← Registro de empresa y oferente
        │   ├── empresa/       ← Panel de empresa
        │   ├── oferente/      ← Panel de oferente
        │   └── admin/         ← Panel de administración
        └── shared/            ← Componentes, estilos y utilidades comunes
```

---

## Roles y funcionalidades

### 🌐 Público (sin login)
- Ver los 5 puestos más recientes
- Buscar puestos por características
- Registrarse como empresa u oferente

### 🏢 Empresa
- Publicar puestos (público o privado) con características requeridas y nivel mínimo
- Buscar candidatos que coincidan con los requisitos de un puesto
- Ver el perfil y CV de candidatos
- Activar o desactivar puestos
- Ver aplicaciones recibidas

### 👤 Oferente
- Registrar y actualizar sus habilidades con nivel (1 al 5)
- Subir su CV en formato PDF
- Buscar y aplicar a puestos disponibles

### 🛡️ Administrador
- Aprobar registros de empresas y oferentes
- Gestionar el catálogo jerárquico de características

---

## Flujo de uso

```
1. Empresa u oferente se registra
2. El administrador aprueba el registro
3. El usuario puede ingresar al sistema
4. Empresa publica puestos con características requeridas
5. Oferente registra sus habilidades y sube su CV
6. Empresa busca candidatos → el sistema muestra coincidencias
7. Oferente aplica a puestos de su interés
```

---

## Credenciales iniciales

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Admin | admin@bolsaempleo.local | admin123 |

> Las empresas y oferentes se registran desde la página principal y deben esperar aprobación del administrador.

---

## Build para producción (un solo servidor)

```bash
# 1. Compilar el frontend
cd frontend
npm run build

# 2. Correr el backend (ya incluye el frontend compilado)
cd ../backend
mvn spring-boot:run
```

Todo queda disponible en **http://localhost:8080**
