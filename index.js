const webcamElement = document.getElementById('webcam');


console.log('Model Promises...')

Promise.all([
    faceapi.nets.TinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.FaceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRegognitionNet.loadFromUri('/models'),
    faceapi.nets.tinyExpressionNet.loadFromUri('/models')
]).then(app)


async function setupWebcam() {
    return new Promise((resolve, reject) => {
      const navigatorAny = navigator;
      navigator.getUserMedia = navigator.getUserMedia ||
          navigatorAny.webkitGetUserMedia || navigatorAny.mozGetUserMedia ||
          navigatorAny.msGetUserMedia;
      if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true},
          stream => {
            webcamElement.srcObject = stream;
            webcamElement.addEventListener('loadeddata',  () => resolve(), false);
          },
          error => reject());
      } else {
        reject();
      }
    });
}

async function app() {
    console.log('Done loading models')
    console.log('Setting up webcam..');
    await setupWebcam();
    console.log('.. Done.');

    console.log('.. Done.')

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        console.log(detections)
        }, 100)
    }



// app();
