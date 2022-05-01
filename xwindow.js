const readline = require('readline');
	readline.emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);

const grabMouse = () => { process.stdout.write('\033[?1000h'); }
const releaseMouse = () => { process.stdout.write('\033[?1000l'); }
	
// variables for grabbing mouse events
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

function key_event(LATCHING_EVENT, key) {
	LATCHING_EVENT({
		'event':'keypress',
		'ctrl':key.ctrl,
		'name':key.name,
		'meta':key.meta,
		'shift':key.shift,
		'key':key.sequence
	});
	return;
}

module.exports = { getEvents }
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
