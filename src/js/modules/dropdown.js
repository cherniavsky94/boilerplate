/**
 * Dropdown component controller
 */
export class Dropdown {
  constructor(selector) {
    this.dropdown = document.querySelector(selector);
    this.toggle = this.dropdown?.querySelector('[class*="__toggle"]');
    this.menu = this.dropdown?.querySelector('[class*="__menu"]');
    this.init();
  }

  init() {
    this.toggle?.addEventListener('click', () => this.toggleMenu());
    document.addEventListener('click', (e) => {
      if (!this.dropdown?.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.menu?.classList.toggle('is-open');
  }

  closeMenu() {
    this.menu?.classList.remove('is-open');
  }

  openMenu() {
    this.menu?.classList.add('is-open');
  }
}
