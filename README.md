# node-xwindow
A simple import that allows listening to key and mouse events from the Node.js (X11 only) terminal,
and has additional printing features

### Getting Started
1. Save `xwindow.js` to your project's working directory
2. Require it &ndash; `const xwin = require('./xwindow.js');`
3. Pass your input binding function into `xwin.getEvents()`

An example:
```javascript
function capture_event(data_object) {
    console.log(data_object);
} capture.getEvents(capture_event);
```
prints to the terminal after clicking, scrolling, and pressing A:
```javascript
{ event: 'mouse', button: 'Left', x: 64, y: 18 }
{ event: 'mouse', button: 'Scroll-Up', x: 64, y: 18 }
{ event: 'mouse', button: 'Scroll-Up', x: 64, y: 18 }
{ event: 'keypress', ctrl: false, name: 'a', shift: false, key: 'a' }
```

### What All Can This Little Library Do?
**getEvents** &ndash; listens for keypress and mouse events and transmits them to a given function
- Any mouse events will return an object with attributes `event`, `button`, `x`, and `y`.<br>
- Any keyboard events will return an object with attributes `event`, `ctrl` (boolean), `name`, `shift` (boolean), and `key`

**clear** &ndash; clears the terminal and resets the cursor

**getCursor** &nash; returns an object containing the x and y coordinates of the terminal's print cursor

**setCursor** &ndash; sets the terminal's cursor to the given position
- setCursor expects two integer arguments: the `x` and `y` coordinates 

**color** &ndash; takes in a color name and returns the printable escape sequence
- color takes one or two arguments; the string to be printed, and an optional `bool` that tells color to change the background color instead
- this is used directly within the print call, for example: 
```javascript
console.log( xwin.color('red')+ "Hello, World!"); 
xwin.reset();`
```

**reset** &ndash; resets the terminal color and display settings

### Example Uses
- [A replacement for Inquirer, Prompts, et cetera](./prompts.js)
- Simple Terminal-based Games like Rogue
- Text editors like Vim
