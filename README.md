# 🎮 GameZone

**GameZone** es una aplicación web de videojuegos que permite gestionar una colección de juegos, consultar sus detalles, compartir valoraciones y descubrir nuevas aventuras mediante recomendaciones personalizadas con inteligencia artificial.

El proyecto está desarrollado con Node.js, Express, MongoDB, HTML, CSS y JavaScript, e integra servicios externos para ampliar sus funcionalidades.

## ✨ Funcionalidades

### 🎮 Gestión de videojuegos
- Añadir nuevos videojuegos a la colección.
- Consultar información detallada de cada juego.
- Editar los datos de los videojuegos.
- Eliminar videojuegos.
- Guardar y consultar los juegos almacenados en MongoDB.

### ⭐ Reseñas y valoraciones
- Puntuar los videojuegos del 1 al 5.
- Escribir comentarios sobre cada juego.
- Consultar las opiniones de otros usuarios.

### ❤️ Sistema de favoritos
- Añadir videojuegos a favoritos.
- Quitar juegos de favoritos.
- Consultar la lista de videojuegos favoritos.

### 🏆 Ranking de videojuegos
- Calcular la valoración media de cada juego.
- Mostrar el número de reseñas.
- Ordenar los videojuegos por puntuación.
- Acceder a los detalles desde el ranking.

### 🔎 Búsqueda y filtros
- Buscar videojuegos por su título.
- Filtrar por género.
- Filtrar por plataforma.
- Filtrar por precio.

### 🌐 Integración con RAWG
- Buscar videojuegos en un catálogo externo.
- Importar videojuegos a la colección.
- Obtener imágenes de los juegos.
- Consultar información adicional de los títulos.

### 🎬 Tráileres de videojuegos
- Mostrar vídeos de los videojuegos.
- Integración con YouTube Data API.
- Buscar automáticamente tráileres cuando no hay un vídeo disponible.

### 🤖 Recomendaciones con inteligencia artificial
- Seleccionar un género de videojuego.
- Elegir una plataforma.
- Indicar un presupuesto.
- Seleccionar el tipo de experiencia deseada.
- Recibir recomendaciones personalizadas mediante Gemini.
- Consultar por qué se recomienda cada videojuego y qué experiencia ofrece.

### 🎨 Diseño responsive
- Interfaz con temática gamer y colores neón.
- Tarjetas de videojuegos personalizadas.
- Notificaciones visuales para distintas acciones.
- Menú hamburguesa para dispositivos móviles.
- Diseño adaptable a ordenadores, tablets y móviles.
- Botón para volver rápidamente al principio de la página.
- Footer con enlaces a redes sociales.

## 🛠️ Tecnologías utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express
- MongoDB
- Mongoose

### APIs externas
- RAWG Video Games Database API
- YouTube Data API v3
- Google Gemini API

## 📁 Estructura del proyecto

La estructura principal del proyecto es la siguiente:

```text
proyecto-videojuegos-api/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── src/
│   ├── models/
│   │   ├── videojuego.js
│   │   └── resena.js
│   │
│   └── routes/
│       ├── videojuegosRoutes.js
│       ├── resenasRoutes.js
│       ├── youtubeRoutes.js
│       └── recomendacionesRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

La estructura puede variar ligeramente según la organización actual del proyecto.

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone URL_DE_TU_REPOSITORIO
```

Entra en la carpeta del proyecto:

```bash
cd proyecto-videojuegos-api
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crea un archivo `.env` en la carpeta principal del proyecto.

Añade las variables necesarias para las APIs:

```env
YOUTUBE_API_KEY=tu_clave_de_youtube
GEMINI_API_KEY=tu_clave_de_gemini
```

Configura también la conexión a MongoDB utilizando la variable que emplea el servidor de este proyecto.

Si utilizas alguna otra variable de entorno, añádela con su nombre correspondiente.

**Importante:** las claves son personales y no deben publicarse en GitHub. El archivo `.env` debe estar incluido en `.gitignore`.

### 4. Iniciar MongoDB

Comprueba que MongoDB está disponible y que la aplicación tiene configurada correctamente su conexión a la base de datos.

### 5. Iniciar la aplicación

Desde la terminal, ejecuta:

```bash
node src/app.js
```

Este comando requiere que esté definido en `package.json`.

Después, abre el navegador y accede a:

```text
http://localhost:3000
```

## 🔌 Principales rutas de la API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/videojuegos` | Obtener todos los videojuegos |
| GET | `/api/videojuegos/:id` | Consultar un videojuego |
| POST | `/api/videojuegos` | Añadir un videojuego |
| PUT | `/api/videojuegos/:id` | Actualizar un videojuego |
| DELETE | `/api/videojuegos/:id` | Eliminar un videojuego |
| POST | `/api/resenas` | Crear una reseña |
| GET | `/api/resenas/:videojuegoId` | Obtener las reseñas de un videojuego |
| GET | `/api/youtube/buscar?q=...` | Buscar un vídeo de YouTube |
| POST | `/api/recomendaciones` | Generar recomendaciones con IA |

## 🤖 Recomendaciones con IA

GameZone utiliza Google Gemini para generar recomendaciones a partir de las preferencias indicadas por el usuario.

El sistema tiene en cuenta cuatro criterios:

- Género.
- Plataforma.
- Presupuesto.
- Tipo de experiencia.

La respuesta incluye varias propuestas y una explicación de por qué pueden encajar con las preferencias seleccionadas.

## 🚀 Mejoras futuras

Algunas posibles ampliaciones del proyecto son:

- Crear perfiles de usuario.
- Personalizar las recomendaciones según los favoritos y las reseñas.
- Añadir estadísticas de videojuegos y valoraciones.
- Mejorar los criterios de ordenación y búsqueda.
- Incorporar nuevas funcionalidades para la comunidad gamer.

## 👨‍💻 Autor

Proyecto personal de desarrollo web centrado en la gestión y descubrimiento de videojuegos.

## 📄 Licencia

Este proyecto no especifica una licencia de distribución.

## 🌐 Mis redes sociales

Puedes encontrarme en estas plataformas:

- 🎵 [TikTok](https://www.tiktok.com/@gabriifloow08)
- 📸 [Instagram](https://www.instagram.com/real.gabz08/)
- 💻 [CodePen](https://codepen.io/Gabrieliithoo-Fz)
- 🐙 [GitHub](https://github.com/gf3820591-sketch)