const listaVideojuegos = document.querySelector('#lista-videojuegos');

const API_KEY = '245dd9a561c04a77812ea4c143097900';
const BASE_URL = 'https://api.rawg.io/api';

let paginaRAWG = 1;

async function obtenerJuegos(busqueda = "", pagina = 1) {
    try {
        const url = `${BASE_URL}/games?key=${API_KEY}&page_size=10&page=${pagina}&search=${encodeURIComponent(busqueda)}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        const data = await response.json();

        const resultadosRawg = document.getElementById("resultados-rawg");

        resultadosRawg.style.display = "grid";

        // Si es la primera página, limpiamos los resultados
        if (pagina === 1) {
            resultadosRawg.innerHTML = "";
        }

        data.results.forEach(juego => {

            const tarjeta = document.createElement("div");

            tarjeta.classList.add("tarjeta-rawg");

            tarjeta.innerHTML = `
                <img src="${juego.background_image || ""}" alt="${juego.name}">

                <div class="info-videojuego">
                    <h2>${juego.name}</h2>

                    <p>
                        <strong>Lanzamiento:</strong>
                        ${juego.released || "Sin fecha"}
                    </p>

                    <p>
                        <strong>Valoración RAWG:</strong>
                        ⭐ ${juego.rating || "Sin valoración"}
                    </p>

                    <p>
                        <strong>Plataformas:</strong>
                        ${
                            juego.platforms
                                ? juego.platforms
                                    .map(plataforma => plataforma.platform.name)
                                    .join(", ")
                                : "Sin información"
                        }
                    </p>

                    <button class="boton-anadir-rawg" data-id="${juego.id}">
                        ➕ Añadir a mis videojuegos
                    </button>
                </div>
            `;

            resultadosRawg.appendChild(tarjeta);

            tarjeta
                .querySelector(".boton-anadir-rawg")
                .addEventListener("click", async () => {

                    let video = "";

                    const respuestaVideo = await fetch(`${BASE_URL}/games/${juego.id}/movies?key=${API_KEY}`);

                    const datosVideo = await respuestaVideo.json();

                    if(datosVideo.results && datosVideo.results.length > 0){
                        video = datosVideo.results[0].data;
                    }else{
                        const respuestaYoutube = await fetch(`/api/youtube/buscar?q=${encodeURIComponent(juego.name)}`);

                        const datosYoutube = await respuestaYoutube.json();

                        if(datosYoutube.video){
                            video = datosYoutube.video;
                        }
                    }

                    const nuevoVideojuego = {
                        titulo: juego.name,
                        desarrollador: juego.developers?.[0]?.name || "Desconocido",
                        anio: juego.released
                            ? Number(juego.released.substring(0, 4))
                            : 0,
                        genero: juego.genres?.[0]?.name || "Desconocido",
                        plataformas: juego.platforms?.map(p => p.platform.name) || [],
                        precio: 0,
                        imagen: juego.background_image,
                        video: video
                    }

                    const respuesta = await fetch("/api/videojuegos", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(nuevoVideojuego)
                    });

                    const resultado = await respuesta.json();
                                        
                    if(respuesta.ok){
                        mostrarNotificacion("🎮 ¡Videojuego añadido correctamente desde RAWG!");
                        document.querySelectorAll(`.boton-anadir-rawg[data-id="${juego.id}"]`
                        ).forEach(boton => {
                            boton.closest(".tarjeta-rawg").remove();
                        });

                        await cargarVideojuegos();
                    }
                });
        });

        // Boton Cargar Mas
        let botonCargarMas = document.getElementById("cargar-mas-rawg");

        if (!botonCargarMas) {
            botonCargarMas = document.createElement("button");
            botonCargarMas.id = "cargar-mas-rawg";
            botonCargarMas.textContent = "🎮 Cargar más";

            resultadosRawg.after(botonCargarMas);

            botonCargarMas.addEventListener("click", async () => {
                paginaRAWG++;

                const textoActual = document
                    .getElementById("buscar-videojuego")
                    .value
                    .trim();

                await obtenerJuegos(textoActual, paginaRAWG);
            });
        }

    } catch (error) {
        console.error(
            "Hubo un problema al obtener los juegos:",
            error
        );
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const buscador = document.getElementById("buscar-videojuego");
    const filtroGenero = document.getElementById("filtro-genero");
    const filtroPlataforma = document.getElementById("filtro-plataforma");
    const filtroPrecio = document.getElementById("filtro-precio");

    function filtrarVideojuegos() {
        const texto = buscador.value.toLowerCase();
        const generoSeleccionado = filtroGenero.value;
        const plataformaSeleccionada = filtroPlataforma.value;
        const precioSeleccionado = filtroPrecio.value;

        document.querySelectorAll("#lista-videojuegos > div:not(.tarjeta-rawg)").forEach(tarjeta => {
            const titulo = tarjeta.querySelector("h2").textContent.toLowerCase();
            const genero = tarjeta.querySelector(".info-videojuego p:nth-child(4)").textContent;
            const plataformas = tarjeta.querySelector(".info-videojuego p:nth-child(5)").textContent;
            const precioTexto = tarjeta.querySelector(".info-videojuego p:nth-child(6)").textContent;
            const precio = parseFloat(precioTexto.replace(",", ".").replace(/[^\d.]/g, ""));
            const coincideTitulo = titulo.includes(texto);

            const coincideGenero =
                generoSeleccionado === "" ||
                genero.includes(generoSeleccionado);

            const coincidePlataforma =
                plataformaSeleccionada === "" ||
                plataformas.includes(plataformaSeleccionada);

            let coincidePrecio = true;

            if (precioSeleccionado === "20") {
                coincidePrecio = precio < 20;
            }

            if (precioSeleccionado === "20-40") {
                coincidePrecio = precio >= 20 && precio <= 40;
            }

            if (precioSeleccionado === "40") {
                coincidePrecio = precio > 40;
            }

            if (
                coincideTitulo &&
                coincideGenero &&
                coincidePlataforma &&
                coincidePrecio
            ) {
                tarjeta.style.display = "";
            } else {
                tarjeta.style.display = "none";
            }
        });
    }

    buscador.addEventListener("input", filtrarVideojuegos);

    buscador.addEventListener("input", () => {
    const texto = buscador.value.trim();

        if (texto.length >= 2) {
            paginaRAWG = 1;
            obtenerJuegos(texto, 1);
        }
    });

    filtroGenero.addEventListener("change", filtrarVideojuegos);
    filtroPlataforma.addEventListener("change", filtrarVideojuegos);
    filtroPrecio.addEventListener("change", filtrarVideojuegos);

});

async function cargarVideojuegos() {
    try{
        const respuesta = await fetch("/api/videojuegos");
        const videojuegos = await respuesta.json();

        listaVideojuegos.innerHTML = "";

        videojuegos.forEach(videojuego => {
            const tarjeta = document.createElement("div");

            tarjeta.innerHTML = `
            <img src="${videojuego.imagen}" alt="${videojuego.titulo}">

            <div class="info-videojuego">
                <h2>${videojuego.titulo}</h2>
                <p><strong>Desarrollador:</strong> ${videojuego.desarrollador}</p>
                <p><strong>Año:</strong> ${videojuego.anio}</p>
                <p><strong>Genero:</strong> ${videojuego.genero}</p>
                <p><strong>Plataformas:</strong> ${videojuego.plataformas.join(", ")}</p>
                <p><strong>Precio:</strong> ${videojuego.precio} €</p>
            </div>

            <button class="btn-detalles" data-id="${videojuego._id}">
                👁️ Ver detalles
            </button>

            <button class="btn-favorito" data-id="${videojuego._id}">
                ${videojuego.favorito ? "❤️ Quitar de favoritos" : "🤍 Añadir a favoritos"}
            </button>

            <button class="btn-editar" data-id="${videojuego._id}">
                ✏️ Editar
            </button>

            <button class="btn-eliminar" data-id="${videojuego._id}">
                🗑️ Eliminar
            </button>`;

            listaVideojuegos.appendChild(tarjeta);

            tarjeta.querySelector(".btn-favorito").addEventListener("click", async () => {
                const id =videojuego._id;

                const respuesta = await fetch(`/api/videojuegos/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                        favorito: !videojuego.favorito
                    })
                });

                if(respuesta.ok){
                    if(videojuego.favorito){
                        mostrarNotificacion("💔 Videojuego eliminado de favoritos");
                    }else{
                        mostrarNotificacion("❤️ ¡Videojuego añadido a favoritos!");
                    }

                    cargarVideojuegos();
                }
            });
        });

        document.querySelectorAll(".btn-detalles").forEach(boton => {
            boton.addEventListener("click", async() => {
                await mostrarDetalles(boton.dataset.id);

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
        });

        document.querySelectorAll(".btn-eliminar").forEach(boton => {
            boton.addEventListener('click', async () => {
                const id = boton.dataset.id;
                const respuesta = await fetch(`/api/videojuegos/${id}`, {
                    method: "DELETE"
                });

                if(respuesta.ok){
                    mostrarNotificacion("🗑️ ¡Videojuego eliminado correctamente!");
                    boton.closest("#lista-videojuegos > div").remove();
                }
            });
        });

        document.querySelectorAll(".btn-editar").forEach(boton => {
            boton.addEventListener('click', async () => {

                const id = boton.dataset.id;

                const respuesta = await fetch(`/api/videojuegos/${id}`);
                const videojuego = await respuesta.json();

                document.getElementById("titulo").value = videojuego.titulo;
                document.getElementById("desarrollador").value = videojuego.desarrollador;
                document.getElementById("anio").value = videojuego.anio;
                document.getElementById("genero").value = videojuego.genero;
                document.getElementById("plataformas").value = videojuego.plataformas.join(", ");
                document.getElementById("precio").value = videojuego.precio;
                document.getElementById("imagen").value = videojuego.imagen;

                formulario.style.display = "grid";
                botonMostrarFormulario.textContent = "✖ Cerrar formulario";
                formulario.dataset.id = id;

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
        });

    }catch(error){
        console.log("Error al cargar los videojuegos", error);
    }
}

cargarVideojuegos();
obtenerJuegos();

const formulario = document.getElementById('formulario-videojuego');

formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    console.log("Formulario enviado");

    mostrarNotificacion("🎮 PRUEBA");

    const nuevoVideojuego = {
        titulo: document.getElementById("titulo").value,
        desarrollador: document.getElementById("desarrollador").value,
        anio: Number(document.getElementById("anio").value),
        genero: document.getElementById("genero").value,
        plataformas: document.getElementById("plataformas").value.split(",").map(p => p.trim()),
        precio: Number(document.getElementById("precio").value),
        imagen: document.getElementById("imagen").value,
        video: document.getElementById("video").value
    };

    const id = formulario.dataset.id;
    const url = id
        ? `/api/videojuegos/${id}`
        : "/api/videojuegos";

    const metodo = id ? "PUT" : "POST";

    const respuesta = await fetch(url, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoVideojuego)
    });

    const resultado = await respuesta.json();
    
    console.log("Respuesta del servidor:", resultado);

    if(respuesta.ok){
        if(id){
            mostrarNotificacion("✏️ ¡Videojuego actualizado correctamente!")
        }else{
            mostrarNotificacion("🎮 ¡Videojuego añadido correctamente!")
        }
    }

    formulario.reset();
    formulario.dataset.id = "";
    cargarVideojuegos();
});

const botonMostrarFormulario = document.getElementById("mostrar-formulario");
botonMostrarFormulario.addEventListener("click", () => {

    if (formulario.style.display === "none") {
        formulario.style.display = "grid";
        botonMostrarFormulario.textContent = "✖ Cerrar formulario";
    } else {
        formulario.style.display = "none";
        botonMostrarFormulario.textContent = "➕ Añadir videojuego";
    }
});

const detalleVideojuego = document.getElementById("detalle-videojuego");

async function mostrarDetalles(id) {

    const respuesta = await fetch(`/api/videojuegos/${id}`);
    const videojuego = await respuesta.json();

    if(!videojuego.video){
        const respuestaYoutube = await fetch(
            `/api/youtube/buscar?q=${encodeURIComponent(videojuego.titulo)}`
        );

        const datosYoutube = await respuestaYoutube.json();

        if(datosYoutube.video){
            videojuego.video = datosYoutube.video;

            await fetch(`/api/videojuegos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    video: videojuego.video
                })
            });
        }
    }

    const respuestaResenas = await fetch(`/api/resenas/${id}`);
    const resenas = await respuestaResenas.json();

    listaVideojuegos.style.display = "none";
    detalleVideojuego.style.display = "block";
    detalleVideojuego.parentNode.prepend(detalleVideojuego);

    detalleVideojuego.innerHTML = `
    
        <div class="ventana-detalles">
            <button id="volver-videojuegos">
                ✖ Cerrar
            </button>

            <div class="detalle">
                <img src="${videojuego.imagen}" alt="${videojuego.titulo}">

                <div>
                    <h1>${videojuego.titulo}</h1>
                    <p><strong>Desarrollador:</strong> ${videojuego.desarrollador}</p>
                    <p><strong>Año:</strong> ${videojuego.anio}</p>
                    <p><strong>Género:</strong> ${videojuego.genero}</p>
                    <p><strong>Plataformas:</strong> ${videojuego.plataformas.join(", ")}</p>
                    <p><strong>Precio:</strong> ${videojuego.precio} €</p>
                </div>
            </div>

            <div class="video-juego">
                <h2>🎬 Tráiler del juego</h2>

                <iframe
                    src="${videojuego.video}"
                    title="Tráiler del videojuego"
                    allowfullscreen>
                </iframe>
            </div>

            <div class="resenas-detalle">
                <h2>⭐ Valoraciones</h2>
                <div id="lista-resenas-detalle">
                    ${
                        resenas.length === 0
                        ? "<p>No hay valoraciones todavía.</p>"
                        : resenas.map(resena => `
                            <div class="resena">
                                <strong>👤 ${resena.usuario}</strong>
                                <p>⭐ ${resena.valoracion}/5</p>
                                <p>"${resena.comentario}"</p>
                            </div>
                        `).join("")
                    }
                </div>
            </div>

            <div class="formulario-resena-detalle">
                <h3>📝 Deja tu valoración</h3>

                <input type="text" id="usuario-resena" placeholder="Tu nombre">

                <select id="valoracion-resena">
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="1">⭐</option>
                </select>

                <textarea id="comentario-resena" placeholder="Escribe tu comentario..."></textarea>

                <button id="enviar-resena">
                    ⭐ Enviar reseña
                </button>

            </div>
        </div>
    `;

    document.getElementById("volver-videojuegos").addEventListener("click", () => {
        detalleVideojuego.innerHTML = "";
        listaVideojuegos.style.display = ""; 
    });

    document.getElementById("enviar-resena").addEventListener("click", async () => {

        const usuario = document.getElementById("usuario-resena").value;
        const valoracion = Number(document.getElementById("valoracion-resena").value);
        const comentario = document.getElementById("comentario-resena").value;

        if (!usuario || !comentario) {
            alert("Completa todos los campos");
            return;
        }

        const nuevaResena = {
            usuario: usuario,
            valoracion: valoracion,
            comentario: comentario,
            videojuego: id
        };

        const respuesta = await fetch("/api/resenas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevaResena)
        });

        if (respuesta.ok) {
            alert("⭐ Reseña añadida correctamente");

            mostrarDetalles(id);
        } else {
            alert("❌ Error al añadir la reseña");
        }
    });
}

const botonFavoritos = document.getElementById("mostrar-favoritos");

botonFavoritos.addEventListener("click", async () => {
    const respuesta = await fetch("/api/videojuegos");
    const videojuegos = await respuesta.json();

    listaVideojuegos.innerHTML = "";

    const favoritos = videojuegos.filter(videojuego => videojuego.favorito);

    if(favoritos.length === 0){
        listaVideojuegos.innerHTML = `
            <p class="sin-favoritos">
                ❤️ Todavía no tienes videojuegos favoritos.
            </p>
        `;
        return;
    }

    favoritos.forEach(videojuego => {
        const tarjeta = document.createElement("div");

        tarjeta.innerHTML = `
            <img src="${videojuego.imagen}" alt="${videojuego.titulo}">
            
            <div class="info-videojuegos">
                <h2>${videojuego.titulo}</h2>
                <p><strong>Desarrollador:</strong> ${videojuego.desarrollador}</p>
                <p><strong>Año:</strong> ${videojuego.anio}</p>
                <p><strong>Genero:</strong> ${videojuego.genero}</p>
                <p><strong>Plataformas:</strong> ${videojuego.plataformas.join(", ")}</p>
                <p><strong>Precio:</strong> ${videojuego.precio} €</p>
            </div>
            
            <button class="btn-detalles" data-id="${videojuego._id}">
                👁️ Ver detalles
            </button>
            
            <button class="btn-favorito" data-id="${videojuego._id}">
                ❤️ Quitar de favoritos
            </button>
        `;

        listaVideojuegos.appendChild(tarjeta);

        tarjeta.querySelector(".btn-favorito").addEventListener("click", async () => {
            const respuesta = await fetch(`/api/videojuegos/${videojuego._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    favorito: false
                })
            });

            if (respuesta.ok) {
                mostrarNotificacion("💔 Videojuego eliminado de favoritos");
                tarjeta.remove();

                // Si ya no quedan favoritos, mostramos un mensaje
                if (!listaVideojuegos.querySelector(".btn-favorito")) {
                    listaVideojuegos.innerHTML = `
                        <p class="sin-favoritos">
                            ❤️ Todavía no tienes videojuegos favoritos.
                        </p>
                    `;
                }
            }
        });
    });

    document.querySelectorAll(".btn-detalles").forEach(boton => {
        boton.addEventListener("click", () => {
            mostrarDetalles(boton.dataset.id);
        });
    });
});

const botonTodos = document.getElementById("mostrar-todos");

botonTodos.addEventListener("click", () => {
    cargarVideojuegos();
});

const botonRanking = document.getElementById("mostrar-ranking");
const rankingVideojuegos = document.getElementById("ranking-videojuegos");

botonRanking.addEventListener("click", async () => {
    const respuestaVideojuegos = await fetch("/api/videojuegos");
    const videojuegos = await respuestaVideojuegos.json();

    const ranking = [];

    for(const videojuego of videojuegos){
        const respuestaResenas = await fetch(
            `/api/resenas/${videojuego._id}`
        );

        const resenas = await respuestaResenas.json();

        if(resenas.length > 0){
            const suma = resenas.reduce(
                (total, resena) => total + resena.valoracion,
                0
            );

            const media = suma / resenas.length;

            ranking.push({
                videojuego: videojuego,
                media: media,
                numeroResenas: resenas.length
            });
        }
    }

    ranking.sort((a, b) => b.media - a.media);
    
    rankingVideojuegos.innerHTML = `
        <div class="cabecera-ranking">
            <h2>🏆 Ranking de videojuegos</h2>

            <button id="cerrar-ranking">
                ✖ Cerrar ranking
            </button>
        </div>
    `;

    ranking.forEach((item, indice) => {

        let posicion = indice + 1;
        let medalla = "";
        if(posicion === 1){
            medalla = "🥇";
        }else if(posicion === 2){
            medalla = "🥈";
        }else if(posicion === 3){
            medalla = "🥉";
        } else {
            medalla = `#${posicion}`;
        }

        rankingVideojuegos.innerHTML += `
            <div class="tarjeta-ranking" data-id="${item.videojuego._id}">
                <div class="posicion-ranking">
                    ${medalla}
                </div>
                
                <div class="info-ranking">
                    <h3>
                        ${indice + 1}. ${item.videojuego.titulo}
                    </h3>
                    <p>⭐ ${item.media.toFixed(1)} / 5</p>
                    <p>📝 ${item.numeroResenas} reseña${item.numeroResenas !== 1 ? "s" : ""}</p>
                </div>

                <button class="btn-ranking-detalles">
                    👁️ Ver detalles
                </button>
            </div>
        `;
    });

    document.getElementById("cerrar-ranking").addEventListener("click", () => {
        rankingVideojuegos.innerHTML = "";
        cargarVideojuegos();
    });

    document.querySelectorAll(".btn-ranking-detalles").forEach(boton => {
        boton.addEventListener("click", async () => {
            const tarjeta = boton.closest(".tarjeta-ranking");
            const id = tarjeta.dataset.id;

            await mostrarDetalles(id);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });
});



function mostrarNotificacion(mensaje){
    console.log("🔔 Notificación:", mensaje);
    const notificacion = document.getElementById("mensaje-notificacion");
    notificacion.textContent = mensaje;
    notificacion.classList.add("mostrar");
    setTimeout(() => {
        notificacion.classList.remove("mostrar");
    }, 3000);
}

const botonMenu = document.getElementById("boton-menu");
const menuMovil = document.getElementById("menu-movil");

botonMenu.addEventListener("click", () => {
    menuMovil.classList.toggle("menu-abierto")
})

// ⬆️ Botón para volver arriba

function iniciarBotonVolverArriba() {

    const boton = document.getElementById("volver-arriba");

    if (!boton) {
        console.error("No se encuentra el botón para volver arriba");
        return;
    }

    // Mostrar la flecha cuando bajamos por la página
    function comprobarScroll() {

        if (window.scrollY > 300) {
            boton.classList.add("visible");
        } else {
            boton.classList.remove("visible");
        }

    }

    window.addEventListener("scroll", comprobarScroll, {
        passive: true
    });

    // Subir suavemente al principio
    boton.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    // Comprobar la posición inicial
    comprobarScroll();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarBotonVolverArriba
    );
} else {
    iniciarBotonVolverArriba();
}

// 🤖 ABRIR Y CERRAR RECOMENDACIONES

const botonAbrirRecomendaciones = document.getElementById("mostrar-recomendaciones");
const seccionRecomendaciones = document.getElementById("seccion-recomendaciones");
const botonCerrarRecomendaciones = document.getElementById("cerrar-recomendaciones");
const formularioRecomendaciones = document.getElementById("formulario-recomendaciones");
const resultadoRecomendaciones = document.getElementById("resultado-recomendaciones");


// Abrir la sección de recomendaciones

botonAbrirRecomendaciones.addEventListener("click", () => {
    seccionRecomendaciones.style.display = "block";

    // Cerrar el menú hamburguesa si está abierto
    const menu = document.getElementById("menu-movil");

    if (menu && menu.classList.contains("menu-abierto")) {
        menu.classList.remove("menu-abierto");
    }

    // Desplazarse hasta las recomendaciones
    seccionRecomendaciones.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

});


// Cerrar la sección

botonCerrarRecomendaciones.addEventListener("click", () => {
    seccionRecomendaciones.style.display = "none";

});

// 🤖 Generar recomendaciones con Gemini

formularioRecomendaciones.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    const boton = document.getElementById("boton-generar-recomendaciones");

    // Recoger las preferencias del usuario
    const preferencias = {
        genero: document.getElementById("recomendacion-genero").value,
        plataforma: document.getElementById("recomendacion-plataforma").value,
        precio: document.getElementById("recomendacion-precio").value,
        experiencia: document.getElementById("recomendacion-experiencia").value
    };

    // Mostrar que estamos buscando recomendaciones
    boton.disabled = true;
    boton.textContent = "🤖 Buscando videojuegos...";

    resultadoRecomendaciones.textContent =
        "✨ La inteligencia artificial está preparando tus recomendaciones. Espera un momento...";

    try {

        // Enviar las preferencias al servidor
        const respuesta = await fetch("/api/recomendaciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(preferencias)
        });

        const datos = await respuesta.json();

        // Comprobar si el servidor ha devuelto un error
        if (!respuesta.ok) {
            throw new Error(
                datos.mensaje || "No se pudieron generar las recomendaciones."
            );
        }

        // Limpiar los resultados anteriores
        resultadoRecomendaciones.innerHTML = "";

        // Comprobar que hemos recibido una lista de juegos
        if (!Array.isArray(datos.lista) || datos.lista.length === 0) {

            resultadoRecomendaciones.textContent =
                datos.recomendaciones || "No se han encontrado recomendaciones.";

        } else {

            // Crear una tarjeta para cada videojuego
            for (const [indice, juego] of datos.lista.entries()) {

                let imagen = "";

                // Buscar la imagen del videojuego en RAWG
                try {

                    const respuestaRAWG = await fetch(
                        `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(juego.titulo)}&page_size=1`
                    );

                    if (respuestaRAWG.ok) {
                        const datosRAWG = await respuestaRAWG.json();
                        imagen = datosRAWG.results?.[0]?.background_image || "";
                    }

                } catch (error) {
                    console.error("Error al buscar la imagen:", error);
                }

                // Crear la tarjeta
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("tarjeta-recomendacion");

                // Imagen del videojuego
                if (imagen) {
                    const img = document.createElement("img");

                    img.src = imagen;
                    img.alt = juego.titulo;
                    img.loading = "lazy";

                    tarjeta.appendChild(img);
                }

                // Información del videojuego
                const contenido = document.createElement("div");
                contenido.classList.add("contenido-recomendacion");
                const titulo = document.createElement("h3");
                titulo.textContent = `${indice + 1}. ${juego.titulo}`;
                const motivo = document.createElement("p");
                const etiquetaMotivo = document.createElement("strong");

                etiquetaMotivo.textContent = "🤖 ¿Por qué te lo recomendamos?";

                motivo.appendChild(etiquetaMotivo);
                motivo.appendChild(document.createElement("br"));
                motivo.appendChild(document.createTextNode(juego.motivo));

                const experiencia = document.createElement("p");
                const etiquetaExperiencia = document.createElement("strong");

                etiquetaExperiencia.textContent = "🎮 ¿Qué experiencia ofrece?";

                experiencia.appendChild(etiquetaExperiencia);
                experiencia.appendChild(document.createElement("br"));
                experiencia.appendChild(document.createTextNode(juego.experiencia));
                contenido.appendChild(titulo);
                contenido.appendChild(motivo);
                contenido.appendChild(experiencia);

                tarjeta.appendChild(contenido);
                resultadoRecomendaciones.appendChild(tarjeta);
            }
        }

    } catch (error) {
        console.error("Error al generar recomendaciones:", error);
        resultadoRecomendaciones.textContent =
            "❌ No se pudieron generar las recomendaciones. Comprueba que el servidor funciona correctamente y revisa la consola.";

    } finally {

        // Restaurar el botón
        boton.disabled = false;
        boton.textContent = "✨ Recomiéndame videojuegos";

    }
});