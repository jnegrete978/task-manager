# API de Gestión de Tareas con Docker

![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

## Tabla de Contenidos
- [Descripcion](#Descripcion)
- [Características](#características)
- [Requisitos Previos](#requisitos-previos)
- [Inicio Rápido](#inicio-rápido)
- [Documentación de la API](#documentación-de-la-api)
  - [Endpoints de Tareas](#endpoints-de-tareas)
  - [Health Check](#health-check)
- [Gestión con Docker](#gestión-con-docker)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Configuración](#configuración)
- [Desarrollo](#desarrollo)
- [Solución de Problemas](#solución-de-problemas)

## Descripcion
Se desarrollo una aplicacion la "Gestion de tareas", utilizando diferentes recursos y tecnologias disponibles. 

## Características
- Operaciones CRUD completas para tareas
- Integración con Firebase Firestore
- Contenerización con Docker
- Documentación API con Swagger
- Endpoint de verificación de estado
- Soporte para TypeScript

## Requisitos Previos
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (para desarrollo local)

## Inicio Rápido

1. Clonar el repositorio:
```
git clone https://github.com/jnegrete978/task-manager.git
cd task-manager
```
## 2. Configurar entorno:
Editar el archivo .env con tu editor de texto preferido para crearlo
```
PORT=3000
FIREBASE_PROJECT_ID=parcial-taskManager
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
``` 

## 3. Iniciar la aplicación:
```
docker-compose up -d --build
```

## Documentación de la API
Endpoints de Tareas
Obtener Todas las Tareas
```
GET /api/tasks
```

Respuesta:
```json
[
  {
    "id": "ABC123def456",
    "title": "Comprar víveres",
    "description": "Leche, huevos, pan",
    "completed": false,
    "createdAt": "2023-10-05T12:00:00.000Z",
    "updatedAt": "2023-10-05T12:00:00.000Z"
  }
]
```

Crear Tarea
```
POST /api/tasks
```

Cuerpo de la Solicitud:
```json
{
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "completed": false
}
```
#### Respuesta (201 Creado):
```json
{
  "id": "XYZ789uvw123",
  "title": "Nueva tarea",
  "description": "Descripción de la tarea",
  "completed": false,
  "createdAt": "2023-10-05T14:00:00.000Z",
  "updatedAt": "2023-10-05T14:00:00.000Z"
}
```
### Actualizar Tarea
```
PUT /api/tasks/{id}
```
Cuerpo de la Solicitud:

```json
{
  "title": "Tarea actualizada",
  "completed": true
}
```

Respuesta:
204 Sin Contenido

Eliminar Tarea
```
DELETE /api/tasks/{id}
```
Respuesta:
204 Sin Contenido

Gestión con Docker
Construir e Iniciar
```
docker-compose build
docker-compose up -d
```

Ver Logs
```
docker-compose logs -f app
```

Detener Servicios
```
docker-compose down
```

Limpieza Completa
```bash
docker-compose down -v
```
## Ejemplos de Uso
Crear Tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Aprender Docker","completed":false}'
```
Listar Tareas
```bash
curl http://localhost:3000/api/tasks
```
Actualizar Tarea
```bash
curl -X PUT http://localhost:3000/api/tasks/ABC123def456 \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```
Borrar tareas
```bash
curl -X DELETE http://localhost:3000/api/tasks/TASK12345678
```
Configuración

docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    depends_on:
      - firestore

  firestore:
    image: mtlynch/firestore-emulator
    ports:
      - "8080:8080"
    environment:
      - FIRESTORE_PROJECT_ID=task-manager
      - FIRESTORE_PORT=8080
```
Contenido del **.env**
```
PORT=3000
FIREBASE_PROJECT_ID=task-manager
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```
## Desarrollo
1. Instalar dependencias:

```
npm install
```

2. Ejecutar en modo desarrollo:

```bash
npm run dev
```
Acceder a Swagger UI:
```
http://localhost:3000/api-docs
```
# Solución de Problemas
Problemas de Conexión con Firestore
1. Verificar logs del emulador:

```bash
docker-compose logs firestore
```
2. Comprobar credenciales del servicio

API No Responde
Revisar logs de la aplicación:

```bash
docker-compose logs app
```
Errores Comunes
- 404 No Encontrado: Verificar URLs de los endpoints
- 500 Error Interno: Revisar logs de Docker
- Timeout Firestore: Asegurar que el emulador esté en ejecución

