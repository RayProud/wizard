export default {
  question: 'How would you like to configure your boilerplate?',
  id: 'configType',
  type: 'list',
  options: [
    { name: 'From a template', value: 'template', then: 'template' },
    { name: 'Custom', value: 'custom', then: 'custom' },
  ],
  then: {
    email: {
      question: 'Type in your email:',
      id: 'email',
      type: 'text',
      then: {
        question: 'Type in your login:',
        id: 'login',
        type: 'text',
      },
    },
    template: {
      question: 'Pick a template:',
      id: 'template',
      type: 'list',
      options: [
        { name: 'React App', value: 'react-app' },
        { name: 'React Library', value: 'react-library' },
        { name: 'Node Server', value: 'node-server' },
        { name: 'Javasript Library', value: 'js-library' },
        { name: 'Blank Project', value: 'blank-project' },
      ],
    },
    custom: {
      question: 'Select which features to incude:',
      id: 'features',
      type: 'listToggle',
      options: [
        { name: 'Eslint', value: 'eslint', then: 'testing' },
        { name: 'Babel', value: 'babel', then: 'testing' },
        { name: 'Webpack', value: 'webpack', then: 'testing' },
        { name: 'Flow', value: 'flow', then: 'testing' },
        { name: 'Prettier', value: 'prettier', then: 'testing' },
        { name: 'Editorconfig', value: 'editorconfig', then: 'testing' },
      ],
      then: {
        testing: {
          question: 'Which testing framework would you like to use?',
          id: 'testFramework',
          type: 'list',
          options: [
            { name: 'Jest', value: 'jest', then: 'useReact' },
            { name: 'Mocha', value: 'mocha', then: 'useReact' },
            { name: 'Jasmine', value: 'jasmine', then: 'useReact' },
          ],
          then: {
            useReact: {
              question: 'Will you be using react?',
              id: 'useReact',
              type: 'list',
              options: [
                { name: 'Yes', value: 'yes', then: 'askTemplateName' },
                { name: 'No', value: 'no', then: 'askTemplateName' },
              ],
              then: {
                askTemplateName: {
                  question: 'What will be the name of this configuration?',
                  id: 'templateName',
                  type: 'text',
                },
              },
            },
          },
        },
      },
    },
  },
};
