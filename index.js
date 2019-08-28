const webcamElement = document.getElementById('webcam');

//Promise.all([
//    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//    faceapi.nets.FaceLandmark68Net.loadFromUri('/models'),
//    faceapi.nets.faceRegognitionNet.loadFromUri('/models'),
//    faceapi.nets.tinyExpressionNet.loadFromUri('/models'),
//).then()

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
    console.log('Setting up webcam..');
    await setupWebcam();
    console.log('.. Done.');
    console.log('Loading models..');
    faceapi.nets.tinyFaceDetector.loadFromUri('/models');
    faceapi.nets.FaceLandmark68Net.loadFromUri('/models');
    faceapi.nets.faceRegognitionNet.loadFromUri('/models');
    faceapi.nets.tinyExpressionNet.loadFromUri('/models');
    console.log('.. Done.')

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(
            webcamElement, new faceapi.TinyFaceDetectorOptions()
            ).withFaceLandmarks().withFaceExpressions()
        console.log(detections)
        }, 100)
    }



app();
