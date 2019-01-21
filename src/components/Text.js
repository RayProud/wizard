import Component from './Component';

const ESC_UTF16_CODE = 127;
const ARROWS_UTF16_CODE = 27;

class Text extends Component {
  constructor(question, styles) {
    super();

    this.styles = styles;
    this.question = question.question;
    this.answer = '';
  }

  handleKeyPress(key) {
    if (key.charCodeAt(0) === ESC_UTF16_CODE) {
      this.answer = this.answer.slice(0, this.answer.length - 1);
    } else if (key.charCodeAt(0) === ARROWS_UTF16_CODE) {
      // we don't need answers like '\u001b[A'
      return;
    } else {
      if (key === '\t') {
        key = ' ';
      }

      this.answer += key.toString();
    }

    this.update();
  }

  update() {
    this.write(this.ansi.eraseLine);
    this.write(
      this.styles.caret.color(
        this.styles.caret.icon.padStart(
          this.styles.caret.paddingLeft + 1,
          ' '.repeat(this.styles.caret.paddingLeft),
        ),
      ) +
        ' '.repeat(this.styles.caret.paddingRight) +
        this.styles.list.selectedColor(this.answer),
    );
  }

  init() {
    return new Promise(async resolve => {
      this._handleKeyPress = this.handleKeyPress.bind(this);

      this.onKeyEnter = () => {
        process.stdin.removeListener('data', this._handleKeyPress);
        this.clear();
        resolve({
          value: this.answer,
        });
      };

      this.initialize(this.question);
      this.write(this.ansi.cursorShow);
      this.write(this.ansi.cursorTo(this.styles.caret.paddingLeft + 2));
      process.stdin.addListener('data', this._handleKeyPress);
    });
  }
}

export default Text;
