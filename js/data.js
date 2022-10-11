let vidW = 1280;
let vidH = 720;
vidW /= 2;
vidH /= 2;

// fullscreen video
vidW = window.innerWidth;
vidH = window.innerHeight;
// end

let followSpeed = 0.2;

let captureConstraints = {
  video: {
    mandatory: {
      minWidth: vidW,
      minHeight: vidH,
      maxWidth: vidW,
      maxHeight: vidH,
    },
    optional: [{ maxFrameRate: 20 }],
  },
  audio: false,
};

class Data {
  constructor() {
    this.output = new Output();
    this.analysis = new Analysis(this.canvas);
    this.input = new Input();
  }
  update() {
    if (this.analysis.loaded) {
      this.output.video.image(this.input.cam, 0, 0);
      //console.log(this.output.video);
      this.analysis.getDetections(this.output.video);
      if (this.analysis.expressions) {
        this.output.expressions = this.analysis.expressions;
        this.output.faceDimensions = this.analysis.faceDimensions;
        //console.log(this.output.faceDimensions);
      }
    }
  }
}

class Output {
  constructor() {
    this.video = createGraphics(vidW, vidH);
    this.video.translate(vidW, 0);
    this.video.scale(-1, 1);
    this.expressions = null;
    this.faceDimensions = null;
  }
}

class Analysis {
  constructor() {
    this.loaded = false;
    this.detections = null;
    this.faceDimensions = {
      x: null,
      y: null,
      w: null,
      h: null,
    };
    this.expressions = null;
    this.threshold = 0.1;
    this.loadModels();
  }
  async loadModels() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("js/face-api/weights");
    await faceapi.nets.faceExpressionNet.loadFromUri("js/face-api/weights");
    this.loaded = true;
  }
  async getDetections(input) {
    let result = await faceapi
      .detectAllFaces(input.canvas)
      .withFaceExpressions();
    this.detections = result;
    if (this.detections[0]) {
      this.expressions = this.detections[0].expressions;
      for (let expression in this.expressions) {
        if (this.expressions[expression] < this.threshold) {
          delete this.expressions[expression];
        }
      }
      if (this.faceDimensions.x == null) {
        this.faceDimensions.x = this.detections[0].detection._box._x;
        this.faceDimensions.y = this.detections[0].detection._box._y;
        this.faceDimensions.w = this.detections[0].detection._box._width;
        this.faceDimensions.h = this.detections[0].detection._box._height;
      } else {
        this.faceDimensions.x +=
          followSpeed *
          (this.detections[0].detection._box._x - this.faceDimensions.x);
        this.faceDimensions.y +=
          followSpeed *
          (this.detections[0].detection._box._y - this.faceDimensions.y);
        this.faceDimensions.w +=
          followSpeed *
          (this.detections[0].detection._box._width - this.faceDimensions.w);
        this.faceDimensions.h +=
          followSpeed *
          (this.detections[0].detection._box._height - this.faceDimensions.h);
      }
    } else {
      this.faceDimensions.x = null;
      this.faceDimensions.y = null;
      this.faceDimensions.w = null;
      this.faceDimensions.h = null;
    }
  }
}

class Input {
  constructor() {
    this.cam = createCapture(captureConstraints, VIDEO);
    this.cam.size(vidW, vidH);
    this.cam.id("videoEl");
    this.cam.hide();
  }
}
