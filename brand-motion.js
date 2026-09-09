(() => {
  const section = document.querySelector('.brand-statement');
  const word = document.querySelector('.brand-word');
  if (!section || !word) return;

  const name = word.textContent.trim();
  word.setAttribute('aria-label', name);
  word.innerHTML = [...name].map((letter, index) => {
    const side = index % 2 === 0 ? -1 : 1;
    const distance = (22 + Math.abs(index - (name.length - 1) / 2) * 8) * side;
    const rotate = (index % 3 - 1) * 4;
    return `<span class="brand-letter" aria-hidden="true" style="--brand-index:${index};--brand-start-x:${distance}px;--brand-start-r:${rotate}deg">${letter === ' ' ? '&nbsp;' : letter}</span>`;
  }).join('');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(entry => word.classList.toggle('is-revealed', entry.isIntersecting));
  }, { threshold: .35 });
  reveal.observe(section);

  function resetLetters() {
    word.classList.remove('is-tracking');
    word.querySelectorAll('.brand-letter').forEach(letter => {
      letter.style.setProperty('--brand-lift', '0px');
      letter.style.setProperty('--brand-stretch', '1');
    });
  }

  word.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches) return;
    word.classList.add('is-tracking');
    word.querySelectorAll('.brand-letter').forEach(letter => {
      const box = letter.getBoundingClientRect();
      const center = box.left + box.width / 2;
      const strength = 1 - Math.min(1, Math.abs(event.clientX - center) / 150);
      letter.style.setProperty('--brand-lift', `${(-12 * strength).toFixed(1)}px`);
      letter.style.setProperty('--brand-stretch', (1 + .08 * strength).toFixed(3));
    });
  });
  word.addEventListener('pointerleave', resetLetters);
  word.addEventListener('pointercancel', resetLetters);

  let ticking = false;
  function updateParallax() {
    if (reduced.matches) {
      section.style.setProperty('--brand-scroll', '0px');
      ticking = false;
      return;
    }
    const box = section.getBoundingClientRect();
    const center = box.top + box.height / 2;
    const offset = Math.max(-22, Math.min(22, (innerHeight / 2 - center) * .055));
    section.style.setProperty('--brand-scroll', `${offset.toFixed(1)}px`);
    ticking = false;
  }
  addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateParallax);
    }
  }, { passive: true });
  reduced.addEventListener('change', () => { resetLetters(); updateParallax(); });
  updateParallax();
})();
