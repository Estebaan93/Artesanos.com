//public/js/albumScript.js
function traducirVisibilidad(vis) {
  switch (vis) {
    case 'personal': return 'Solo yo';
    case 'amigos': return 'Amigos';
    case 'mejores_amigos': return 'Mejores amigos';
    case 'publico': return 'Público';
    case 'personalizada': return 'Personalizada';
    default: return vis;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const modal = document.getElementById('modal-obra');
  const cerrar = document.getElementById('cerrar-modal');
  const modalImg = document.getElementById('modal-imagen');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalVisibilidad = document.getElementById('modal-visibilidad');
  const modalComentarios = document.getElementById('modal-comentarios');
  const etiquetasDiv = document.getElementById("modal-etiquetas");

  // Asignar evento click a todas las miniaturas para abrir modal y cargar comentarios
  document.querySelectorAll('.obra-miniatura').forEach(img => {
    img.addEventListener('click', async function() {
      modalImg.src = img.src;
      modalTitulo.textContent = img.dataset.titulo;
      modalVisibilidad.textContent = "Visibilidad: " + traducirVisibilidad(img.dataset.visibilidad);
      
      etiquetasDiv.innerHTML = ""; 

      const etiquetas = JSON.parse(img.dataset.etiquetas || "[]");

      if (etiquetas.length > 0) {
        etiquetas.forEach((etiqueta) => {
          const span = document.createElement("span");
          span.className = "etiqueta";
          span.textContent = etiqueta;
          etiquetasDiv.appendChild(span);
        });
      } else {
        etiquetasDiv.textContent = "Sin etiquetas";
      }


      modalComentarios.innerHTML = 'Cargando comentarios...';
      try {
        const res = await fetch(`/obras/${img.dataset.id}/comentarios`);
        const data = await res.json();
        if (data.length > 0) {
          modalComentarios.innerHTML = '<h4>Comentarios</h4>';
          data.forEach(c => {
            modalComentarios.innerHTML += `<p><b>${c.usuario}:</b> ${c.descripcion}</p>`;
          });
        } else {
          modalComentarios.innerHTML = '<p>Sin comentarios aún.</p>';
        }
      } catch {
        modalComentarios.innerHTML = '<p>No se pudieron cargar los comentarios.</p>';
      }

      modal.style.display = 'flex';
    });
  });

  cerrar.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // NUEVO: Manejar envío de comentarios desde cada formulario
  document.querySelectorAll('form.form-comentario').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id_imagen = form.dataset.id;
      const textarea = form.querySelector('textarea[name="descripcion"]');
      const descripcion = textarea.value.trim();
      if (!descripcion) return alert('El comentario no puede estar vacío');

      try {
        const res = await fetch(`/obras/${id_imagen}/comentarios`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descripcion })
        });
        const data = await res.json();
        if (data.ok) {
          // Limpiar textarea
          textarea.value = '';

          // Actualizo lista
          const contenedorComentarios = document.querySelector(`div.comentarios[data-id="${id_imagen}"]`);
          // Recargar comentarios del servidor
          const resComentarios = await fetch(`/obras/${id_imagen}/comentarios`);
          const comentarios = await resComentarios.json();

          if (comentarios.length > 0) {
            let html = '<h4>Comentarios</h4>';
            comentarios.forEach(c => {
              html += `<p><b>${c.usuario}:</b> ${c.descripcion}</p>`;
            });
            contenedorComentarios.innerHTML = html;
          } else {
            contenedorComentarios.innerHTML = '<p>Sin comentarios aún.</p>';
          }
        } else {
          alert('No se pudo agregar el comentario');
        }
      } catch {
        alert('Error al enviar el comentario');
      }
    });
  });

//Abrir desde la notificacion el modal de la img
const urlParams= new URLSearchParams(window.location.search);
const idImagen= urlParams.get("img");
if (idImagen) {
  const miniatura = document.querySelector(`.obra-miniatura[data-id="${idImagen}"]`);
    if (miniatura) {
      miniatura.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        miniatura.click();
        // OPCIONAL: limpiar la URL visual
        history.replaceState(null, '', window.location.pathname);
      }, 400);
    }
  }
}); 

//Boton reporta
document.querySelectorAll('.btn-reportar').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id_imagen = btn.dataset.id;

    const { value: motivo } = await Swal.fire({
      title: 'Reportar contenido',
      input: 'textarea',
      inputLabel: 'Motivo del reporte',
      inputPlaceholder: 'Describí por qué estás reportando esta imagen...',
      showCancelButton: true
    });

    if (motivo) {
      try {
        const res = await fetch('/reportes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_imagen, motivo })
        });
        const data = await res.json();
        if (data.ok) {
          Swal.fire('Gracias', 'Tu reporte fue enviado', 'success');
        } else {
          Swal.fire('Error', data.error || 'No se pudo enviar el reporte', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'No se pudo conectar al servidor', 'error');
      }
    }
  });
});
