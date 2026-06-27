import io
import torch
import torch.nn.functional as F
from PIL import Image
from transformers import AutoImageProcessor, MobileNetV2ForImageClassification

# Global variables to cache model and processor
model = None
processor = None

# Model version indicator
MODEL_VERSION = "MobileNetV2-v1"

# Mapping from class ID to detailed info
CLASS_MAPPING = {
    0: {"plant": "Apple", "disease": "Apple Scab", "slug": "apple-scab", "severity": "High"},
    1: {"plant": "Apple", "disease": "Black Rot", "slug": "apple-black-rot", "severity": "High"},
    2: {"plant": "Apple", "disease": "Cedar Apple Rust", "slug": "apple-cedar-rust", "severity": "Medium"},
    3: {"plant": "Apple", "disease": "Healthy", "slug": None, "severity": "None"},
    4: {"plant": "Blueberry", "disease": "Healthy", "slug": None, "severity": "None"},
    5: {"plant": "Cherry", "disease": "Powdery Mildew", "slug": "cherry-powdery-mildew", "severity": "Medium"},
    6: {"plant": "Cherry", "disease": "Healthy", "slug": None, "severity": "None"},
    7: {"plant": "Corn", "disease": "Cercospora Leaf Spot", "slug": "corn-cercospora-leaf-spot", "severity": "Medium"},
    8: {"plant": "Corn", "disease": "Common Rust", "slug": "corn-common-rust", "severity": "Medium"},
    9: {"plant": "Corn", "disease": "Northern Leaf Blight", "slug": "corn-northern-leaf-blight", "severity": "High"},
    10: {"plant": "Corn", "disease": "Healthy", "slug": None, "severity": "None"},
    11: {"plant": "Grape", "disease": "Black Rot", "slug": "grape-black-rot", "severity": "High"},
    12: {"plant": "Grape", "disease": "Esca (Black Measles)", "slug": "grape-esca", "severity": "Critical"},
    13: {"plant": "Grape", "disease": "Leaf Blight", "slug": "grape-leaf-blight", "severity": "Medium"},
    14: {"plant": "Grape", "disease": "Healthy", "slug": None, "severity": "None"},
    15: {"plant": "Orange", "disease": "Huanglongbing (Citrus Greening)", "slug": "orange-huanglongbing", "severity": "Critical"},
    16: {"plant": "Peach", "disease": "Bacterial Spot", "slug": "peach-bacterial-spot", "severity": "High"},
    17: {"plant": "Peach", "disease": "Healthy", "slug": None, "severity": "None"},
    18: {"plant": "Pepper", "disease": "Bacterial Spot", "slug": "pepper-bacterial-spot", "severity": "High"},
    19: {"plant": "Pepper", "disease": "Healthy", "slug": None, "severity": "None"},
    20: {"plant": "Potato", "disease": "Early Blight", "slug": "potato-early-blight", "severity": "High"},
    21: {"plant": "Potato", "disease": "Late Blight", "slug": "potato-late-blight", "severity": "Critical"},
    22: {"plant": "Potato", "disease": "Healthy", "slug": None, "severity": "None"},
    23: {"plant": "Raspberry", "disease": "Healthy", "slug": None, "severity": "None"},
    24: {"plant": "Soybean", "disease": "Healthy", "slug": None, "severity": "None"},
    25: {"plant": "Squash", "disease": "Powdery Mildew", "slug": "squash-powdery-mildew", "severity": "Medium"},
    26: {"plant": "Strawberry", "disease": "Leaf Scorch", "slug": "strawberry-leaf-scorch", "severity": "Medium"},
    27: {"plant": "Strawberry", "disease": "Healthy", "slug": None, "severity": "None"},
    28: {"plant": "Tomato", "disease": "Bacterial Spot", "slug": "tomato-bacterial-spot", "severity": "High"},
    29: {"plant": "Tomato", "disease": "Early Blight", "slug": "tomato-early-blight", "severity": "High"},
    30: {"plant": "Tomato", "disease": "Late Blight", "slug": "tomato-late-blight", "severity": "Critical"},
    31: {"plant": "Tomato", "disease": "Leaf Mold", "slug": "tomato-leaf-mold", "severity": "Medium"},
    32: {"plant": "Tomato", "disease": "Septoria Leaf Spot", "slug": "tomato-septoria-leaf-spot", "severity": "Medium"},
    33: {"plant": "Tomato", "disease": "Spider Mites", "slug": "tomato-spider-mites", "severity": "Medium"},
    34: {"plant": "Tomato", "disease": "Target Spot", "slug": "tomato-target-spot", "severity": "Medium"},
    35: {"plant": "Tomato", "disease": "Yellow Leaf Curl Virus", "slug": "tomato-yellow-leaf-curl-virus", "severity": "High"},
    36: {"plant": "Tomato", "disease": "Mosaic Virus", "slug": "tomato-mosaic-virus", "severity": "High"},
    37: {"plant": "Tomato", "disease": "Healthy", "slug": None, "severity": "None"}
}

def load_model():
    """
    Loads the MobileNetV2 model and AutoImageProcessor from the local model directory.
    Executes a dummy warm-up inference run to ensure future fast response.
    """
    global model, processor
    import os
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "model")
    print(f"Loading model and processor from '{model_path}'...")
    processor = AutoImageProcessor.from_pretrained(model_path)
    model = MobileNetV2ForImageClassification.from_pretrained(model_path)
    model.eval()
    
    # Model Warm-up
    print("Warming up model with a dummy inference...")
    try:
        # Generate a dummy image tensor (batch size 1, 3 channels, 224x224 size)
        dummy_input = torch.zeros(1, 3, 224, 224)
        with torch.no_grad():
            _ = model(dummy_input)
        print("Model warm-up completed successfully.")
    except Exception as e:
        print(f"Error during model warm-up: {e}")

def get_model_status() -> str:
    if model is not None and processor is not None:
        return "loaded"
    return "not_loaded"

def predict_disease(image: Image.Image) -> dict:
    """
    Runs model inference on PIL Image.
    Applies softmax and maps to target output JSON structure including top-3 predictions.
    """
    if model is None or processor is None:
        raise ValueError("Model is not initialized. Call load_model() first.")
    
    # Ensure RGB
    if image.mode != "RGB":
        image = image.convert("RGB")
        
    # Preprocess image
    inputs = processor(images=image, return_tensors="pt")
    
    # Run Inference
    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        
    # Apply softmax to calculate class probabilities
    probabilities = F.softmax(logits, dim=-1).squeeze(0)
    
    # Get top 3 predictions
    top_probs, top_indices = torch.topk(probabilities, k=3)
    
    top_predictions = []
    for prob, idx in zip(top_probs.tolist(), top_indices.tolist()):
        mapped = CLASS_MAPPING.get(idx, {"disease": "Unknown"})
        # Format the disease label as "Plant - Disease" or just "Disease"
        disease_label = mapped["disease"]
        if mapped.get("plant") and mapped["plant"] != "Unknown" and disease_label != "Healthy":
            full_label = f"{mapped['plant']} - {disease_label}"
        elif disease_label == "Healthy" and mapped.get("plant"):
            full_label = f"Healthy {mapped['plant']}"
        else:
            full_label = disease_label
            
        top_predictions.append({
            "disease": full_label,
            "confidence": round(prob * 100, 2)
        })
        
    # Highest prediction mapping
    best_idx = top_indices[0].item()
    best_prob = top_probs[0].item()
    
    best_mapping = CLASS_MAPPING.get(best_idx, {
        "plant": "Unknown",
        "disease": "Unknown",
        "slug": None,
        "severity": "Unknown"
    })
    
    # Format best disease label nicely if it is healthy
    disease_name = best_mapping["disease"]
    if disease_name == "Healthy" and best_mapping["plant"] != "Unknown":
        disease_name = f"Healthy {best_mapping['plant']}"
        
    result = {
        "plant": best_mapping["plant"],
        "disease": disease_name,
        "slug": best_mapping["slug"],
        "confidence": round(best_prob * 100, 2),
        "severity": best_mapping["severity"],
        "model_version": MODEL_VERSION,
        "top_predictions": top_predictions
    }
    
    return result
