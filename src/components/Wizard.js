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

    this.traverse(this.steps);
  }

  async traverse(section) {
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
        this.cleanAndExit();
        return null;
      }
      if (section.next[response.then]) {
        return this.traverse(section.next[response.then]);
      }

      this.newline();
      this.write('Error in configuration');
      this.cleanAndExit();
      return null;
    }

    this.newline();
    this.write('Error importing component');
    this.cleanAndExit();
    return null;
  }

  validateSection(section) {
    return (
      (section.question || section.options || section.id || section.type) &&
      true
    );
  }
}

export default Wizard;
