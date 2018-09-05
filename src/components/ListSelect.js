import chalk from 'chalk';

import Component from './Component';

class ListSelect extends Component {
  constructor(question, styles) {
    super(styles);
    this.question = question.question;
    this.options = question.options;

    this.chosen = 0;
  }

  init() {
    return new Promise(resolve => {
      this.write(chalk.white(this.question));
      this.newline();

      process.stdin.on('data', () => {
        const value = this.handleInput();
        if (value !== null) {
          resolve(value);
        }
      });
    });
  }

  updateDisplay() {
    this.write(this.ansi.cursorSavePosition);

    this.options.forEach((option, index) => {
      if (index === this.chosen) {
        if (this.styles.caret) {
          this.write(this.styles.caret + chalk.white(this.options.question));
        } else {
          this.write(chalk.white(this.options.question));
        }
      } else {
        this.write(chalk.gray(this.options.question));
      }

      this.newline();
    });

    this.write(this.ansi.cursorRestorePosition);
  }

  handleInput(key) {
    switch (key) {
      case this.keys.KEY_UP:
        this.chosen = this.chosen === 0 ? 0 : this.chosen - 1;
        this.updateDisplay();
        return null;
      case this.keys.KEY_DOWN:
        this.chosen =
          this.chosen === this.options.length - 1
            ? this.options.length - 1
            : this.chosen + 1;
        this.updateDisplay();
        return null;
      case this.keys.KEY_RETURN:
      case this.keys.KEY_ENTER:
        this.write(this.ansi.eraseDown);
        process.stdin.removeAllListeners('data');
        this.addEscapeListener();
        return this.options[this.chosen];
      default:
        return null;
    }
  }
}

export default ListSelect;
