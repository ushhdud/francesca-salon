(() => {
  const header = document.querySelector('.site-header');
  const nav = header?.querySelector('.site-nav');
  if (!header || !nav || header.querySelector('.mobile-menu-toggle')) return;

  const toggle = document.createElement('button');
  toggle.className = 'mobile-menu-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Открыть меню');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span><span></span>';

  const panel = document.createElement('div');
  panel.className = 'mobile-menu-panel';
  panel.id = 'mobile-menu-panel';
  toggle.setAttribute('aria-controls', panel.id);

  header.insertBefore(toggle, nav);
  header.insertBefore(panel, nav);
  panel.appendChild(nav);

  const action = Array.from(header.children).find((element) =>
    element.matches?.('.booking, .booking-pair')
  );
  if (action) panel.appendChild(action);

  const setOpen = (open) => {
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  };

  toggle.addEventListener('click', () => {
    setOpen(!header.classList.contains('menu-open'));
  });

  panel.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  });

  const desktop = window.matchMedia('(min-width: 761px)');
  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
})();
