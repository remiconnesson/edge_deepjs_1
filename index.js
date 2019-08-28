const video = document.getElementById('video')

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObjct = stream,
        err => console.error(err)
    )
}

startVideo()
