import Wizard from '../../lib';

import questions from './questions';

const main = async () => {
  const wizard = new Wizard(questions);
  const selections = await wizard.init();
  console.log(selections);
};

main();
