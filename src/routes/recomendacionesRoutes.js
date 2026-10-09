import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

router.post("/", async (req, res) => {

    try {

        // Comprobar que tenemos la clave de Gemini
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                mensaje: "No se ha configurado la clave de Gemini"
            });
        }

        // Recibir las preferencias del usuario
        const {
            genero,
            plataforma,
            precio,
            experiencia
        } = req.body;

        // Crear el cliente de Gemini
        const ai = new GoogleGenAI({
            apiKey: apiKey
        });

        // Preparar las instrucciones para la IA
        const prompt = `
            Eres un experto en videojuegos y asesoras a los jugadores.

            Recomienda exactamente 3 videojuegos que existan realmente,
            basándote en las preferencias del usuario.

            Preferencias del usuario:

            - Género: ${genero || "Cualquiera"}
            - Plataforma: ${plataforma || "Cualquiera"}
            - Presupuesto: ${precio || "Sin límite"}
            - Experiencia deseada: ${experiencia || "Cualquiera"}

            Para cada videojuego proporciona:

            - titulo: nombre oficial del videojuego.
            - motivo: explica por qué encaja con las preferencias.
            - experiencia: describe brevemente cómo se juega.

            Responde exclusivamente con un JSON válido,
            sin Markdown ni bloques de código.

            Utiliza exactamente esta estructura:

            {
                "recomendaciones": [
                    {
                        "titulo": "Nombre del videojuego",
                        "motivo": "Motivo de la recomendación",
                        "experiencia": "Descripción de la experiencia"
                    }
                ]
            }

            No inventes precios exactos ni valoraciones.
            Prioriza juegos que encajen con las preferencias indicadas.
        `;

        // Solicitar las recomendaciones a Gemini
        const respuesta = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: prompt
        });

        // Devolver las recomendaciones al navegador
        // Procesar la respuesta de Gemini
        const textoRespuesta = respuesta.text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        let resultadoIA;

        try {
            resultadoIA = JSON.parse(textoRespuesta);

        } catch (error) {

            console.error("Gemini no devolvió un JSON válido:", textoRespuesta);

            throw new Error("No se pudo interpretar la respuesta de Gemini");
        }


        // Comprobar que recibimos una lista de recomendaciones
        if (!Array.isArray(resultadoIA.recomendaciones)) {
            throw new Error("La respuesta de Gemini no contiene recomendaciones válidas");
        }


        // Preparar los datos de cada videojuego
        const recomendaciones = resultadoIA.recomendaciones
            .filter(juego => juego.titulo && juego.motivo && juego.experiencia)
            .map(juego => ({
                titulo: juego.titulo,
                motivo: juego.motivo,
                experiencia: juego.experiencia
            }));


        // Crear también una versión en texto para mantener
        // el funcionamiento actual del navegador
        const textoRecomendaciones = recomendaciones
            .map((juego, indice) => `
        ${indice + 1}. ${juego.titulo}

        ¿Por qué te lo recomendamos?
        ${juego.motivo}

        ¿Qué experiencia ofrece?
        ${juego.experiencia}
            `.trim())
            .join("\n\n");


        // Enviar los resultados al navegador
        res.json({
            recomendaciones: textoRecomendaciones,
            lista: recomendaciones
        });

    } catch (error) {
        console.error(
            "Error al generar recomendaciones:",
            error
        );

        res.status(500).json({
            mensaje: "No se pudieron generar las recomendaciones"
        });
    }
});

export default router;