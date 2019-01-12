import Component from './Component';

import list from './List';
import listToggle from './ListToggle';

class Wizard extends Component {
  constructor(steps, styles, components) {
    super();

    this.components = {
      list,
      listToggle,
      ...components,
    };

    const styleDefaults = {
      caret: {
        icon: '❯',
        color: this.colors.white,
        paddingRight: 1,
        paddingLeft: 0,
      },
      list: {
        wrapToTop: false,
        defaultColor: this.colors.gray,
        selectedColor: this.colors.white,
        toggledColor: this.colors.red,
        preserveAnswer: true,
        paddingLeft: 2,
        toggle: {
          icon: '*',
          color: this.colors.red,
          paddingRight: 1,
          paddingLeft: 0,
        },
      },
      question: { color: this.colors.white, prefix: '', paddingLeft: 0 },
    };

    this.styles = {
      ...styleDefaults,
      ...styles,
    };

    this.steps = steps;
    this.selections = {};
  }

  init() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    this.write(this.ansi.cursorHide);

    this.handleEscape();

    return this.traverse(this.steps);
  }

  traverse(section) {
    return new Promise(async (resolve, reject) => {
      if (!this.validateSection(section)) {
        this.write('Error in Configuration');
        this.cleanAndExit();
      }

      const ComponentType = this.components[section.type];

      if (ComponentType) {
        const component = new ComponentType(section, this.styles);
        const response = await component.init();
        this.selections[section.id] = response.value;

        if (!response.then) {
          this.write(this.ansi.cursorShow);
          resolve(this.selections);
          return null;
        }

        if (!section.then) {
          this.write(this.ansi.cursorShow);
          reject(`Section '${section.id}' doesn't have 'then' property`);
          return null;
        }

        if (section.then && section.then[response.then]) {
          resolve(await this.traverse(section.then[response.then]));
          return null;
        }

        this.write(this.ansi.cursorShow);
        reject('Unknown error');
        return null;
      }

      this.write(this.ansi.cursorShow);
      reject(
        `Type ${
          section.type
        } isn't implemented yet. You can write your own custom components.\n`,
      );
      return null;
    }).catch(e => {
      console.error(this.colors.red(e));
      this.cleanAndExit();
    });
  }

  validateSection(section) {
    return (
      (section.question || section.options || section.id || section.type) &&
      true
    );
  }
}

export default Wizard;
