// public/js/albumIndex.js

document.addEventListener("DOMContentLoaded", () => {
  // Función para eliminar álbum vía fetch (DELETE)
  const eliminarAlbum = async (idAlbum, cardElement) => {
    if (
      !confirm(
        "¿Estás seguro de eliminar este álbum? Esta acción no se puede deshacer."
      )
    )
      return;

    try {
      const res = await fetch(`/albumes/${idAlbum}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        alert("Álbum eliminado");
        cardElement.remove();
      } else {
        alert("Error al eliminar el álbum");
      }
    } catch (error) {
      alert("Error de red al eliminar el álbum");
    }
  };

  // Agregar botón eliminar a cada tarjeta y evento click
  document.querySelectorAll(".album-card").forEach((card) => {
    const tipoAlbum= card.getAttribute("data-tipo"); 
    if(tipoAlbum !=="fisico") return; //Solo albumes fisicos (propios)
    const idAlbum = card
      .querySelector("a")
      .getAttribute("href")
      .split("/")
      .pop();

    // Crear botón eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.style.marginTop = "8px";
    btnEliminar.style.backgroundColor = "#dc3545";
    btnEliminar.style.color = "white";
    btnEliminar.style.border = "none";
    btnEliminar.style.padding = "6px 12px";
    btnEliminar.style.borderRadius = "4px";
    btnEliminar.style.cursor = "pointer";

    btnEliminar.addEventListener("click", (e) => {
      e.preventDefault();
      eliminarAlbum(idAlbum, card);
    });

    card.appendChild(btnEliminar);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.btn-eliminar-imagen').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id_imagen = btn.dataset.id;

      if (confirm('¿Querés eliminar esta imagen? Esta acción no se puede deshacer.')) {
        try {
          const res = await fetch(`/imagenes/${id_imagen}/eliminar`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          });

          if (res.ok) {
            const tarjeta = btn.closest(".obra-card");
            tarjeta.remove();
            alert("Imagen eliminada con éxito.");
          } else if (res.status === 403) {
            alert("No tenés permiso para eliminar esta imagen.");
          } else {
            alert("No se pudo eliminar la imagen.");
          }
        } catch (error) {
          alert("Error al eliminar la imagen.");
          console.error(error);
        }
      }
    });
  });
});
