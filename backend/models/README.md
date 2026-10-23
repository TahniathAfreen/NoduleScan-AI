# Model Checkpoint Directory

Place your trained YOLOv8n lung nodule detection model checkpoint in this folder:

```
backend/models/best.pt
```

### Model Checkpoint Details:
- **File Name:** `best.pt`
- **Architecture:** Ultralytics YOLOv8n (nano)
- **Task:** Object Detection (`detect`)
- **Held-Out Test Set Metrics (for reference):**
  - **Precision:** 65.11%
  - **Recall:** 57.98%
  - **mAP@50:** 59.82%
  - **mAP@50–95:** 27.57%

### How to place your model:
1. Locate your trained model file (`best.pt` inside your downloaded ZIP file from Kaggle).
2. Copy or extract `best.pt` directly into this folder:
   `c:\Users\Tajuddin\Documents\Lung_Nodule_Website\backend\models\best.pt`
3. Restart or start the backend service. The application will detect and load `best.pt` on startup.

If this file is not yet present, the backend gracefully alerts the user via the API and web UI that setup is required, rather than fabricating results or downloading unrelated models.
