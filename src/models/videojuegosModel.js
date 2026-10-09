import mongoose from "mongoose";

const videojuegosSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },

    imagen: {
        type: String,
        require: true
    },

    video: {
        type: String
    },

    desarrollador: {
        type: String,
        required: true,
        trim: true
    },

    anio: {
        type: Number,
        required: true
    },

    genero: {
        type: String,
        required: true,
        trim: true
    },

    plataformas: {
        type: [String],
        required: true
    },

    precio: {
        type: Number,
        required: true
    },

    disponible: {
        type: Boolean,
        default: true
    },

    favorito: {
        type: Boolean,
        default: false
    },

});

export const Videojuego = mongoose.model('Videojuego', videojuegosSchema);