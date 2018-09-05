import Component from './Component';

import listSelect from './ListSelect';
import listToggle from './ListToggle';

class Wizard extends Component {
  constructor(steps, components) {
    super();

    this.compoents = {
      listSelect,
      listToggle,
      ...components,
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
  }

  async traverse(section) {
    if (!this.validateSection(section)) {
      process.stdout.write('Error in Configuration\n');
      this.write('Error in Configuration');
      this.cleanAndExit();
    }

    const ComponentType = this.components[section.type];
    if (ComponentType) {
      const component = new ComponentType(section, this.styles);

      const response = await component.init();
      this.selections[section.id] = response.value;
      this.write(JSON.stringify(this.selections));

      if (!response.then) {
        this.cleanAndExit();
        return null;
      }
      if (section.next[response.then]) {
        return this.traverse(section.next[response.then]);
      }

      this.write('Error in Configuration');
      this.cleanAndExit();
      return null;
    }

    return null;
  }

  static validateSection(section) {
    return (
      (section.question || section.options || section.id || section.type) &&
      true
    );
  }
}

export default Wizard;
