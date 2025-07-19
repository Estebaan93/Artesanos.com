//public/js/papelera.js
document.addEventListener("DOMContentLoaded", () => {
  // Restaurar álbum
  document.querySelectorAll(".btn-restaurar-album").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const confirmacion = await Swal.fire({
        title: '¿Restaurar álbum?',
        text: "El álbum volverá a estar disponible.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, restaurar',
        cancelButtonText: 'Cancelar'
      });

      if (!confirmacion.isConfirmed) return;

      try {
        const res = await fetch(`/restaurar/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          await Swal.fire({
            title: '¡Restaurado!',
            text: 'El álbum ha sido restaurado.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          window.location.href = "/albumes";
        } else {
          const texto = await res.text();
          Swal.fire({
            title: 'Error',
            text: texto,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      } catch (error) {
        console.error("Error al restaurar álbum:", error);
        Swal.fire({
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  });

  // Restaurar imagen
  document.querySelectorAll(".btn-restaurar-img").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const confirmacion = await Swal.fire({
        title: '¿Restaurar imagen?',
        text: "La imagen volverá a estar disponible.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, restaurar',
        cancelButtonText: 'Cancelar'
      });

      if (!confirmacion.isConfirmed) return;

      try {
        const res = await fetch(`/imagenes/${id}/restaurar`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          await Swal.fire({
            title: '¡Restaurada!',
            text: 'La imagen ha sido restaurada.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          window.location.reload();
        } else {
          const texto = await res.text();
          Swal.fire({
            title: 'Error',
            text: texto,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      } catch (error) {
        console.error("Error al restaurar imagen:", error);
        Swal.fire({
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  });

  // Eliminar imagen definitivamente
  document.querySelectorAll(".btn-eliminar-def").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      const confirmacion = await Swal.fire({
        title: '¿Eliminar definitivamente?',
        text: "Esta imagen no se podrá recuperar.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (!confirmacion.isConfirmed) return;

      try {
        const res = await fetch(`/imagenes/${id}/eliminar-definitivo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          await Swal.fire({
            title: '¡Eliminada!',
            text: 'La imagen ha sido eliminada definitivamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
          window.location.reload();
        } else {
          const texto = await res.text();
          Swal.fire({
            title: 'Error',
            text: texto,
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      } catch (error) {
        console.error("Error al eliminar imagen:", error);
        Swal.fire({
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  });

});
