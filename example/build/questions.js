'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var _default = {
  question: 'How would you like to configure your boilerplate?',
  id: 'config-type',
  type: 'list',
  options: [
    {
      name: 'From a template',
      value: 'template',
      then: 'template',
    },
    {
      name: 'Custom',
      value: 'custom',
      then: 'custom',
    },
  ],
  next: {
    template: {
      question: 'Pick a template:',
      id: 'template',
      type: 'list',
      options: [
        {
          name: 'React App',
          value: 'react-app',
        },
        {
          name: 'React Library',
          value: 'react-library',
        },
        {
          name: 'Node Server',
          value: 'node-server',
        },
        {
          name: 'Javasript Library',
          value: 'js-library',
        },
        {
          name: 'Blank Project',
          value: 'blank-project',
        },
      ],
    },
    custom: {
      question: 'Select which features to incude:',
      id: 'features',
      type: 'listToggle',
      options: [
        {
          name: 'Eslint',
          value: 'eslint',
          then: 'testing',
        },
        {
          name: 'Babel',
          value: 'babel',
          then: 'testing',
        },
        {
          name: 'Webpack',
          value: 'webpack',
          then: 'testing',
        },
        {
          name: 'Flow',
          value: 'flow',
          then: 'testing',
        },
        {
          name: 'Prettier',
          value: 'prettier',
          then: 'testing',
        },
        {
          name: 'Editorconfig',
          value: 'editorconfig',
          then: 'testing',
        },
      ],
      next: {
        testing: {
          question: 'Which testing framework would you like to use?',
          id: 'test-framework',
          type: 'list',
          options: [
            {
              name: 'Jest',
              value: 'jest',
              then: 'useReact',
            },
            {
              name: 'Mocha',
              value: 'mocha',
              then: 'useReact',
            },
            {
              name: 'Jasmine',
              value: 'jasmine',
              then: 'useReact',
            },
          ],
          next: {
            useReact: {
              question: 'Will you be using react?',
              id: 'use-react',
              type: 'list',
              options: [
                {
                  name: 'Yes',
                  value: 'yes',
                },
                {
                  name: 'No',
                  value: 'no',
                },
              ],
            },
          },
        },
      },
    },
  },
};
exports.default = _default;