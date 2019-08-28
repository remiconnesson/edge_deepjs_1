const video = document.getElementById('video')

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObjct = steam,
        err => console.error(err)
    )
}

startVideo()
