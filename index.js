const webcamElement = document.getElementById('webcam');

console.log('Model Promises...')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('https://remiconnesson.github.io/edge_deepjs_1/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('https://remiconnesson.github.io/edge_deepjs_1/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('https://remiconnesson.github.io/edge_deepjs_1/models'),
    faceapi.nets.ageGenderNet.loadFromUri('https://remiconnesson.github.io/edge_deepjs_1/models')
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
    console.log('Creating Canvas')
    const canvas = faceapi.createCanvasFromMedia(webcamElement)
    document.body.append(canvas)
    const displaySize = { width: webcamElement.width, 
                          height: webcamElement.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(webcamElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions().withAgeAndGender()
        
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        console.log(detections)
        detections.forEach(result => {
            const { age, gender, genderProbability } = result
            console.log(age, gender, genderProbability)
            new faceapi.draw.DrawTextField(
              [
                `${faceapi.round(age, 0)} years`,
                `${gender} (${faceapi.round(genderProbability)})`
              ],
              result.detection.box.bottomRight
            ).draw(canvas)
          })
        }, 500)


    }



// app();
