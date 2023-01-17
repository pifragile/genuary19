let pg;
let canvas;
var fps;

let is;
let cs = 2000;

let pixelWidth = 32;
let pixelFactor = 4;
let gridX = 4;
let gridY = 4;
let border = 100;
let tileWidth;
let tileHeight;

let cells = [];
let tiles = [];
const patterns = [
		// ⬜️
		[
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0],
		],
		//+
		[
			[0,0,0,0,0,0,0,0],
			[0,0,0,1,1,0,0,0],
			[0,0,0,1,1,0,0,0],
			[0,1,1,1,1,1,1,0],
			[0,1,1,1,1,1,1,0],
			[0,0,0,1,1,0,0,0],
			[0,0,0,1,1,0,0,0],
			[0,0,0,0,0,0,0,0],
		],
		//🔳
		[
			[1,1,1,1,1,1,1,1],
			[1,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1],
		],
		//|
		[
			[0,0,0,1,1,0,0,0],
			[1,0,0,1,1,0,0,1],
			[1,0,0,1,1,0,0,1],
			[0,0,0,1,1,0,0,0],
			[0,0,0,1,1,0,0,0],
			[1,0,0,1,1,0,0,1],
			[1,0,0,1,1,0,0,1],
			[0,0,0,1,1,0,0,0],
		],
		//⬛️
		[
			[1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1],
			[1,1,1,1,1,1,1,1],
		],

		//×
		[
			[1,0,0,0,0,0,0,1],
			[0,1,0,0,0,0,1,0],
			[0,0,1,0,0,1,0,0],
			[0,0,0,1,1,0,0,0],
			[0,0,0,1,1,0,0,0],
			[0,0,1,0,0,1,0,0],
			[0,1,0,0,0,0,1,0],
			[1,0,0,0,0,0,0,1],
		],
	];


function setSeeds(hash) {
    num = hash.split("").reduce((acc, cur) => acc * cur.charCodeAt(0), 1);
    num = num / 10 ** 90;
    randomSeed(num);
    noiseSeed(num);
    
}

/* * * * * * */

function setup() {
    setSeeds(fxhash);
    //let is = min(windowHeight, windowWidth);
    canvas = createCanvas(pixelWidth*pixelFactor, pixelWidth*pixelFactor, WEBGL);
    canvas.position(0,0);
	imageMode(CENTER);

    tileWidth = pixelWidth / gridX;
    tileHeight = pixelWidth / gridY;
    pg = createGraphics(pixelWidth*pixelFactor, pixelWidth*pixelFactor, WEBGL);

    canvas.imageSmoothingEnabled = false;
    this._renderer.getTexture(pg).setInterpolation(NEAREST, NEAREST);
    pg.pixelDensity(1);
    pixelDensity(1);
    pg.noSmooth();
    pg.ellipseMode(CORNER);

    canvas = document.getElementById("defaultCanvas0");
    canvas.style.width = 32*32+"px"; 
    canvas.style.height = 32*32+"px"; 
    canvas.style.imageRendering = "crisp-edges";

    for(let i = 0; i<gridX*gridY; i++) {
		cells[i] = new Cell(i, int(i%gridX),int(i/gridX));
    }
    
    textSize(20);

    pg.translate(-pg.width/2, -pg.height/2);
    pg.rectMode(CORNER);
    pg.background(0);
    
    pg.noStroke();
    for(let y = 0; y<32; y++) {
    	for(let x = 0; x<32; x++) {
    		pg.fill(int(random(255)));
    		pg.rect(x, y, 1, 1);
    	}
	}

	fps = createDiv("test", 10, 10);
    fps.position(10, innerHeight-50);
    fps.style("color", "#FFFFFF");

    console.log("setup done");
    requestAnimationFrame(updateCells);
}

// updateCells runs on a thread / web worker
// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
function updateCells() {
	for(let i = 0; i<cells.length; i++) {
		cells[i].update();
    }
  requestAnimationFrame(updateCells);
}

function setImage() {
    clear();
    let is = min(windowHeight, windowWidth);
    resizeCanvas(is, is);
    img = pg.get();
    image(img, 0, 0, is, is);
}

function draw() {
	//console.log("1");
	// stateMachine
	//pg.background(0,0,255);
    //pg.fill(0)
    //pg.circle(random(cs), random(cs), random(cs * 0.5))
    //setImage();
    background(0,0,255);
    fill(255);
    pg.clear();

    for(let i = 0; i<cells.length; i++) {
    	cells[i].setTarget(int(random(0,patterns.length)));
		cells[i].display();
    }
    image(pg, 0, 0);
    debug();
    // noLoop();
}

function windowResized() {
  //resizeCanvas(windowWidth, windowHeight);
  //tileWidth = windowWidth / gridX;
  //tileHeight = windowHeight / gridY;
}

function debug() {
	push();
    fill(255,0,0);
    fps.html("FPS" + int(frameRate()) + " | CELLS:" + cells.length + " | TILES: 0");
    pop();
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        save(`${inputHash}.png`);
    } else if(key === " ") {
    	//flip();
    	saveGif('mySketch', 5);
    	console.log("saving");
    }
}

class Cell {
	constructor(id, x, y) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.tileSize = pixelWidth/gridX;
		this.busy = false;
		this.bg = int(random(70,255));
		this.memory = [];
		this.target = [];
		this.tiles = [];
		this.currentPattern = int(random(0,patterns.length));

		this.moveX = 8;
		this.moveY = 0;
		this.dir = int(random(0,2));

		this.isReady = true;

		// delta timer
		this.timestamp = 0;
		this.interval = int(random(70, 500));

		// initial pattern into memory
		let c = 0;
		for(let i = 0; i<this.tileSize; i++) {
			this.memory[i] = [];
			this.target[i] = [];
			for(let j = 0; j<this.tileSize; j++) {
				this.memory[i][j] = patterns[this.currentPattern][i][j];
				this.target[i][j] = patterns[this.currentPattern][i][j];
				this.tiles[c] = new Tile(i, j, this.tileSize, this.x, this.y);
				c++;		
			}
		}

		
	}

	update() {
		if(this.busy) {
			for(let i = 0; i<this.tileSize*this.tileSize; i++) {
				this.tiles[i].update();
			}
		}

		// check if memory is equal to target, meaning: we are done animating
		// if(this.memory === this.target) {
		if(this.memory.toString() === this.target.toString()) {
		// if(JSON.stringify(this.target) === JSON.stringify(this.memory)) {
			// console.log(this.id + " is cool");
			this.busy = false;
			// this.isReady = true;
		} else {
			// console.log("updating cell: " + this.id);
			if(millis() - this.timestamp > this.interval) {
				this.timestamp = millis();
				
				this.dir = 1;
				switch(this.dir) {
					case 0: // move everything in memory to the right
						for(let x = this.tileSize; x>=this.moveX; x--) {
							for(let y = 0; y<this.tileSize; y++) {
								this.memory[y][x] = this.memory[y][x-1];
							}
						}
						this.moveX++;
						for(let x = 0; x<this.moveX; x++) {
							for(let y = 0; y<this.tileSize; y++) {
								this.memory[y][x] = this.target[y][x];
							}	
						}
						
						if(this.moveX > this.tileSize) {
							this.moveX = 0;
							this.isReady = true;
						}
					break;

					case 1: // move everything in memory to the left
						for(let x = 0; x<this.moveX; x++) {
							for(let y = 0; y<this.tileSize; y++) {
								this.memory[y][x] = this.memory[y][x+1];
							}
						}
						this.moveX--;
						for(let x = this.tileSize; x>=this.moveX; x--) {
							for(let y = 0; y<this.tileSize; y++) {
								this.memory[y][x] = this.target[y][x];
							}	
						}
						
						if(this.moveX < 0) {
							this.moveX = 8;
							this.isReady = true;
						}
					break;
				}
				// update tiles
				for(let i = 0; i<this.tiles.length; i++) {
					this.tiles[i].target(this.memory[int(i%this.tileSize)][int(i/this.tileSize)]);
				}
			}

		}
	}

	display() {
		//pg.fill(this.bg); // old
		// pg.fill(255);

		// pg.rect((this.x*this.tileSize*pixelFactor), (this.y*this.tileSize*pixelFactor), this.tileSize*pixelFactor, this.tileSize*pixelFactor);
		let x = 0;
		let y = 0;

		for(let i = 0; i<this.tileSize*this.tileSize; i++) {
			x = int(i%this.tileSize);
			y = int(i/this.tileSize);
			pg.push();
			pg.noStroke();
			this.tiles[i].display();
			pg.pop();
		}
	}

	setTarget(patternNr) {
		if(this.isReady) {
			this.dir = int(random(0,2));
			this.interval = int(random(170, 500));
			this.isReady = false;
			this.busy = true;
			// console.log("input pattern: " + patternNr + " / current: " + this.currentPattern);
			this.currentPattern = patternNr;
			this.currentPattern %= patterns.length;
			// console.log("✨ setting new target for cell: " + this.id + " / pattern: " + this.currentPattern);
			for(let i = 0; i<this.tileSize; i++) {
				for(let j = 0; j<this.tileSize; j++) {
					this.target[i][j] = patterns[this.currentPattern][i][j];
				}
			}
				let r = int(random(0,10));
				// let r = 8;
				let t = int(random(60,100));
				for(let i = 0; i<this.tileSize*this.tileSize; i++) {
					this.tiles[i].setMode(r);
					this.tiles[i].setInterval(t);
				}
		}
	}
}

class Tile {
	constructor(x, y, tileSize, px, py) {
		this.x = x;
		this.y = y;
		this.tileSize = tileSize;
		this.px = px;
		this.py = py;

		this.tileWidth = tileWidth/this.tileSize;
		this.tileHeight = tileHeight/this.tileSize;

		this.timestamp = 0;
		this.interval = 30;
		this.state = 0;
		this.busy = false;
		this.counter = 0;
		this.mode = 0;
	}

	update() {
		if(this.busy) {
			if(millis() - this.timestamp > this.interval) {
				this.timestamp = millis();
				this.counter++;
				if(this.counter >= pixelFactor) {
					this.busy = false;
				}
			}
		}
	}

	display() {
		pg.push();
		pg.translate(this.px*this.tileSize*pixelFactor, this.py*this.tileSize*pixelFactor);
		pg.fill( (this.state == 0 ? 0:255) );

		pg.translate(this.x*pixelFactor, this.y*pixelFactor);

		// different modes of "expading" a tile into its grid space
		if(this.mode == 0) {
			pg.rect(0,0, pixelFactor, pixelFactor);
		} else if(this.mode == 1) {
			pg.rect(0,0, pixelFactor, this.counter);
		} else if(this.mode == 2) {
			pg.rect(0,0, this.counter, pixelFactor);
		} else if(this.mode == 3) {
			pg.rect(0,0, this.counter, this.counter);
		} else if(this.mode == 4) {
			pg.ellipse(0,0, pixelFactor, pixelFactor);
		} else if(this.mode == 5) {
			pg.ellipse(0,0, pixelFactor, this.counter);
		} else if(this.mode == 6) {
			pg.ellipse(0,0, this.counter, pixelFactor);
		} else if(this.mode == 7) {
			pg.ellipse(0,0, this.counter, this.counter);
		} else if(this.mode == 8) {
			pg.push();
			pg.stroke((this.state == 0 ? 0:255));
			pg.line(0,0,this.counter, this.counter);
			pg.pop();
		} else if(this.mode == 9) {
			pg.push();
			pg.fill(0);
			pg.rect(0,0,pixelFactor, pixelFactor);
			pg.pop();
		}

		pg.pop();
	}

	target(t) {
		if(!this.busy) {
			this.state = t;
			this.busy = true;
			this.counter = 0;
		}
	}

	setMode(m) {
		this.mode = m;
	}

	setInterval(t) {
		this.interval = t;
	}

}

