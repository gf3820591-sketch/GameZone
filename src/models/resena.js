import mongoose from "mongoose";

const resenaSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true
    },

    valoracion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    comentario: {
        type: String,
        required: true
    },

    videojuego: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Videojuego",
        required: true
    }
});

const Resena = mongoose.model("Resena", resenaSchema);

export default Resena;