import express from "express";
import { Videojuego } from "../models/videojuegosModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const videojuegos = await Videojuego.find();
        res.json(videojuegos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener los videojuegos", error });
    }
});

router.get("/genero/:genero", async (req, res) => {
    try {
        const videojuegos = await Videojuego.find({ genero: req.params.genero });
        res.json(videojuegos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar por genero"});
    }
});

router.get("/plataforma/:plataforma", async (req, res) => {
    try {
        const videojuegos = await Videojuego.find({ plataformas: req.params.plataforma });
        res.json(videojuegos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar por plataforma"});
    }
});

router.get("/disponibles", async (req, res) => {
    try {
        const videojuegos = await Videojuego.find({ disponible: true });
        res.json(videojuegos);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al buscar videojuegos disponibles"});
    }
});

router.put("/:id", async (req, res) => {
    try {
        const videojuegoActualizado = await Videojuego.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" });

        if (!videojuegoActualizado) {
            return res.status(404).json({ mensaje: "Videojuego no encontrado" });
        }

        res.json(videojuegoActualizado);
        
    } catch (error) {
        res.status(400).json({ mensaje: "ID no valido"});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const videojuegoEliminado = await Videojuego.findByIdAndDelete(req.params.id);

        if (!videojuegoEliminado) {
            return res.status(404).json({ mensaje: "Videojuego no encontrado" });
        }
        
        res.json({ mensaje: "Videojuego eliminado correctamente" });

    } catch (error) {
        res.status(400).json({ mensaje: "ID no valido"});
    }
});

router.get("/:id", async (req, res) => {
    try {
        const videojuego = await Videojuego.findById(req.params.id);
        if (!videojuego) {
            return res.status(404).json({ mensaje: "Videojuego no encontrado" });
        }
        res.json(videojuego);
    } catch (error) {
        res.status(400).json({ mensaje: "ID no valido"});
    }
});

router.post("/", async (req, res) => {
    try {
        const nuevoVideojuego = new Videojuego(req.body);

        const videojuegoGuardado = await nuevoVideojuego.save();
        res.status(201).json(videojuegoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al crear el videojuego", error });
    }
});

export default router;