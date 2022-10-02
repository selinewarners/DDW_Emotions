let data;
let windowW = window.innerWidth;
let windowH = window.innerHeight;




// blob


// organic is used to store the list of instances of Organic objects that we will create
var organics = [];
// The variable change stores the rate of rotation and the y coordinate for noise later
var change, colorsPalette;



function Organic(radius,xpos,ypos,roughness,angle,color){

  this.radius = radius; //radius of blob
  this.xpos = xpos; //x position of blob
  this.ypos = ypos; // y position of blob
  this.roughness = roughness; // magnitude of how much the circle is distorted
  this.angle = angle; //how much to rotate the circle by
  this.color = color; // color of the blob

  this.show = function(change){

    noStroke(); // no stroke for the circle
     //strokeWeight(0.1); //We can use this to set thickness of the stroke if necessary
    // stroke(200); //We can use this to set the color of the stroke if necessary
    fill(this.color); //color to fill the blob

    push(); //we enclose things between push and pop so that all transformations within only affect items within
    translate(xpos, ypos); //move to xpos, ypos
    rotate(this.angle+change); //rotate by this.angle+change
    beginShape(); //begin a shape based on the vertex points below
    //The lines below create our vertex points
    var off = 0;
    for (var i = 0; i < TWO_PI; i += 0.1) {
      var offset = map(noise(off, change), 0, 1, -this.roughness, this.roughness);
      var r = this.radius + offset;
      var x = r * cos(i);
      var y = r * sin(i);
      vertex(x, y);
      off += 0.1;
    }
    endShape(); //end and create the shape
    pop();

    }
}

// end blob



function setup(){
    pixelDensity(1);
    let canvas = createCanvas(windowW, windowH, P2D);
    canvas.id("p5canvas");

    //Create data element after creating the canvas
    //This is necessary because the canvas element is retrieved within the data class
    data = new Data();


    // blob
    // createCanvas(800, 800);
    background(0,255);
    change = 0;
    colorsPalette = [color(0,255, 0, 30),
              color(50, 200, 50, 30),
              color(30, 100, 30, 30),];
  
    for (var i=0;i<110;i++){
      organics.push(new Organic(0.1+1*i,width/2,height/2,i*1,i*random(90),colorsPalette[floor(random(3))]));
    }
    // end blob
}

function draw(){
    data.update();
    background(0);
    image(data.output.video, 0, 0); //This has no purpose in the data collection- so this could be turned off

    if(data.output.expressions){
        let count = 0;
        fill(255);
        textSize(32);
        
        // console.log(data.output.expressions);
        for(let expression in data.output.expressions){ //loop through the data object
            count++;
            text(Object.keys(data.output.expressions)[count - 1], 50, windowH - (50 * count)); //write object key on the screen
        }

        let emotion = Object.keys(data.output.expressions)[0];

        switch(emotion) {
            case "neutral":
                for(var i=0; i<organics.length;i++){
                    organics[i].color = color(255, 255, 255, 30);
                }
              break;
            case "happy":
                for(var i=0; i<organics.length;i++){
                    organics[i].color = color(0, 255, 0, 30);
                }
              break;
            case "angry":
                for(var i=0; i<organics.length;i++){
                    organics[i].color = color(255, 0, 0, 30);
                }
            break;
            case "disgusted":
                for(var i=0; i<organics.length;i++){
                    organics[i].color = color(0, 0, 0, 30);
                }
            break;
            case "surprised":
                for(var i=0; i<organics.length;i++){
                    organics[i].color = color(0, 0, 255, 30);
                }
            break;
            default:
              // code block
          }

    }

    // blob
    for(var i=0; i<organics.length;i++){
        organics[i].show(change);
    }
  
    change+=0.01;
    // end blob
}
