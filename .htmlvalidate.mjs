export default {
  extends: ['html-validate:recommended'],
  rules: {
    // Angular's server renderer writes valueless attributes as `crossorigin=""`.
    'attribute-empty-style': 'off',
  },
};
