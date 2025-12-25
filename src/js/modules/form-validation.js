/**
 * Form validation module
 */
export class FormValidator {
  constructor(formSelector, options = {}) {
    this.form = document.querySelector(formSelector);
    this.options = {
      errorClass: 'is-invalid',
      successClass: 'is-valid',
      ...options,
    };
    this.init();
  }

  init() {
    this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
    this.form?.querySelectorAll('input, textarea, select').forEach((field) => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('change', () => this.validateField(field));
    });
  }

  validateField(field) {
    const errors = [];

    if (field.hasAttribute('required') && !field.value.trim()) {
      errors.push('This field is required');
    }

    if (field.type === 'email' && field.value && !this.isValidEmail(field.value)) {
      errors.push('Invalid email format');
    }

    if (field.minLength && field.value.length < field.minLength) {
      errors.push(`Minimum ${field.minLength} characters required`);
    }

    this.setFieldState(field, errors);
    return errors.length === 0;
  }

  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  setFieldState(field, errors) {
    const fieldContainer = field.closest('[class*="field"]');
    let errorElement = fieldContainer?.querySelector('[class*="__error"]');

    if (errors.length > 0) {
      fieldContainer?.classList.add(this.options.errorClass);
      if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'field__error';
        fieldContainer?.appendChild(errorElement);
      }
      errorElement.textContent = errors[0];
    } else {
      fieldContainer?.classList.remove(this.options.errorClass);
      fieldContainer?.classList.add(this.options.successClass);
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const fields = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (isValid) {
      console.log('Form is valid, ready to submit');
      // this.form?.submit();
    }
  }

  reset() {
    this.form?.reset();
    this.form?.querySelectorAll('[class*="field"]').forEach((field) => {
      field.classList.remove(this.options.errorClass, this.options.successClass);
      const error = field.querySelector('[class*="__error"]');
      if (error) error.remove();
    });
  }
}
