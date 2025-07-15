document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".btn-restaurar").forEach((btn) => {
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
});
