const video = document.getElementById('webcam')

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObjct = stream,
        err => console.error(err)
    )
}

startVideo()
