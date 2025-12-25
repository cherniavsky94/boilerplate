module.exports = {
  extends: [
    'stylelint-config-standard-scss',
  ],
  plugins: ['stylelint-order'],
  rules: {
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-alphabetical-order': true,
    'selector-class-pattern': null,
    'scss/at-import-partial-extension': 'never',
  },
};
