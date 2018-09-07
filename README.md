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

##### Step 1

Define your wizard steps:

```
question: 'Question 1',
id: 'question1',
options: [
  { name: 'Option 1', value: 'option1', then: 'question2' },
  { name: 'Option 2', value: 'option2', then: 'question3' },
],
next: {
  question2: {
    question: 'Question 2',
	 id: 'question2',
	 options: [
	   { name: 'Option 3', value: 'option1' },
	   { name: 'Option 4', value: 'option2' },
	 ],
  },
  question3: {
    question: 'Question 3',
    id: 'question3',
    options: [
      { name: 'Option 5', value: 'option5' },
      { name: 'Option 6' value: 'option6' },
    ],
  }
}
```
