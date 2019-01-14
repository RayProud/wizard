import ansiEscapes from 'ansi-escapes';
import chalk from 'chalk';

import keys from '../constants/keys';
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.emitKeypressEvents(process.stdin);

class Component {
  ansi = ansiEscapes;

  colors = chalk;

  keys = keys;

  write(text) {
    process.stdout.write(`\r${text}`);
  }

  newline() {
    process.stdout.write('\r\n');
  }

  stopListeningReadline() {
    rl.close();
  }

  cleanAndExit() {
    process.stdout.write(ansiEscapes.cursorShow);
    process.exit();
  }

  // Ensure app is killable
  handleEscape() {
    process.stdin.on('keypress', (_str, key) => {
      if ((key.ctrl && key.name === 'c') || key.name === 'escape') {
        this.cleanAndExit();
      }
    });
  }
}

export default Component;
