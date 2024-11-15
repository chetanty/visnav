let cursor = document.getElementById('cursor');

window.onload = function() {
    webgazer.setGazeListener((data, elapsedTime) => {
        if (data) {
            const x = data.x;
            const y = data.y;
            moveCursor(x, y);
        }
    }).begin();
};

function moveCursor(x, y) {
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
}

function leftClick() {
    const event = new MouseEvent('click', { bubbles: true });
    document.elementFromPoint(cursor.offsetLeft, cursor.offsetTop).dispatchEvent(event);
}

function rightClick() {
    const event = new MouseEvent('contextmenu', { bubbles: true });
    document.elementFromPoint(cursor.offsetLeft, cursor.offsetTop).dispatchEvent(event);
}
