let vidW = 1280;
let vidH = 720;
vidW /= 2;
vidH /= 2;

let captureConstraints = {
    video: {
        mandatory: {
            minWidth: vidW,
            minHeight: vidH,
            maxWidth: vidW,
            maxHeight: vidH
        },
        optional: [{ maxFrameRate: 20 }]
    },
    audio: false
};

class Data {
    constructor(){
        this.output = new Output();
        this.analysis = new Analysis(this.canvas);
        this.input = new Input();
    }
    update() {
        if(this.analysis.loaded){
            this.output.video.image(this.input.cam, 0, 0);
            this.analysis.getDetections(document.getElementById('videoEl'));
            if(this.analysis.expressions){
                this.output.expressions = this.analysis.expressions;
            }
        }
    }
}

class Output {
    constructor(){
        this.video = createGraphics(vidW, vidH);
        this.video.translate(vidW, 0);
        this.video.scale(-1, 1);
        this.expressions = null;
    }
}

class Analysis {
    constructor(){
        this.loaded = false;
        this.detections = null;
        this.expressions = null;
        this.threshold = 0.1;
        this.loadModels();
    }
    async loadModels(){
        await faceapi.nets.ssdMobilenetv1.loadFromUri('js/face-api/weights');
        await faceapi.nets.faceExpressionNet.loadFromUri('js/face-api/weights');
        this.loaded = true;
    }
    async getDetections(input){
        let result = await faceapi.detectAllFaces(input).withFaceExpressions();
        this.detections = result;
        if(this.detections[0]){
            this.expressions = this.detections[0].expressions;
            for(let expression in this.expressions){
                if(this.expressions[expression] < this.threshold){
                    delete this.expressions[expression];
                }
            }
        }
    }
}

class Input {
    constructor(){
        this.cam = createCapture(captureConstraints, VIDEO);
        this.cam.size(vidW, vidH);
        this.cam.id("videoEl");
        this.cam.hide();
    }
}