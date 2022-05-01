module.exports = {
	getEvents,
	getCursor,
	setCursor,
	clear,
	color,
	reset
}

const readline = require('readline');
	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);

const grabMouse = () => { escape('?1000h'); }
const releaseMouse = () => { escape('?1000l'); }

var moused = false;
var mouse_codes = [];
const mousecodes = {' ':'Left', '!':'Middle', '"':'Right', '`':'Scroll-Up','a':'Scroll-Down'}

function mouse_event(LATCHING_EVENT) {
	var b = mousecodes[ mouse_codes[1] ]
	var x = ( mouse_codes[2] ).charCodeAt(0)-33;
	var y = ( mouse_codes[3] ).charCodeAt(0)-33;
	mouse_codes = [];
	moused = false;
	
	if (b===undefined) {
		LATCHING_EVENT({
			'event':'mouse',
			'button':'Multiple',
			'x':x,
			'y':y
		});	
	}
	else {
		LATCHING_EVENT({
			'event':'mouse',
			'button':b,
			'x':x,
			'y':y
		});
	}
};

function getCursor() { 
	escape('6n');
	return Cursor;
} const Cursor = {'x':0, 'y':0 }

function key_event(LATCHING_EVENT, key) {
	LATCHING_EVENT({
		'event':'keypress',
		'ctrl':key.ctrl,
		'name':key.name,
		'shift':key.shift,
		'key':key.sequence
	});
	return;
}

function getEvents( LATCHING_EVENT ) {
	grabMouse();
	process.stdin.on('keypress', (charater, key) => {
		// mouse events
		if (key.code == '[M' || moused == true) { 
			moused = true
			if ( mouse_codes.length < 7 ) { mouse_codes.push( key.sequence )	}
			else { mouse_event(LATCHING_EVENT); }
			return;
		}
		
		// getCursor
		if ((key.sequence).startsWith('\x1B[')) {
			var y = key.sequence.split(';')[0];
			var x = key.sequence.split(';')[1];
			y = parseInt( y.split('[')[1] ) // remove the junk before '['
			x = parseInt( x.slice(0, x.length-1) ) // remove the 'R'
			Cursor.y = y;
			Cursor.x = x;
			console.log(Cursor);
			return;
		}

		// ctrl codes
		if (key.ctrl == true) {
			if (key.name == 'c' |
			   key.name == 'd') {
				releaseMouse();
				process.exit(0);
			}
		}

		// other keys
		key_event(LATCHING_EVENT, key);
	})
}

function escape() {
	var result = '\033[';
	for (let i in arguments) {
		result += arguments[i]
		if (i != arguments.length-1) {
			result += ';'
		}
	}
	process.stdout.write(result)
}

function setCursor(x,y) { 
	escape(y, x+'H')
	Cursor.x = x;
	Cursor.y = y;
}	

function clear() {
	cursor(0,0)
	escape('J')
}

function reset(){ escape('0m') }

function color(name, background=false){
	const code = {
		'black': 30,
		'red': 31,
		'green': 32,
		'yellow': 33,
		'blue': 34,
		'magenta': 35,
		'cyan': 36,
		'white': 37,
		'default': 39,
		undefined: 39
	}
	var c = code[name]
	if (background == true) { c+=10 }
	escape(c+'m')
}
