<div align="center">
<img src="https://bit.ly/2CmaW7u" width="100" height="auto"  />
<br>
Wizard
<br>
<img src="https://media.giphy.com/media/cYeQv0qqTYvB7NvAvA/giphy.gif" />
<br>
The fastest way to build CLI setup wizards.
</div>
<br>

## Installation

`npm install wizard`

```javascript
import Wizard from '../../lib';

import questions from './questions';

const wizard = new Wizard(questions);
wizard.init();
```

## Api


#### `Wizard(questions, [styles, components])`

##### `Wizard` represents a new setup wizard.

- **questions** (Object - see *Questions object*) containing the complete specification of your setup wizard.
- **styles** (Object **optional** - see *Styles object*) containing style options for your wizard.
- **components** (Object **optional** - see *Custom Components*) containing custom input components.

#### `wizard.init()`

##### `init` initializes your setup wizard.

---

### Questions Object
The *Questions Object* represents every step of your setup wizard. It is an infinitely nested object representing the flow of choices from the first question, to the last.

Every `section` of the *Questions Object* must have the following fields:
- **question** (string) Your question
- **id** (string) The variable name that the answer will be stored under.
- **type** (string) The type of input asociated with this question (See *Input types*).

Depending on the input type, you may be required to have:
- **options** (Array of `option`) All options for a question (List & ListToggle inputs).
  - **option** - (Object) Represents one choice
    - **name** (string) Your choice.
    - **value** (string | bool) The value your variable is asigned if chosen.
    - **then** (string **optional**) Which question the user is directed to next.
- **then** (string) The next question (not used with input type List & ListToggle).

Example:

```
question: 'My question'
id: 'my-question',
type: 'list',
options: [
  { name: 'Answer 1', value: 'answer-1', then: 'question2' },
  { name: 'Answer 2', value: 'answer-2', then: 'question3' },
],
then: {
  question2: {
    question: 'Question 2',
    id: 'question-2',
    type: 'text',
  },
  question3: {
    question: 'Question 3',
    id: 'question-3',
    type: 'list',
    options: [
      { name: 'Answer 1, value: 'answer-1' },
      { name: 'Answer 2, value: 'answer-2' },
      { name: 'Answer 3, value: 'answer-3' },
      { name: 'Answer 4, value: 'answer-4' },
    ]
  }
}
```

### Styles Object

The styles object is passed in on the creation of the wizard. There are defaults that will be overridden.

```
{
  caret : {
    icon: string - The character representing the caret
    color: function - The color of the caret
    paddingRight: int - Right padding for the caret
    paddingLeft: int - Left padding for the caret
  },
  list: {
    wrapToTop: bool - Whether the caret wraps to top
    defaultColor: function - The color of non-selected items
    selectedColor: function - The color of currently selected item
    toggledColor: function - The color of toggled items
    preserveAnswer: bool - Whether the previous questions and answers are printed
    paddingLeft: int - Left padding for the whole list
    toggle: {
      icon: string - The character representing selected items
      color: function - The color of the selected item icon
      paddingRight: int - Right padding for the selected icon
      paddingLeft: int - Left padding for the selected icon
    }
  }
}
```

### Input Types
Right now Wizard includes the following input types:

#### `List` - A list of choices, select one with `Enter`
- **Needs:**
  - options (Array of Options)
- Use it by selecting `list` in your questions object: `type: 'list'`

#### `ListToggle` - A list of choices, select multiple with `Space`
- **Needs:**
  - options (Array of Options)
- Use it by selecting `listToggle` in your questions object: `type: 'listToggle'`

### Custom Components

You can make your very own personalized inputs if you can't achieve what you wish through styling. A `Component` class is made available through: `import { Component } from 'wizard` that allows you to create and use your own inputs.

Each Input must have an `init` method.
- **init** A method that starts your input - This must be a promise!

To create a basic component:

```
import { Component } from 'wizard';

class MyComponent extends Component {
  init() {
    return new Promise(resolve => {
      this.write('Welcome to my component!');
      this.newline();

      process.stdin.on('data', key => {
        const value = this.handleInput(key);
        if (value !== null) {
          resolve(value);
        }
      });
    });
  }
  
  handleInput(key) {
    switch(key) {
      this.keys.KEY_SPACE:
        this.write(this.colors.red('Space pressed'));
	this.newline();
	return 'some value';
      default:
        return null;
    }
  }
}
```

Now import it and use it:

```
import Wizard from 'wizard';
import MyComponent from './MyComponent';

const question = {
  question: 'Press space: ',
  id: 'space',
  type: 'myComponent',
};

const wizard = new Wizard(question, {}, { myComponent: MyComponent });
wizard.init();
```

For coloring, we make the `chalk` library useful by way of `this.color`. Check out the library here: https://github.com/chalk/chalk
