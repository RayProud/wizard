// TODO - Add tests

import Component from './Component';

import list from './List';
import listToggle from './ListToggle';
import text from './Text';

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
      text,
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
          new Error(`Invalid configuration - There is an error in your config`),
        );
      }

      const ComponentType = this.components[section.type];
      if (ComponentType) {
        try {
          const component = new ComponentType(section, this.styles);
          const response = await component.init();
          this.selections[section.id] = response.value;

          if (
            (section.then && section.then[response.then]) ||
            (section.type === 'text' && section.then)
          ) {
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
                `Invalid configuration - Could not find key 'then' in section '${
                  section.id
                }`,
              ),
            );
            return null;
          }

          if (!section.then[response.then]) {
            this.write(this.ansi.cursorShow);
            reject(
              new Error(
                `Invalid configuration — Could not find key '${
                  response.then
                }' in 'then' of section '${section.id}'`,
              ),
            );
            return null;
          }
        } catch (err) {
          reject(err);
        }

        this.write(this.ansi.cursorShow);
        reject(new Error('An unknown error occured'));
        return null;
      }
      this.write(this.ansi.cursorShow);
      reject(
        new Error(
          `Invalid configuration - Unknown component type '${
            section.type
          }' referenced`,
        ),
      );
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
