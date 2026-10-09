import express from "express";
const router = express.Router();

router.get("/buscar", async (req, res) => {
    try {
        const busqueda = req.query.q;
        const apiKey = process.env.YOUTUBE_API_KEY;

        const parametros = new URLSearchParams({
            part: "snippet",
            type: "video",
            maxResults: "1",
            q: `${busqueda} trailer`,
            key: apiKey
        });

        const respuesta = await fetch(
            `https://www.googleapis.com/youtube/v3/search?${parametros}`
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            return res.status(respuesta.status).json(datos);
        }

        if (!datos.items || datos.items.length === 0) {
            return res.json({ video: "" });
        }

        const videoId = datos.items[0].id.videoId;
        const video = `https://www.youtube.com/embed/${videoId}`;
        res.json({ video });

    } catch (error) {
        console.error("Error buscando vídeo:", error);

        res.status(500).json({
            mensaje: "Error al buscar el vídeo"
        });
    }
});

export default router;