"""
NoduleScan AI - Backend API
FastAPI backend service for lung nodule detection using a trained YOLOv8n model.
"""

from contextlib import asynccontextmanager
from datetime import datetime, timezone
import io
import os
from pathlib import Path
import time
from typing import List, Optional

from fastapi import FastAPI, File, Form, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import pydantic

# Path configuration
BASE_DIR = Path(__file__).resolve().parent
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "best.pt"

# Global state for model
app_state = {
    "model": None,
    "model_loaded": False,
    "model_error": None,
    "model_path": str(MODEL_PATH),
}

# Held-out evaluation metrics from model training
EVALUATION_METRICS = {
    "architecture": "YOLOv8n",
    "precision": 65.11,
    "recall": 57.98,
    "map50": 59.82,
    "map50_95": 27.57,
    "note": "Reported on held-out test split during offline evaluation. Not a clinical guarantee.",
}


def load_nodule_model():
    """Attempt to load the YOLOv8n model checkpoint from backend/models/best.pt."""
    if not MODEL_PATH.exists():
        app_state["model_loaded"] = False
        app_state["model"] = None
        app_state["model_error"] = (
            f"Checkpoint file not found at '{MODEL_PATH}'. "
            "Please copy your trained 'best.pt' file into the 'backend/models/' directory."
        )
        return

    try:
        from ultralytics import YOLO

        model = YOLO(str(MODEL_PATH))
        app_state["model"] = model
        app_state["model_loaded"] = True
        app_state["model_error"] = None
    except Exception as exc:
        app_state["model_loaded"] = False
        app_state["model"] = None
        app_state["model_error"] = f"Failed to initialize model from '{MODEL_PATH}': {str(exc)}"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager to load model on startup."""
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    load_nodule_model()
    yield


app = FastAPI(
    title="NoduleScan AI API",
    description="Inference and health check API for NoduleScan AI Lung Nodule Detection",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_anatomical_location(x1: float, y1: float, x2: float, y2: float, width: int, height: int) -> str:
    """
    Generate an understandable anatomical zone description based on chest radiography conventions.
    In standard PA chest radiography, the patient's anatomical right is on the viewer's left.
    """
    center_x = (x1 + x2) / 2.0
    center_y = (y1 + y2) / 2.0

    # Horizontal orientation (anatomical)
    if center_x < width * 0.48:
        lateral = "Right Lung Field (Viewer Left)"
    elif center_x > width * 0.52:
        lateral = "Left Lung Field (Viewer Right)"
    else:
        lateral = "Central / Perihilar Region"

    # Vertical lung zone
    if center_y < height * 0.35:
        zone = "Upper Zone"
    elif center_y < height * 0.65:
        zone = "Mid Zone"
    else:
        zone = "Lower Zone"

    return f"{lateral} - {zone}"


def generate_clean_annotated_image(original_image: Image.Image, detections: list) -> str:
    """
    Render bounding boxes with clean medical aesthetics (high-contrast teal border,
    semi-transparent tags, readable labels) without obscuring the radiograph.
    Returns base64-encoded JPEG.
    """
    import base64

    # Work on a copy in RGB mode
    annotated = original_image.copy().convert("RGB")
    draw = ImageDraw.Draw(annotated)
    width, height = annotated.size

    # Scale stroke width based on image size (2-4 px)
    stroke_w = max(2, int(min(width, height) / 300))

    # Try default or standard font
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None

    # Colors: high-contrast medical cyan/teal (#00E5FF) and soft dark background
    box_color = (0, 229, 255)
    text_bg = (11, 25, 44, 220)
    text_color = (255, 255, 255)

    for i, det in enumerate(detections, start=1):
        x1, y1, x2, y2 = det["box"]
        conf_pct = det["confidence_pct"]

        # Draw outer bounding box
        draw.rectangle([x1, y1, x2, y2], outline=box_color, width=stroke_w)

        # Draw label tag
        label = f"Nodule #{i}: {conf_pct:.1f}%"
        label_y = max(0, y1 - 18)
        label_x = x1

        # Text background badge
        text_bbox = draw.textbbox((label_x + 4, label_y + 2), label, font=font)
        draw.rectangle(
            [text_bbox[0] - 2, text_bbox[1] - 2, text_bbox[2] + 4, text_bbox[3] + 2],
            fill=(11, 25, 44),
            outline=box_color,
            width=1,
        )
        draw.text((label_x + 4, label_y + 2), label, fill=text_color, font=font)

    # Encode to Base64 JPEG
    buffer = io.BytesIO()
    annotated.save(buffer, format="JPEG", quality=92)
    b64_encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/jpeg;base64,{b64_encoded}"


@app.get("/api/health")
async def health_check():
    """
    Health check endpoint reporting backend status, model checkpoint availability,
    and evaluation metrics.
    """
    # Re-check model status dynamically if not yet loaded
    if not app_state["model_loaded"] and MODEL_PATH.exists():
        load_nodule_model()

    return {
        "status": "healthy",
        "service": "NoduleScan AI API",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "model_loaded": app_state["model_loaded"],
        "model_checkpoint_path": str(MODEL_PATH),
        "model_file_exists": MODEL_PATH.is_file(),
        "message": (
            "Model checkpoint loaded and ready for inference."
            if app_state["model_loaded"]
            else app_state["model_error"]
        ),
        "evaluation_metrics": EVALUATION_METRICS,
    }


@app.post("/api/predict")
async def predict_nodules(
    file: UploadFile = File(...),
    confidence_threshold: float = Form(0.25),
):
    """
    Process an uploaded chest X-ray image with the trained YOLOv8n model.
    Validates image format, dimensions, runs inference, and returns bounding boxes with scores.
    """
    # 1. Re-check model availability
    if not app_state["model_loaded"] and MODEL_PATH.exists():
        load_nodule_model()

    if not app_state["model_loaded"]:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "Model checkpoint not found",
                "message": (
                    f"The model checkpoint 'best.pt' is missing from '{MODEL_PATH}'. "
                    "Please extract your trained 'best.pt' file into the 'backend/models/' folder."
                ),
            },
        )

    # 2. Validate file format
    allowed_extensions = {".png", ".jpg", ".jpeg"}
    ext = Path(file.filename or "").suffix.lower()
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Please upload a PNG or JPEG chest X-ray image.",
        )

    # 3. Read image bytes and validate size (max 15MB)
    max_size_bytes = 15 * 1024 * 1024
    content = await file.read()
    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty. Please select a valid chest X-ray image.",
        )
    if len(content) > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size exceeds the 15MB limit ({len(content) / (1024 * 1024):.1f}MB uploaded).",
        )

    # 4. Safely open image with Pillow
    try:
        pil_image = Image.open(io.BytesIO(content))
        pil_image.verify()
        # Re-open after verify() as recommended by PIL
        pil_image = Image.open(io.BytesIO(content))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corrupted or unreadable image file: {str(exc)}",
        )

    # Convert grayscale or RGBA to standard 3-channel RGB without altering geometry
    orig_width, orig_height = pil_image.size
    if pil_image.mode != "RGB":
        rgb_image = pil_image.convert("RGB")
    else:
        rgb_image = pil_image

    # 5. Run YOLO inference
    threshold = max(0.05, min(0.95, float(confidence_threshold)))
    start_time = time.time()
    try:
        results = app_state["model"].predict(
            source=rgb_image,
            conf=threshold,
            verbose=False,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(exc)}",
        )
    inference_time_ms = round((time.time() - start_time) * 1000, 1)

    # 6. Parse detection results
    detections = []
    if results and len(results) > 0 and results[0].boxes is not None:
        boxes = results[0].boxes
        names = app_state["model"].names or {}

        for i, box in enumerate(boxes):
            coords = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
            conf = float(box.conf[0].item())
            cls_id = int(box.cls[0].item())
            class_name = names.get(cls_id, "lung nodule")

            x1 = round(coords[0], 1)
            y1 = round(coords[1], 1)
            x2 = round(coords[2], 1)
            y2 = round(coords[3], 1)

            location_desc = get_anatomical_location(x1, y1, x2, y2, orig_width, orig_height)

            detections.append({
                "id": i + 1,
                "box": [x1, y1, x2, y2],
                "confidence": round(conf, 4),
                "confidence_pct": round(conf * 100, 1),
                "class_name": class_name,
                "location_description": location_desc,
                "width_px": round(x2 - x1, 1),
                "height_px": round(y2 - y1, 1),
            })

    # Sort detections by confidence descending
    detections.sort(key=lambda d: d["confidence"], reverse=True)

    # 7. Generate annotated image
    annotated_image_b64 = generate_clean_annotated_image(rgb_image, detections)

    # Status summary
    if len(detections) > 0:
        status_msg = "Potential Nodule Detected"
    else:
        status_msg = "No nodule detections above the current confidence threshold."

    return {
        "success": True,
        "status": status_msg,
        "total_detections": len(detections),
        "detections": detections,
        "confidence_threshold": threshold,
        "image_metadata": {
            "filename": file.filename,
            "width": orig_width,
            "height": orig_height,
            "format": pil_image.format or "JPEG",
        },
        "inference_time_ms": inference_time_ms,
        "annotated_image": annotated_image_b64,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "disclaimer": (
            "This application is an AI research and visualization tool. Its predictions may be incorrect "
            "and are not a medical diagnosis. It must not be used to make medical decisions or replace "
            "evaluation by a qualified healthcare professional."
        ),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
