/**
 * Modal component controller
 */
export class Modal {
  constructor(selector) {
    this.modal = document.querySelector(selector);
    this.trigger = document.querySelectorAll(`[data-modal="${selector.slice(1)}"]`);
    this.closeBtn = this.modal?.querySelector('[class*="__close"]');
    this.init();
  }

  init() {
    this.trigger.forEach((btn) => {
      btn.addEventListener('click', () => this.open());
    });
    this.closeBtn?.addEventListener('click', () => this.close());
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  open() {
    this.modal?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal?.classList.remove('is-open');
    document.body.style.overflow = '';
  }
}
