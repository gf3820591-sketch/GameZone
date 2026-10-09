import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import videojuegosRoutes from "./routes/videojuegosRoutes.js";
import resenasRoutes from "./routes/resenasRoutes.js";
import youtubeRoutes from "./routes/youtubeRoutes.js";
import recomendacionesRoutes from "./routes/recomendacionesRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static("public"));

app.use("/api/videojuegos", videojuegosRoutes);

app.use("/api/resenas", resenasRoutes);

app.use("/api/youtube", youtubeRoutes);

app.use("/api/recomendaciones", recomendacionesRoutes);

await mongoose.connect(process.env.MONGODB_URI);

console.log('Conectado a MongoDB');

app.get('/', (req, res) => {
    res.json({ mensaje: 'API  de videojuegos funcionando'});
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
})