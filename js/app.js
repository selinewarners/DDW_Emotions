let data;
let windowW = window.innerWidth;
let windowH = window.innerHeight;

function setup(){
    pixelDensity(1);
    let canvas = createCanvas(windowW, windowH, P2D);
    canvas.id("p5canvas");

    //Create data element after creating the canvas
    //This is necessary because the canvas element is retrieved within the data class
    data = new Data();
}

function draw(){
    data.update();
    background(0);
    image(data.output.video, 0, 0); //This has no purpose in the data collection- so this could be turned off

    if(data.output.expressions){
        let count = 0;
        fill(255);
        textSize(32);
        
        console.log(data.output.expressions);
        for(let expression in data.output.expressions){ //loop through the data object
            count++;
            text(Object.keys(data.output.expressions)[count - 1], 50, windowH - (50 * count)); //write object key on the screen
        }
    }
}
