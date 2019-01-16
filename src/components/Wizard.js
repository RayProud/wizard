// TODO - Add tests

import Component from './Component';

import list from './List';
import listToggle from './ListToggle';

class Wizard extends Component {
  constructor(steps, styles, components) {
    super(styles);

    const styleDefaults = {
      preserveAnswer: true,
      question: {
        color: this.colors.white,
        prefix: '',
        paddingLeft: 0,
      },
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
        paddingLeft: 2,
        toggle: {
          icon: '*',
          color: this.colors.red,
          paddingRight: 1,
          paddingLeft: 0,
        },
      },
    };

    this.components = {
      list,
      listToggle,
      ...components,
    };

    this.styles = {
      ...styleDefaults,
      ...styles,
    };

    this.steps = steps;
    this.selections = {};
  }

  async init() {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    this.write(this.ansi.cursorHide);

    const selections = await this.traverse(this.steps);

    return selections;
  }

  traverse(section) {
    return new Promise(async (resolve, reject) => {
      if (!this.validateSection(section)) {
        reject(
          new Error(
            `Invalid configuration — check the docs to ensure the question was written by the rules`,
          ),
        );
      }

      const ComponentType = this.components[section.type];
      if (ComponentType) {
        try {
          const component = new ComponentType(section, this.styles);
          const response = await component.init();
          this.selections[section.id] = response.value;

          if (section.then && section.then[response.then]) {
            try {
              const data = await this.traverse(section.then[response.then]);
              resolve(data);
            } catch (err) {
              reject(err);
            }

            return null;
          }
          if (!response.then) {
            this.write(this.ansi.cursorShow);
            resolve(this.selections);
            return null;
          }
          if (!section.then) {
            this.write(this.ansi.cursorShow);
            reject(
              new Error(
                `Invalid configuration — couldn't find 'then' key in '${
                  section.id
                }' section`,
              ),
            );
            return null;
          }

          if (!section.then[response.then]) {
            this.write(this.ansi.cursorShow);
            reject(
              new Error(
                `Invalid configuration — couldn't find key '${
                  response.then
                }' in 'then' of '${section.id}' section`,
              ),
            );
            return null;
          }
        } catch (err) {
          reject(`A component error occured — ${err}`);
        }

        this.write(this.ansi.cursorShow);
        reject(new Error('An unknown error occured'));
        return null;
      }
      this.write(this.ansi.cursorShow);
      reject(new Error('Invalid configuration'));
      return null;
    })
      .then(results => {
        process.stdin.pause();

        return results;
      })
      .catch(err => {
        this.write(this.colors.red(err));
        this.cleanAndExit();
        return null;
      });
  }

  validateSection(section) {
    return section.question && section.id && section.type && true;
  }
}

export default Wizard;
