import Component from './Component';

class List extends Component {
  constructor(question, styles) {
    super();

    this.styles = styles;
    this.question = question.question;
    this.options = question.options;

    this.chosen = 0;
  }

  init() {
    return new Promise(resolve => {
      this.write(this.styles.question.color(this.question));
      this.newline();

      process.stdin.on('data', key => {
        const value = this.handleInput(key);
        if (value !== null) {
          resolve(value);
        }
      });

      this.updateDisplay();
    });
  }

  updateDisplay() {
    this.options.forEach((option, index) => {
      let formatted = option.name;
      formatted = formatted.padStart(
        formatted.length + this.styles.list.paddingLeft,
        ' '.repeat(this.styles.list.paddingLeft),
      );

      if (index === this.chosen) {
        if (this.styles.caret.icon) {
          this.write(
            this.styles.caret.color(
              this.styles.caret.icon.padStart(
                this.styles.caret.paddingLeft + 1,
                ' '.repeat(this.styles.caret.paddingLeft),
              ),
            ) +
              ' '.repeat(this.styles.caret.paddingRight) +
              this.styles.list.selectedColor(option.name),
          );
        } else {
          this.write(this.styles.list.selectedColor(formatted));
        }
      } else {
        this.write(this.styles.list.defaultColor(formatted));
      }

      this.newline();
    });

    this.write(this.ansi.cursorUp(this.options.length));
  }

  handleInput(key) {
    switch (key) {
      case this.keys.KEY_UP:
        this.chosen =
          this.chosen === 0
            ? this.styles.list.wrapToTop
              ? this.options.length - 1
              : 0
            : this.chosen - 1;
        this.updateDisplay();
        return null;
      case this.keys.KEY_DOWN:
        this.chosen =
          this.chosen === this.options.length - 1
            ? this.styles.list.wrapToTop
              ? 0
              : this.options.length - 1
            : this.chosen + 1;
        this.updateDisplay();
        return null;
      case this.keys.KEY_RETURN:
      case this.keys.KEY_ENTER:
        this.write(this.ansi.eraseDown);
        process.stdin.removeAllListeners('data');
        this.handleEscape();
        return this.options[this.chosen];
      default:
        return null;
    }
  }
}

export default List;
