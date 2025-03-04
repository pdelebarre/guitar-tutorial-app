# Guitar Tutorial Application

A web application for learning guitar chords and techniques through interactive tutorials.

## Getting Started

To start the application in development mode:

```bash
docker-compose up
```

For production deployment:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

### Pulling from Docker Hub

To pull the latest production images from Docker Hub:

```bash
docker-compose --profile prod up
```

