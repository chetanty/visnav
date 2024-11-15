import cv2
import numpy as np

def detect_eyes(frame, eye_cascade):
    """Detect eyes in the given frame."""
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    eyes = eye_cascade.detectMultiScale(gray, 1.1, 4)
    return eyes

def draw_eyes(frame, eyes):
    """Draw rectangles around detected eyes."""
    for (x, y, w, h) in eyes:
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

def main():
    # Initialize webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Error: Could not access the webcam.")
        return

    # Load Haar Cascade for eye detection
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        eyes = detect_eyes(frame, eye_cascade)
        draw_eyes(frame, eyes)

        # Display the frame
        cv2.imshow("Eye Tracking", frame)

        # Press 'q' to exit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
