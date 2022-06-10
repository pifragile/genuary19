
let is;
let cs = 2000;


function setSeeds(hash) {
    num = hash.split("").reduce((acc, cur) => acc * cur.charCodeAt(0), 1);
    num = num / 10 ** 90;
    randomSeed(num);
    noiseSeed(num);
}


function setup() {
    setSeeds(fxhash);
    let is = min(windowHeight, windowWidth);
    createCanvas(is, is);
    pg = createGraphics(cs, cs);
    pg.pixelDensity(2);
    pg.colorMode(HSB);
    frameRate(1);
}

function setImage() {
    clear();
    let is = min(windowHeight, windowWidth);
    resizeCanvas(is, is);
    img = pg.get();
    image(img, 0, 0, is, is);
}

function draw() {
    pg.fill(0)
    pg.circle(random(cs), random(cs), random(cs * 0.5))
    setImage()
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        save(`${inputHash}.png`);
    }
}