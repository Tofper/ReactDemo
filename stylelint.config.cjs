// Stylelint config for React + TypeScript + SCSS Modules (BEM-inspired)
// See project guide for conventions

/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    'stylelint-config-standard-scss',
  ],
  plugins: [
    'stylelint-order',
  ],
  customSyntax: 'postcss-scss',
  ignoreFiles: [
    'dist/**/*',
    'node_modules/**/*',
    'public/**/*',
  ],
  rules: {
    "scss/no-global-function-names": null,
    "scss/no-duplicate-mixins": true,
    // Disallow type selectors except :global for CSS Modules
    'selector-type-no-unknown': [
      true,
      {
        ignoreTypes: [
          // Allow :global pseudo for CSS Modules
          ':global',
        ],
      },
    ],

    // Allow :global pseudo-class selector for CSS Modules
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],

    // Property order (grouped for readability)
    'order/properties-order': [
      [
        // Positioning
        'position',
        'top',
        'right',
        'bottom',
        'left',
        'z-index',
        // Display & Box Model
        'display',
        'flex',
        'flex-direction',
        'flex-wrap',
        'flex-flow',
        'justify-content',
        'align-items',
        'align-content',
        'order',
        'float',
        'clear',
        'box-sizing',
        'width',
        'min-width',
        'max-width',
        'height',
        'min-height',
        'max-height',
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
        // Typography
        'font',
        'font-family',
        'font-size',
        'font-weight',
        'font-style',
        'font-variant',
        'font-size-adjust',
        'font-stretch',
        'line-height',
        'letter-spacing',
        'text-align',
        'text-transform',
        'text-decoration',
        'text-shadow',
        'color',
        // Background
        'background',
        'background-color',
        'background-image',
        'background-repeat',
        'background-position',
        'background-size',
        'background-clip',
        // Border
        'border',
        'border-radius',
        'border-width',
        'border-style',
        'border-color',
        'box-shadow',
        // Other
        'overflow',
        'opacity',
        'transition',
        'transform',
        'animation',
        'cursor',
        'pointer-events',
        'user-select',
      ],
      { unspecified: 'bottomAlphabetical' },
    ],

    // SCSS-specific rules
    'scss/load-partial-extension': 'never',
    'scss/at-mixin-pattern': '^[a-z][a-zA-Z0-9-]*$',
    'scss/dollar-variable-pattern': '^[a-z][a-zA-Z0-9-]*$',
    'scss/percent-placeholder-pattern': '^[a-z][a-zA-Z0-9-]*$',
    'scss/selector-no-redundant-nesting-selector': true,

    // Allow nesting, but warn for deep nesting
    'max-nesting-depth': [3, {
      ignore: ['blockless-at-rules'],
      message: 'Avoid deep nesting for maintainability (max 3 levels).',
    }],

    // General rules
    'block-no-empty': true,
    // Enforce BEM selector pattern (allowing for SCSS modules and modifiers)
    'selector-class-pattern': [
      '^[a-z0-9]+(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$',
      {
        message: 'Selector should follow BEM convention (block, block__element, block--modifier, block__element--modifier)',
        resolveNestedSelectors: true
      }
    ],
  },
}; 