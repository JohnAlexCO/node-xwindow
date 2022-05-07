const xwin = require('./xwindow.js');
const fs = require('fs');

if(	process.argv[0] == '/usr/local/bin/node' ||
  	process.argv[0] == '/usr/bin/node') {
	process.argv = process.argv.slice(1)
}

const filename = process.argv[1]
if (filename === undefined) {
	console.log("ERROR: REQUIRES A FILENAME ENTRY")
	process.exit(1)
}

const raw_content = fs.readFileSync(
	filename,
	{encoding:'utf8', flag:'r'}
);

const status = {
	top: 0,
	cx: 0,
	cy: 0,
	lines: raw_content.split('\n'),
	saved: true
};
for (let i in status.lines) {
	status.lines[i] = status.lines[i].replaceAll('\t','    ')
}

const spaces = (n) => {
	var result =''; var i=0;
	while(i<n){
		i++; result+=' ';	
	}
	return result;
}
function header() {
	xwin.setCursor(0,0);
	xwin.clear()
	
	var heading = (
		xwin.color('blue', background=true)+
		'Text Editor - '+filename+
		spaces(120)
	);
	console.log(heading);
	xwin.reset();
	// then clear the first line
	xwin.setCursor(0,2);
	process.stdout.write(
		spaces(80)
	);
	xwin.setCursor(0,2);
}

const VSIZE = 40
const COL = 6
const SCROLLSPEED = 4
function fill() {
	for(let i=0; i<VSIZE; i++) {
		if(i<status.lines.length){
			xwin.setCursor(1,i+2);
			console.log(i+status.top)

			xwin.setCursor(1+COL,i+2);
			if(!(status.lines[i+status.top] === undefined))
			{ console.log( status.lines[i+status.top] ) }
		}
	}
}

function Update() {
	header()
	fill()
	xwin.setCursor(
		status.cx+COL,
		status.cy+2
	);
}

function cursorUpdate(){
	if(status.cy < 0) {
		while(status.top > 0){status.top--;}
		status.cy++;
	}
	if(status.top < 0) { status.top = 0 }
	if(status.top+status.cy > status.lines.length) { status.top = status.lines.length-VSIZE }
	if(status.cx < 1) { status.cx = 0 }
	
	if(status.cy == VSIZE) {
		status.top++; 
		status.cy = VSIZE-1;	
	}
	
	if(status.lines.length < VSIZE) {
		status.top = 0;	
		if(status.cy > status.lines.length) {status.cy = status.lines.length-1};
	}
	
	try{ if(status.cx > status.lines[status.cy+status.top].length) {
		status.cx = status.lines[status.cy+status.top].length
	} }
	catch(err){}
}

function Loop(event) {
	if(event.event=='keypress'){
	switch(event.name){
		case 'up':
			status.cy--;
			cursorUpdate()
			break;
			
		case 'down':
			status.cy++;
			cursorUpdate()
			break;
			
		case 'left':
			if(status.cx >= 1) { status.cx--}
			break;
			
		case 'right':
			status.cx++;
			cursorUpdate()
			break;
			
		case 'backspace':
			// destroy line and move up
			if(status.cx<=1) {
				if(status.cy+status.top > 0){
				var t = status.top+status.cy
				var l = status.lines[t]
				var p = status.top+status.cy-1
				
				status.cx = status.lines[p].length;
				status.lines.splice(t, 1);
				status.lines[p] += l;
				status.cy--;
			} else {
				status.lines[0] = status.lines[0].slice(1)	
			}}
			else {
				var p = status.top+status.cy
				var l = status.lines[p]
				var f = l.substr(0, status.cx-1)
				var s = l.substr(status.cx, l.length);
				status.lines[status.top+status.cy] = f+s
				if(status.cx >= 1) { status.cx--}
			}
			break;
			
		case 'return':
			var p = status.top+status.cy
			var l = status.lines[p]
			var f = l.substr(0,status.cx)
			var s = l.substr(status.cx, l.length)
			status.lines[p] = f
			// https://howtocreateapps.com/ways-to-insert-elements-to-an-array-in-javascript/
			status.lines.splice(
				p+1, 0, // at p, delete none
				s
			)
			status.cx = 0
			status.cy++;
			break;
			
		case 'tab':
			var p = status.top+status.cy
			var l = status.lines[p]
			var f = l.slice(0, status.cx)
			var s = l.slice(status.cx, l.length)
			status.lines[p] = f +'    '+s
			status.cx+=4;
			
		default:
			if(event.key.length==1) {
				var p = status.top+status.cy
				var l = status.lines[p]
				var f = l.slice(0, status.cx)
				var s = l.slice(status.cx, l.length)
				status.lines[p] = (
					f+ event.key +s	
				)
				status.cx++;
			}
			break;
	}}
	
	if (event.event == 'mouse') {
		switch(event.button) {
			case 'Scroll-Up':
				for(let i=0;i<SCROLLSPEED;i++){
				status.top--;
				}
				break;	
		
			case 'Scroll-Down':
				for(let i=0;i<SCROLLSPEED;i++){
				if(status.top+VSIZE<status.lines.length){
					status.top++;
				}}
				break;
				
			default:
				status.cx = event.x -COL
				status.cy = event.y -1
		}
		cursorUpdate()
	}
	Update()
}

Update()
xwin.getEvents(Loop);




