from ultralytics import YOLO
import cv2

# Load trained model
model = YOLO("best.pt")   # your trained model

# Read image
img_path = "images/boxes4.png"
img = cv2.imread(img_path)

# Run inference
results = model(img, conf=0.25)

count = 0

# Copy image for drawing
output = img.copy()

for r in results:
    if r.obb is not None:
        obb = r.obb

        for box in obb.xyxy:
            count += 1

            x1, y1, x2, y2 = map(int, box)

            # Draw bounding box
            cv2.rectangle(
                output,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),
                2
            )

            # Draw sequence number
            cv2.putText(
                output,
                str(count),
                (x1 + 5, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.7,
                (0, 0, 255),
                2
            )

print("TOTAL OBJECTS:", count)

# Show result
cv2.imshow("Result", output)
cv2.waitKey(0)
cv2.destroyAllWindows()
