let ultimaOrdenId = null;
let nombreUsuario = null;

function preguntarPapas(opcion) {
  const nombreInput = document.getElementById("nombre");

  // Validar nombre antes de preguntar
  if (!nombreInput.value && !nombreUsuario) {
    alert("Por favor, ingresa tu nombre antes de hacer un pedido.");
    return;
  }

  if (!nombreUsuario) {
    nombreUsuario = nombreInput.value;
    nombreInput.disabled = true;
  }

  // Mensaje más claro (Aceptar = Sí, Cancelar = No)
  const deseaPapas = confirm("¿Deseas papas con tu orden?\nPulsa Aceptar para Sí o Cancelar para No.");
  const detalle = deseaPapas ? `${opcion} con papas` : `${opcion} sin papas`;
  guardar(opcion, deseaPapas, detalle);
}

function guardar(opcion, deseaPapas, detalleTexto) {
  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
  const nuevaOrden = {
    id: Date.now(),
    nombre: nombreUsuario,
    opcion: opcion,
    papas: deseaPapas,
    detalle: detalleTexto,
    fecha: new Date().toLocaleString(),
    listo: false,
    agotado: false
  };

  ordenes.push(nuevaOrden);
  localStorage.setItem("ordenes", JSON.stringify(ordenes));
  ultimaOrdenId = nuevaOrden.id;

  document.getElementById("pedido").textContent =
    `Gracias, ${nombreUsuario}. Tu pedido es: ${detalleTexto}`;

  document.querySelectorAll("#opciones img").forEach(img => img.classList.add("desactivado"));
  document.getElementById("acciones").style.display = "block";

  mostrarHistorial();
}

function nuevaOrden() {
  document.querySelectorAll("#opciones img").forEach(img => img.classList.remove("desactivado"));
  document.getElementById("pedido").textContent = "";
  document.getElementById("acciones").style.display = "none";
  ultimaOrdenId = null;
}

function cancelar() {
  if (ultimaOrdenId !== null) {
    let ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
    ordenes = ordenes.filter(o => o.id !== ultimaOrdenId);
    localStorage.setItem("ordenes", JSON.stringify(ordenes));
  }
  nuevaOrden();
  mostrarHistorial();
}

function mostrarHistorial() {
  const contenedor = document.getElementById("historial");
  contenedor.innerHTML = "";
  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
  const propias = ordenes.filter(o => o.nombre === nombreUsuario);

  if (propias.length === 0) {
    contenedor.innerHTML = "<p>No hay órdenes todavía.</p>";
  } else {
    propias.forEach((orden, i) => {
      let estado = "";
      if (orden.agotado) estado = " 🔴 Agotado - elige otra opción";
      else if (orden.listo) estado = " ✅ Listo";

      const p = document.createElement("p");
      const papasTexto = orden.papas ? "🥔 Con papas" : "❌ Sin papas";
      p.textContent = `${i + 1}. ${orden.opcion} (${papasTexto}) - ${orden.fecha}${estado}`;
      contenedor.appendChild(p);
    });
  }
}

// Actualización automática
setInterval(() => {
  if (nombreUsuario) mostrarHistorial();
}, 5000);

window.addEventListener("storage", () => {
  if (nombreUsuario) mostrarHistorial();
});
