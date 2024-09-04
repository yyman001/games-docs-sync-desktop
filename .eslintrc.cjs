/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-ts/eslint-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
    'plugin:vue/essential',
    'standard'
  ],
  rules: {
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-v-for-template-key': 'off',
    'space-before-function-paren': 'off',
    'linebreak-style': 'off'
  }
}
