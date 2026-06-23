export function togglePanel(panel, overlay, shouldOpen) {
  const open = (shouldOpen !== undefined) ? shouldOpen : !panel.classList.contains('open');
  panel.classList.toggle('open', open);
  overlay.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

export function closeAllPanels(panels, overlay) {
  panels.forEach(p => p.classList.remove('open'));
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

export function openModal(modal, overlay) {
  modal.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeModal(modal, overlay) {
  modal.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}
