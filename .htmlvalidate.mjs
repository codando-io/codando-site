export default {
  extends: ['html-validate:recommended'],
  rules: {
    // Angular's server renderer writes valueless attributes as `crossorigin=""`.
    'attribute-empty-style': 'off',
    // The hero figure staggers its motion with a per-element custom property.
    'no-inline-style': ['error', { allowedProperties: ['--i'] }],
  },
};
