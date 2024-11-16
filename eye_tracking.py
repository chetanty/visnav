import cv2
import mediapipe as mp
import pyautogui

# Initialize MediaPipe FaceMesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(refine_landmarks=True, max_num_faces=1)
mp_drawing = mp.solutions.drawing_utils

# Constants for eye landmark indices (MediaPipe face mesh indices for the eyes)
LEFT_EYE_INDEXES = [33, 160, 158, 133, 153, 144]
RIGHT_EYE_INDEXES = [362, 385, 387, 263, 373, 380]

# Get screen dimensions
screen_width, screen_height = pyautogui.size()

# Initialize webcam
cap = cv2.VideoCapture(0)

def get_eye_center(landmarks, eye_indexes):
    """Calculate the center of the eye using landmark indices."""
    x_coords = [landmarks[i].x for i in eye_indexes]
    y_coords = [landmarks[i].y for i in eye_indexes]
    return (sum(x_coords) / len(eye_indexes), sum(y_coords) / len(eye_indexes))

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    # Flip the frame horizontally for a natural experience
    frame = cv2.flip(frame, 1)
    height, width, _ = frame.shape

    # Convert the frame to RGB
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Get face mesh results
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            # Get left and right eye centers
            left_eye_center = get_eye_center(face_landmarks.landmark, LEFT_EYE_INDEXES)
            right_eye_center = get_eye_center(face_landmarks.landmark, RIGHT_EYE_INDEXES)

            # Calculate average eye center
            avg_eye_x = (left_eye_center[0] + right_eye_center[0]) / 2
            avg_eye_y = (left_eye_center[1] + right_eye_center[1]) / 2

            # Convert normalized coordinates to screen coordinates
            screen_x = int(avg_eye_x * screen_width)
            screen_y = int(avg_eye_y * screen_height)

            # Move the mouse cursor
            pyautogui.moveTo(screen_x, screen_y)

            # Draw the eye centers for visualization
            cv2.circle(frame, (int(left_eye_center[0] * width), int(left_eye_center[1] * height)), 5, (0, 255, 0), -1)
            cv2.circle(frame, (int(right_eye_center[0] * width), int(right_eye_center[1] * height)), 5, (0, 255, 0), -1)

    # Display the frame with annotations
    cv2.imshow('Eye Tracking with MediaPipe', frame)

    # Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Clean up
cap.release()
cv2.destroyAllWindows()
