//public/js/albumDetalleModal.js
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-obra');
  const cerrarModal = document.getElementById('cerrar-modal');
  const modalImg = document.getElementById('modal-imagen');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalVisibilidad = document.getElementById('modal-visibilidad');
  const modalEtiquetas = document.getElementById('modal-etiquetas');
  const modalDescripcion = document.getElementById('modal-descripcion');
  const modalComentarios = document.getElementById('modal-comentarios');
  const formComentar = document.getElementById('form-comentar-modal');
  const textareaComentario = document.getElementById('modal-textarea');
  let imagenActualId = null;

  // Abrir modal al clickear una miniatura
  document.querySelectorAll('.imagen-modal-click').forEach(img => {
    img.addEventListener('click', async (e) => {
      e.preventDefault(); // Por si algún día usás <a>
      imagenActualId = img.dataset.id;
      await cargarDatosModal(imagenActualId);
      modal.style.display = 'flex';
    });
  });

  cerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
    limpiarModal();
    limpiarUrl();
  });

  // Cerrar modal clickeando afuera
  modal.addEventListener('click', e => {
    if (e.target === modal) cerrarModal.click();
  });
  // Cerrar modal con Escape
  document.addEventListener('keydown', e => {
    if (e.key === "Escape" && modal.style.display !== "none") cerrarModal.click();
  });

  async function cargarDatosModal(id_imagen) {
    const res = await fetch(`/api/imagen/${id_imagen}`);
    const { imagen, comentarios } = await res.json();
    modalImg.src = imagen.imagen.startsWith('http') ? imagen.imagen : `/img/obras/${imagen.imagen}`;
    modalImg.alt = imagen.titulo;
    modalTitulo.textContent = imagen.titulo;
    modalVisibilidad.textContent = 'Visibilidad: ' + (imagen.visibilidad || '');
    modalEtiquetas.innerHTML = '';
    if (imagen.etiquetas && imagen.etiquetas.length) {
      imagen.etiquetas.forEach(etq => {
        const span = document.createElement('span');
        span.className = 'etiqueta';
        span.textContent = etq;
        modalEtiquetas.appendChild(span);
      });
    }
    modalDescripcion.textContent = imagen.descripcion || '';
    modalComentarios.innerHTML = '';
    if (comentarios && comentarios.length) {
      comentarios.forEach(c => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${c.nombre_usuario || ''}</strong>: ${c.descripcion}`;
        modalComentarios.appendChild(li);
      });
    } else {
      const li = document.createElement('li');
      li.textContent = 'No hay comentarios.';
      modalComentarios.appendChild(li);
    }
  }

  function limpiarModal() {
    modalImg.src = '';
    modalTitulo.textContent = '';
    modalVisibilidad.textContent = '';
    modalEtiquetas.innerHTML = '';
    modalDescripcion.textContent = '';
    modalComentarios.innerHTML = '';
    textareaComentario.value = '';
  }

  // Elimina el parámetro ?img= de la URL al cerrar el modal (opcional pero UX friendly)
  function limpiarUrl() {
    if (window.history.replaceState) {
      const url = new URL(window.location);
      url.searchParams.delete('img');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
  }

  // Formulario para comentar en modal
  if(formComentar) {
    formComentar.addEventListener('submit', async (e) => {
      e.preventDefault();
      const descripcion = textareaComentario.value.trim();
      if (!descripcion) return;
      await fetch(`/obras/${imagenActualId}/comentarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcion })
      });
      textareaComentario.value = '';
      await cargarDatosModal(imagenActualId); // recarga comentarios
    });
  }

  // --- NUEVO: Abre el modal automáticamente si la URL tiene ?img= ---
  const params = new URLSearchParams(window.location.search);
  const imgId = params.get('img');
  if (imgId) {
    // Espera a que el DOM y los eventos estén listos
    setTimeout(() => {
      const imgThumb = document.querySelector(`.imagen-modal-click[data-id="${imgId}"]`);
      if (imgThumb) {
        imgThumb.click();
        // (Opcional: hacer scroll a la imagen en el grid)
        // imgThumb.scrollIntoView({behavior: 'smooth', block: 'center'});
      }
    }, 150); // Pequeño delay por si el grid tarda en renderizar
  }

});
