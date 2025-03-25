# Build stage
FROM --platform=$BUILDPLATFORM maven:3.9.6-amazoncorretto-21 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 mvn dependency:go-offline

# Copy source code and build
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn clean package -DskipTests

# Run stage
FROM --platform=$TARGETPLATFORM amazoncorretto:21-alpine

WORKDIR /app

# Copy the built jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Set environment variable for tutorials path
ENV TUTORIALS_PATH=/app/tutorials

# Expose application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
