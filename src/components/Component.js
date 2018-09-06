import ansiEscapes from 'ansi-escapes';
import chalk from 'chalk';

import keys from '../constants/keys';

class Component {
  constructor() {
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
    process.stdin.on('data', key => {
      switch (key) {
        case keys.KEY_ESC:
          this.cleanAndExit();
          break;
        default:
          break;
      }
    });
  }
}

export default Component;
