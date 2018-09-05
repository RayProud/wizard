import ansiEscapes from 'ansi-escapes';
import keys from '../constants/keys';

class Component {
  constructor(styles) {
    this.styles = styles;

    this.handleEscape();
  }

  ansi = ansiEscapes;

  keys = keys;

  static write(content) {
    let formatted = content;

    if (this.style.caret) {
      formatted = formatted.padStart(formatted.length + 2, '  ');
    }

    process.stdout.write(`\r${formatted}`);
  }

  static newline() {
    process.stdout.write('\r\n');
  }

  static cleanAndExit() {
    process.stdout.write(ansiEscapes.cursorShow);
    process.exit();
  }

  static handleEscape() {
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
