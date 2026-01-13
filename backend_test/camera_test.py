from ultralytics import YOLO
import cv2
import numpy as np

# Load trained OBB model
model = YOLO("best.pt")

# Open camera
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("❌ Cannot open camera")
    exit()

print("📷 Camera started")
print("👉 Press SPACE to capture photo")
print("👉 Press Q to quit")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    cv2.imshow("Live Camera", frame)
    key = cv2.waitKey(1)

    # SPACE pressed → capture image
    if key == 32:
        image = frame.copy()
        break

    # Q pressed → exit
    if key == ord('q'):
        cap.release()
        cv2.destroyAllWindows()
        exit()

cap.release()
cv2.destroyAllWindows()

# Run YOLO inference
results = model(image, conf=0.25)

count = 0
output = image.copy()

for r in results:
    if r.obb is None:
        continue

    boxes = r.obb.xyxyxyxy.cpu().numpy()

    for i, box in enumerate(boxes):
        count += 1
        pts = box.astype(int)

        # Draw rotated bounding box
        cv2.polylines(output, [pts], True, (0, 255, 0), 2)

        # Compute center for numbering
        cx = int(np.mean(pts[:, 0]))
        cy = int(np.mean(pts[:, 1]))

        # Draw serial number
        cv2.putText(
            output,
            str(count),
            (cx, cy),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (0, 0, 255),
            2
        )

print(f"✅ TOTAL OBJECTS: {count}")

cv2.imshow("Detection Result", output)
cv2.waitKey(0)
cv2.destroyAllWindows()
