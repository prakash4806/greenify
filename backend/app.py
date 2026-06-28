import os
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image
import io

from predict import load_model, predict_disease, get_model_status, MODEL_VERSION
from leaf_classifier import load_leaf_model, validate_leaf

# Initialize FastAPI app
app = FastAPI(
    title="Greenify Plant Disease Classifier API",
    description="FastAPI backend for classifying plant diseases using MobileNetV2",
    version="1.0.0"
)

# Configure CORS to permit the Next.js frontend
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Read frontend URL from environment variable if present
FRONTEND_URL = os.environ.get("NEXT_PUBLIC_SITE_URL") or os.environ.get("FRONTEND_URL")
if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, can narrow to allowed_origins. Let's support * for ease of local testing but still support credentials if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to load and warm up models
@app.on_event("startup")
def startup_event():
    load_model()
    load_leaf_model()

@app.get("/health")
def health_check():
    """
    Health check endpoint to verify backend service availability,
    model loading status, and model version.
    """
    model_status = get_model_status()
    return {
        "status": "ok",
        "model": model_status,
        "version": MODEL_VERSION
    }

# Allowed images configuration
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_MIMETYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB in bytes

@app.post("/predict")
async def predict(file: UploadFile = File(None)):
    """
    Predict endpoint that validates incoming plant image file,
    runs leaf validation, and performs classification inference.
    """
    # 1. Check if file is missing
    if file is None or not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file provided."
        )

    # 2. Check file extension
    _, ext = os.path.splitext(file.filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file extension '{ext}'. Supported extensions: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # 3. Check MIME type
    if file.content_type not in ALLOWED_MIMETYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported MIME type '{file.content_type}'. Supported types: {', '.join(ALLOWED_MIMETYPES)}"
        )

    # 4. Check file size limit
    # Read file content into memory
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 10 MB limit."
        )

    # 5. Check if image is corrupted
    try:
        image = Image.open(io.BytesIO(content))
        image.verify()  # Verify image integrity
        # Re-open because verify() closes the file pointer and ruins subsequent loads
        image = Image.open(io.BytesIO(content))
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is corrupted or not a valid image."
        )

    # 6. Leaf validation checks
    print("Leaf validation started")
    try:
        leaf_validation = validate_leaf(image)
    except Exception as e:
        print(f"Leaf validation failed to run: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Validation model error: {str(e)}"
        )
        
    if not leaf_validation["valid"]:
        detected = leaf_validation["label"]
        print(f"Detected object: {detected}")
        print("Validation failed")
        print("Prediction skipped")
        
        # Return exact HTTP 400 structure requested
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "No plant leaf detected. Please upload a clear image of a plant leaf.",
                "detected_object": detected
            }
        )
        
    print("Leaf validation passed")
    print(f"Detected: Plant Leaf ({leaf_validation['label']})")
    print("Starting disease prediction...")

    # 7. Run prediction
    try:
        prediction_result = predict_disease(image)
        return prediction_result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(e)}"
        )


@app.get("/")
def root():
    return {
        "message": "Greenify API is running",
        "version": MODEL_VERSION
    }


@app.get("/healthz")
def health():
    return {"status": "healthy"}
