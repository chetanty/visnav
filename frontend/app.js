let cursor = document.getElementById('cursor');

// Initialize WebGazer on page load
window.onload = function() {
    // Start WebGazer with logging enabled for debugging
    webgazer.setGazeListener((data, elapsedTime) => {
        if (data) {
            console.log("Gaze data:", data);
            const x = data.x;
            const y = data.y;
            moveCursor(x, y);
        }
    }).begin();

    // Hide the unnecessary overlays
    webgazer.showVideo(false)
            .showFaceOverlay(false)
            .showFaceFeedbackBox(false);

    // Add event listeners for calibration
    document.getElementById('calibrate').addEventListener('click', calibrateWebGazer);
};

// Function to move the red dot cursor
function moveCursor(x, y) {
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
}

// Function for left-click simulation
function leftClick() {
    const event = new MouseEvent('click', { bubbles: true });
    document.elementFromPoint(cursor.offsetLeft, cursor.offsetTop).dispatchEvent(event);
}

// Function for right-click simulation
function rightClick() {
    const event = new MouseEvent('contextmenu', { bubbles: true });
    document.elementFromPoint(cursor.offsetLeft, cursor.offsetTop).dispatchEvent(event);
}

// Function to calibrate WebGazer
function calibrateWebGazer() {
    webgazer.showPredictionPoints(true);
    alert("Move your eyes around the screen to calibrate.");
}
