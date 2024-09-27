# Step 1: Use the official Maven image to build the project
FROM maven:3.8.5-openjdk-17 AS build

# Set working directory inside the container
WORKDIR /app

# Copy the pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the entire project and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Step 2: Build the actual runtime image
FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy the built .jar file from the previous step
COPY --from=build app/target/guitar-tutorial-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080 for the application
EXPOSE 8080

# Set environment variables for Spring Boot profiles
ENV SPRING_PROFILES_ACTIVE=prod

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
