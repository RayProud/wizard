import Wizard from '../../lib';

import questions from './questions';

const wizard = new Wizard(questions);
wizard.init().then(selections => {
  // Selections represents all the choices made by the user
  // selections: (e.g)
  // -> configType = 'template'
  // -> template = 'react-app'

  console.log(selections);
});
