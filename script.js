let ultimaOrdenId = null;
let nombreUsuario = null;

function guardar(opcion) {
  const nombreInput = document.getElementById("nombre");
  if (!nombreInput.value && !nombreUsuario) {
    alert("Ingresa tu nombre primero");
    return;
  }

  if (!nombreUsuario) {
    nombreUsuario = nombreInput.value;
    nombreInput.disabled = true;
  }

  const ordenes = JSON.parse(localStorage.getItem("ordenes")) || [];
  const nuevaOrden = {
    id: Date.now(),
    nombre: nombreUsuario,
    opcion: opcion,
    fecha: new Date().toLocaleString(),
    listo: false,
    agotado: false    // 👈 ahora se usa “agotado”
  };

  ordenes.push(nuevaOrden);
  localStorage.setItem("ordenes", JSON.stringify(ordenes));
  ultimaOrdenId = nuevaOrden.id;

  document.getElementById("pedido").textContent =
    `Gracias, ${nombreUsuario}. Tu pedido es: ${opcion}`;

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
      if (orden.agotado) {
        estado = " 🔴 Agotado - elige otra opción";
        if (ultimaOrdenId === orden.id) {
          document.getElementById("pedido").textContent =
            `🔴 Tu orden "${orden.opcion}" está agotada. Por favor elige otra opción.`;
          document.querySelectorAll("#opciones img").forEach(img => img.classList.remove("desactivado"));
          document.getElementById("acciones").style.display = "none";
          ultimaOrdenId = null;
        }
      } else if (orden.listo) {
        estado = " ✅ Listo";
      }
      const p = document.createElement("p");
      p.textContent = `${i + 1}. ${orden.opcion} (Fecha: ${orden.fecha})${estado}`;
      contenedor.appendChild(p);
    });
  }
}

setInterval(() => {
  if (nombreUsuario) mostrarHistorial();
}, 5000);
window.addEventListener("storage", () => {
  if (nombreUsuario) mostrarHistorial();
});
