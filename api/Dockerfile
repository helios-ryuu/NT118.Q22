# =================================================================
# Dockerfile — RedShark API (Spring Boot)
# Build context: NT118.Q22/api/
#   docker build -t <registry>/redshark-api:latest -f api/Dockerfile api/
# =================================================================

# ── Stage 1: Build ──────────────────────────────────────────────
FROM eclipse-temurin:25-jdk-alpine AS build
WORKDIR /build

# Cache dependencies before copying source (layer cache optimization)
COPY redshark/pom.xml .
COPY redshark/mvnw .
COPY redshark/.mvn/ .mvn/
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B -q

# Build JAR
COPY redshark/src src/
RUN ./mvnw clean package -DskipTests -B -q

# ── Stage 2: Runtime ────────────────────────────────────────────
FROM eclipse-temurin:25-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S redshark && adduser -S redshark -G redshark
USER redshark

COPY --from=build /build/target/redshark-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=k8s"]
