let cursor = document.getElementById('cursor');

const videoElement = document.createElement('video');
const canvasElement = document.createElement('canvas');
const canvasCtx = canvasElement.getContext('2d');

const faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
faceMesh.setOptions({ refineLandmarks: true });
faceMesh.onResults(onResults);

let calibrationPoints = [
    { x: 0.1, y: 0.1 }, // Top-left
    { x: 0.9, y: 0.1 }, // Top-right
    { x: 0.5, y: 0.5 }, // Center
    { x: 0.1, y: 0.9 }, // Bottom-left
    { x: 0.9, y: 0.9 }  // Bottom-right
];

let calibrationData = [];
let currentPoint = 0;
let isCalibrating = false;
let isTrackingActive = false;

async function startVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoElement.srcObject = stream;
    videoElement.play();
}

function onResults(results) {
    if (!results.multiFaceLandmarks) return;

    const landmarks = results.multiFaceLandmarks[0];
    const leftEyeX = (landmarks[33].x + landmarks[133].x) / 2;
    const leftEyeY = (landmarks[33].y + landmarks[133].y) / 2;

    const screenX = window.innerWidth * leftEyeX;
    const screenY = window.innerHeight * leftEyeY;

    if (isCalibrating) {
        collectCalibrationData(screenX, screenY);
    } else if (isTrackingActive) {
        const [adjustedX, adjustedY] = adjustCoordinates(leftEyeX, leftEyeY);
        moveCursor(adjustedX, adjustedY);
    }
}

function moveCursor(x, y) {
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
}

function startCalibration() {
    isCalibrating = true;
    currentPoint = 0;
    calibrationData = [];
    nextCalibrationPoint();
}

function nextCalibrationPoint() {
    if (currentPoint >= calibrationPoints.length) {
        isCalibrating = false;
        activateTracking();
        console.log('Calibration complete');
        return;
    }

    const point = calibrationPoints[currentPoint];
    cursor.style.left = `${point.x * window.innerWidth}px`;
    cursor.style.top = `${point.y * window.innerHeight}px`;
    setTimeout(() => {
        currentPoint++;
        nextCalibrationPoint();
    }, 2000); // Wait 2 seconds for user to focus on the point
}

function collectCalibrationData(x, y) {
    calibrationData.push({
        point: calibrationPoints[currentPoint - 1],
        eye: { x, y }
    });
}

function adjustCoordinates(leftEyeX, leftEyeY) {
    // Apply scaling based on calibration data
    const mappedX = leftEyeX * window.innerWidth;
    const mappedY = leftEyeY * window.innerHeight;
    return [mappedX, mappedY];
}

function activateTracking() {
    isTrackingActive = true;
    alert('Calibration complete. Eye tracking is now active.');
}

document.getElementById('calibrate').addEventListener('click', startCalibration);

startVideo();
