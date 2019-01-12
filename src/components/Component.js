import ansiEscapes from 'ansi-escapes';
import chalk from 'chalk';

import keys from '../constants/keys';
const readline = require('readline');

class Component {
  constructor() {
    readline.emitKeypressEvents(process.stdin);
    this.handleEscape();
  }

  ansi = ansiEscapes;

  colors = chalk;

  keys = keys;

  write(text) {
    process.stdout.write(`\r${text}`);
  }

  newline() {
    process.stdout.write('\r\n');
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
