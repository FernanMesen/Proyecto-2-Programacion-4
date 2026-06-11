# ============================================================
# Etapa 1: build del frontend (React + Vite)
# ============================================================
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# vite.config.js ya tiene outDir: ../backend/src/main/resources/static
RUN npm run build

# ============================================================
# Etapa 2: build del backend (Spring Boot) incluyendo el frontend compilado
# ============================================================
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY backend/pom.xml ./
RUN mvn -B dependency:go-offline
COPY backend/src ./src
# Copiamos el resultado del build del frontend a los recursos estáticos del backend
COPY --from=frontend-build /backend/src/main/resources/static ./src/main/resources/static
RUN mvn -B clean package -DskipTests

# ============================================================
# Etapa 3: imagen final de ejecución
# ============================================================
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]