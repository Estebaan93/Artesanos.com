//public/js/modalImagen.js
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modal-imagen');
  const cerrarModal = document.getElementById('cerrar-modal');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalUsuario = document.getElementById('modal-usuario');
  const btnLogin = document.getElementById('btn-login');

  const esVisitante = !window.usuario;

  document.querySelectorAll('.imagen-clickable').forEach(img => {
    img.addEventListener('click', () => {
      if (esVisitante) {
        Swal.fire({
          title: 'Inicia sesión para ver esta imagen',
          text: 'Debes estar registrado para ver más detalles.',
          icon: 'info',
          confirmButtonText: 'Iniciar sesión',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed && btnLogin) {
            btnLogin.click(); // disparamos el modal login
          }
        });
        return;
      }

      modalTitulo.textContent = img.dataset.titulo || 'Sin título';
      modalUsuario.textContent = `Usuario: ${img.dataset.usuario || 'Desconocido'}`;
      modal.style.display = 'flex';
    });
  });

  if (cerrarModal) {
    cerrarModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});

