import express from "express"
import Resena from "../models/resena.js"

const router = express.Router()

router.post("/", async (req, res) => {
    try{
        const nuevaResena = new Resena(req.body);
        const resenaGuardada = await nuevaResena.save();
        res.status(201).json(resenaGuardada);
    }catch (error){
        res.status(400).json({
            mensaje: "Error al crear la reseña",
            error
        });
    }
});

router.get("/:videojuegoId", async (req, res) => {
    try{
        const resenas = await Resena.find({
            videojuego: req.params.videojuegoId
        });

        res.json(resenas);
    }catch{
        res.status(400).json({
            mensaje: "Error al obtener las reseñas"
        });
    }
});

export default router;