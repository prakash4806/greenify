import torch
import torch.nn.functional as F
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification

# Global variables for caching leaf classification model
leaf_processor = None
leaf_model = None

LEAF_MODEL_NAME = "google/mobilenet_v2_1.0_224"
LEAF_MODEL_VERSION = "MobileNetV2-ImageNet-v1"

# Keywords that represent plant-related classes in ImageNet
PLANT_KEYWORDS = [
    "leaf", "plant", "tree", "vegetation", "flower", "foliage", 
    "daisy", "rose", "orchid", "tulip", "crocus", "sunflower",
    "dandelion", "marigold", "daffodil", "lily", "carnation", 
    "poppy", "pansy", "petunia", "geranium", "begonia",
    "cabbage", "broccoli", "cauliflower", "spinach", "lettuce",
    "corn", "maize", "potato", "grape", "strawberry", "orange",
    "apple", "peach", "cherry", "lemon", "lime", "banana",
    "pineapple", "tomato", "pepper", "squash", "pumpkin", "melon",
    "forest", "woodland", "grass", "herb", "fern", "moss",
    "acorn", "buckeye", "chestnut", "pinecone", "willow", "palm",
    "sprout", "seedling", "shrub", "bush", "vine", "ivy", "clover",
    "flowerpot", "greenhouse", "hay", "artichoke", "cardoon", "mushroom"
]

def load_leaf_model():
    """
    Loads the general ImageNet classification model once for leaf validation.
    """
    global leaf_processor, leaf_model
    print(f"Loading general leaf validation model '{LEAF_MODEL_NAME}'...")
    leaf_processor = AutoImageProcessor.from_pretrained(LEAF_MODEL_NAME)
    leaf_model = AutoModelForImageClassification.from_pretrained(LEAF_MODEL_NAME)
    leaf_model.eval()
    
    # Warm-up inference
    print("Warming up leaf validation model...")
    try:
        dummy_input = torch.zeros(1, 3, 224, 224)
        with torch.no_grad():
            _ = leaf_model(dummy_input)
        print("Leaf validation model warm-up completed successfully.")
    except Exception as e:
        print(f"Error during leaf model warm-up: {e}")

def get_leaf_model_status() -> str:
    if leaf_model is not None and leaf_processor is not None:
        return "loaded"
    return "not_loaded"

def validate_leaf(image: Image.Image) -> dict:
    """
    Validates whether the PIL Image contains a plant leaf, flower, or vegetation.
    Returns:
        dict: { "valid": bool, "label": str, "confidence": float }
    """
    if leaf_model is None or leaf_processor is None:
        raise ValueError("Leaf validation model is not initialized. Call load_leaf_model() first.")
        
    # Ensure RGB mode
    if image.mode != "RGB":
        image = image.convert("RGB")
        
    # Preprocess image
    inputs = leaf_processor(images=image, return_tensors="pt")
    
    # Run Inference
    with torch.no_grad():
        outputs = leaf_model(**inputs)
        logits = outputs.logits
        
    # Calculate probabilities
    probabilities = F.softmax(logits, dim=-1).squeeze(0)
    
    # Get top predicted class
    prob, index = torch.max(probabilities, dim=-1)
    confidence = round(prob.item() * 100, 2)
    
    # Get class label from model configuration
    predicted_label = leaf_model.config.id2label[index.item()]
    
    # Normalize label for keyword matching
    norm_label = predicted_label.lower()
    
    # Check if the predicted label matches any plant keywords
    is_valid = any(kw in norm_label for kw in PLANT_KEYWORDS)
    
    # Format a user-friendly label
    display_label = predicted_label.split(",")[0]
    
    return {
        "valid": is_valid,
        "label": display_label,
        "confidence": confidence
    }
