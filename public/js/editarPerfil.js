//public/js/editarPerfil.js
console.log("ACTIVO EDITARPERFIL.JS");

document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('contenedorFormaciones');
  const btnAgregar = document.getElementById('btnAgregarFormacion');

  // Agregar formacion
  btnAgregar.addEventListener('click', () => {
    const index = contenedor.children.length;
    const div = document.createElement('div');
    div.classList.add('formacion-item');
    div.setAttribute('data-index', index);

    div.innerHTML = `
      <label>Formación:</label>
      <select name="formaciones[${index}][tipo]" required>
        <option value="">-- Seleccione una formación --</option>
        ${opcionesFormacion.map(tipo => `<option value="${tipo}">${tipo}</option>`).join('')}
      </select>

      <label>Fecha:</label>
      <input type="date" name="formaciones[${index}][fecha]" required />

      <label>Institución:</label>
      <input type="text" name="formaciones[${index}][institucion]" required />

      <label>Descripción:</label>
      <textarea name="formaciones[${index}][descripcion]"></textarea>

      <button type="button" class="btn-eliminar-formacion">Eliminar</button>
    `;

    contenedor.appendChild(div);
    agregarEventoEliminar(div.querySelector('.btn-eliminar-formacion'));
  });

  // Eliminar formación
  function agregarEventoEliminar(boton) {
    boton.addEventListener('click', () => {
      const formacionItem = boton.closest('.formacion-item');
      formacionItem.remove();
    });
  }

  document.querySelectorAll('.btn-eliminar-formacion').forEach(agregarEventoEliminar);

  // Modal de contraseña
  const btnAbrirModal = document.getElementById('btnAbrirModal');
  const modal = document.getElementById('modalPassword');

  btnAbrirModal.addEventListener('click', () => {
    modal.classList.add('visible');
  });

  window.cerrarModal = function () {
    modal.classList.remove('visible');
  };

  // Validación de contraseña solo si se completó al menos un campo
  const formEditar = document.getElementById('formEditarPerfil');

  formEditar.addEventListener('submit', (e) => {
    const actual = document.getElementById('passwordActual');
    const nueva = document.getElementById('nuevaPassword');
    const confirmar = document.getElementById('confirmarPassword');

    const actualVal = actual?.value.trim() ?? '';
    const nuevaVal = nueva?.value.trim() ?? '';
    const confirmarVal = confirmar?.value.trim() ?? '';

    const quiereCambiar = actualVal !== '' || nuevaVal !== '' || confirmarVal !== '';

    if (quiereCambiar) {
      if (!actualVal || !nuevaVal || !confirmarVal) {
        e.preventDefault();
        alert("Para cambiar la contraseña debes completar todos los campos.");
        return;
      }

      if (nuevaVal !== confirmarVal) {
        e.preventDefault();
        alert("La nueva contraseña y su confirmación no coinciden.");
        return;
      }

      if (nuevaVal.length < 3) {
        e.preventDefault();
        alert("La nueva contraseña debe tener al menos 3 caracteres.");
        return;
      }
    }
  });
});
