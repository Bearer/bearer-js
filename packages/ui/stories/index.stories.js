import { storiesOf } from '@storybook/html'

const kinds = ['default', 'action', 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark']
const sizes = ['default', 'medium', 'small', 'large']

storiesOf('Button', module)
  .add('colors', () => kinds.map(k => `<bearer-button kind="${k}">${k}</bearer-button>`).join(' '))
  .add('sizes', () => sizes.map(k => `<bearer-button size="${k}">${k}</bearer-button>`).join(''))
// .add('button', () => {
//   const button = document.createElement('bearer-button');
//   button.type = 'button';
//   button.innerText = 'Hello Buttosn';
//   button.addEventListener('click', e => console.log(e));
//   return button;
// });
