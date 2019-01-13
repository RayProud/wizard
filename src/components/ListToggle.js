import Component from './Component';

class ListToggle extends Component {
  constructor(question, styles) {
    super();

    this.styles = styles;
    this.question = question.question;
    this.options = question.options;

    this.selected = new Array(this.options.length);
    this.chosen = 0;
  }

  init() {
    return new Promise(resolve => {
      this.write(this.styles.question.color(this.question));
      this.newline();

      this.handleOnData = this.handleOnData.bind(this, resolve);

      process.stdin.on('data', this.handleOnData);

      this.updateDisplay();
    });
  }

  handleOnData(resolve, key) {
    const value = this.handleInput(key);

    if (value !== null) {
      process.stdin.removeListener('data', this.handleOnData);
      this.handleOnData = null;
      resolve(value);
    }
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
                this.styles.caret.paddingLeft + this.styles.caret.paddingLeft,
                ' '.repeat(this.styles.caret.paddingLeft),
              ),
            ) +
              ' '.repeat(this.styles.caret.paddingRight) +
              this.styles.list.selectedColor(option.name),
          );
        } else {
          this.write(this.styles.list.selectedColor(formatted));
        }
      } else if (this.selected[index]) {
        if (this.styles.list.toggle.icon) {
          this.write(
            this.styles.list.toggle.color(
              this.styles.list.toggle.icon.padStart(
                this.styles.list.toggle.paddingLeft + 1,
                ' '.repeat(this.styles.list.toggle.paddingLeft),
              ),
            ) +
              ' '.repeat(this.styles.list.toggle.paddingRight) +
              this.styles.list.toggledColor(option.name),
          );
        } else {
          this.write(this.styles.list.toggledColor(formatted));
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
      case this.keys.KEY_SPACE:
        this.selected[this.chosen] = this.selected[this.chosen]
          ? null
          : this.options[this.chosen].value;
        return null;
      case this.keys.KEY_RETURN:
      case this.keys.KEY_ENTER:
        this.write(this.ansi.eraseDown);

        return {
          value: this.selected.filter(Boolean),
          then: this.options[0].then,
        };
      default:
        return null;
    }
  }
}

export default ListToggle;
