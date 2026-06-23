import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, AlertTriangle, CheckCircle, Info, Leaf, Bug, Droplets } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Complete disease database with all PlantVillage diseases
const diseaseDatabase: Record<string, any> = {
  // Apple diseases
  "apple-scab": {
    name: "Apple Scab",
    plant: "Apple",
    severity: "High",
    scientificName: "Venturia inaequalis",
    description:
      "Apple scab is one of the most serious diseases of apple trees. It affects leaves, fruit, and sometimes young twigs, causing significant economic losses in apple production worldwide.",
    symptoms: [
      "Dark, olive-green to black spots on leaves",
      "Velvety appearance on leaf spots",
      "Premature leaf drop",
      "Scabby lesions on fruit",
      "Cracked and distorted fruit",
      "Reduced fruit quality and marketability",
    ],
    causes: [
      "Fungal pathogen Venturia inaequalis",
      "Cool, wet spring weather",
      "High humidity conditions",
      "Poor air circulation",
      "Overhead irrigation",
      "Infected fallen leaves from previous season",
    ],
    treatment: [
      "Apply fungicide sprays during early season",
      "Use copper-based fungicides before bud break",
      "Apply systemic fungicides during growing season",
      "Remove and destroy infected leaves and fruit",
      "Prune trees to improve air circulation",
      "Choose resistant apple varieties when possible",
    ],
    prevention: [
      "Plant resistant apple varieties",
      "Ensure proper tree spacing for air circulation",
      "Avoid overhead watering",
      "Clean up fallen leaves in autumn",
      "Apply preventive fungicide sprays",
      "Monitor weather conditions for infection periods",
    ],
    icon: Bug,
  },
  "apple-black-rot": {
    name: "Black Rot",
    plant: "Apple",
    severity: "High",
    scientificName: "Botryosphaeria obtusa",
    description:
      "Black rot is a serious fungal disease that affects apple trees, causing leaf spots, fruit rot, and cankers on branches. It can significantly reduce fruit quality and tree health.",
    symptoms: [
      "Purple to brown leaf spots with light centers",
      "Black, mummified fruit",
      "Sunken, dark cankers on branches",
      "Premature fruit drop",
      "Concentric rings in fruit lesions",
      "Frog-eye leaf spot pattern",
    ],
    causes: [
      "Botryosphaeria obtusa fungus",
      "Warm, humid weather conditions",
      "Tree stress from drought or injury",
      "Poor sanitation practices",
      "Infected pruning wounds",
      "Overwintering fungal spores",
    ],
    treatment: [
      "Remove and destroy infected fruit and branches",
      "Apply copper-based fungicides",
      "Prune during dry weather",
      "Improve air circulation",
      "Use systemic fungicides if severe",
      "Sanitize pruning tools between cuts",
    ],
    prevention: [
      "Choose resistant apple varieties",
      "Maintain proper tree spacing",
      "Remove fallen fruit and leaves",
      "Avoid wounding trees",
      "Apply preventive fungicide sprays",
      "Ensure good drainage around trees",
    ],
    icon: Bug,
  },
  "apple-cedar-rust": {
    name: "Cedar Apple Rust",
    plant: "Apple",
    severity: "Medium",
    scientificName: "Gymnosporangium juniperi-virginianae",
    description:
      "Cedar apple rust is a fungal disease that requires both apple and cedar/juniper trees to complete its life cycle. It primarily affects leaves and fruit of apple trees.",
    symptoms: [
      "Bright orange spots on upper leaf surfaces",
      "Yellow-orange lesions on fruit",
      "Tube-like structures on leaf undersides",
      "Premature leaf drop",
      "Reduced fruit quality",
      "Stunted shoot growth",
    ],
    causes: [
      "Gymnosporangium juniperi-virginianae fungus",
      "Presence of cedar or juniper trees nearby",
      "Wet spring weather",
      "Wind dispersal of spores",
      "Alternating host requirement",
      "High humidity conditions",
    ],
    treatment: [
      "Apply fungicides during early infection period",
      "Remove nearby cedar/juniper trees if possible",
      "Use copper-based sprays",
      "Apply systemic fungicides preventively",
      "Remove infected plant parts",
      "Improve air circulation",
    ],
    prevention: [
      "Plant resistant apple varieties",
      "Remove cedar/juniper trees within 2 miles",
      "Apply preventive fungicide programs",
      "Monitor weather conditions",
      "Ensure proper tree spacing",
      "Choose planting locations carefully",
    ],
    icon: Bug,
  },

  // Cherry diseases
  "cherry-powdery-mildew": {
    name: "Powdery Mildew",
    plant: "Cherry",
    severity: "Medium",
    scientificName: "Podosphaera clandestina",
    description:
      "Powdery mildew is a common fungal disease affecting cherry trees, characterized by white powdery growth on leaves and shoots. It can reduce fruit quality and tree vigor.",
    symptoms: [
      "White powdery coating on leaves",
      "Distorted and curled leaves",
      "Stunted shoot growth",
      "Premature leaf drop",
      "Reduced fruit size",
      "Silver-gray appearance on affected areas",
    ],
    causes: [
      "Podosphaera clandestina fungus",
      "High humidity with dry conditions",
      "Poor air circulation",
      "Overcrowded plantings",
      "Moderate temperatures (60-80°F)",
      "Shaded growing conditions",
    ],
    treatment: [
      "Apply sulfur-based fungicides",
      "Use potassium bicarbonate sprays",
      "Improve air circulation through pruning",
      "Apply systemic fungicides if severe",
      "Remove affected plant parts",
      "Increase sunlight exposure",
    ],
    prevention: [
      "Choose resistant cherry varieties",
      "Ensure proper plant spacing",
      "Prune for good air circulation",
      "Avoid overhead watering",
      "Apply preventive fungicide sprays",
      "Monitor humidity levels",
    ],
    icon: Droplets,
  },

  // Corn diseases
  "corn-cercospora-leaf-spot": {
    name: "Cercospora Leaf Spot",
    plant: "Corn",
    severity: "Medium",
    scientificName: "Cercospora zeae-maydis",
    description:
      "Cercospora leaf spot is a fungal disease that affects corn leaves, causing rectangular lesions that can reduce photosynthetic capacity and yield if severe.",
    symptoms: [
      "Rectangular, tan to brown lesions on leaves",
      "Lesions parallel to leaf veins",
      "Gray center with dark brown margins",
      "Premature leaf death",
      "Reduced photosynthesis",
      "Lower leaves affected first",
    ],
    causes: [
      "Cercospora zeae-maydis fungus",
      "Warm, humid weather conditions",
      "Extended periods of leaf wetness",
      "Poor air circulation",
      "High plant density",
      "Infected crop residue",
    ],
    treatment: [
      "Apply fungicides containing strobilurins",
      "Use triazole fungicides",
      "Remove infected plant debris",
      "Improve air circulation",
      "Reduce plant density if possible",
      "Apply foliar fungicides preventively",
    ],
    prevention: [
      "Plant resistant corn hybrids",
      "Rotate crops annually",
      "Manage crop residue properly",
      "Ensure adequate plant spacing",
      "Monitor weather conditions",
      "Apply preventive fungicide programs",
    ],
    icon: Leaf,
  },
  "corn-common-rust": {
    name: "Common Rust",
    plant: "Corn",
    severity: "Medium",
    scientificName: "Puccinia sorghi",
    description:
      "Common rust is a fungal disease that produces characteristic rust-colored pustules on corn leaves. It's most problematic in cool, humid conditions.",
    symptoms: [
      "Small, cinnamon-brown pustules on leaves",
      "Pustules on both leaf surfaces",
      "Oval to elongated lesions",
      "Premature leaf yellowing",
      "Reduced photosynthetic area",
      "Weakened plant structure",
    ],
    causes: [
      "Puccinia sorghi fungus",
      "Cool temperatures (60-70°F)",
      "High humidity and moisture",
      "Wind dispersal of spores",
      "Dense plant canopy",
      "Extended dew periods",
    ],
    treatment: [
      "Apply fungicides containing azoxystrobin",
      "Use propiconazole-based fungicides",
      "Remove infected plant material",
      "Improve air circulation",
      "Monitor disease development",
      "Apply treatments early in infection",
    ],
    prevention: [
      "Plant resistant corn varieties",
      "Ensure proper plant spacing",
      "Avoid overhead irrigation",
      "Monitor weather conditions",
      "Apply preventive fungicide sprays",
      "Remove crop debris after harvest",
    ],
    icon: Bug,
  },
  "corn-northern-leaf-blight": {
    name: "Northern Leaf Blight",
    plant: "Corn",
    severity: "High",
    scientificName: "Exserohilum turcicum",
    description:
      "Northern leaf blight is a serious fungal disease of corn that can cause significant yield losses. It produces large, cigar-shaped lesions on leaves.",
    symptoms: [
      "Large, cigar-shaped lesions on leaves",
      "Gray-green to tan colored lesions",
      "Lesions 1-6 inches long",
      "Dark sporulation in lesion centers",
      "Premature leaf death",
      "Reduced grain fill",
    ],
    causes: [
      "Exserohilum turcicum fungus",
      "Moderate temperatures (64-81°F)",
      "High humidity conditions",
      "Extended leaf wetness",
      "Infected crop residue",
      "Susceptible corn hybrids",
    ],
    treatment: [
      "Apply strobilurin fungicides",
      "Use triazole-based treatments",
      "Remove infected plant debris",
      "Apply fungicides at early infection",
      "Monitor disease progression",
      "Use combination fungicide products",
    ],
    prevention: [
      "Plant resistant corn hybrids",
      "Rotate with non-host crops",
      "Manage crop residue",
      "Ensure good field drainage",
      "Monitor weather conditions",
      "Apply preventive fungicide programs",
    ],
    icon: Leaf,
  },

  // Grape diseases
  "grape-black-rot": {
    name: "Black Rot",
    plant: "Grape",
    severity: "High",
    scientificName: "Guignardia bidwellii",
    description:
      "Black rot is a serious fungal disease of grapes that can destroy entire crops. It affects leaves, shoots, and fruit, causing significant economic losses.",
    symptoms: [
      "Circular brown spots on leaves",
      "Black, mummified berries",
      "Reddish-brown lesions on shoots",
      "Premature fruit drop",
      "Leaf spots with dark borders",
      "Reduced cluster size",
    ],
    causes: [
      "Guignardia bidwellii fungus",
      "Warm, humid weather",
      "Extended periods of wetness",
      "Poor air circulation",
      "Infected plant debris",
      "Susceptible grape varieties",
    ],
    treatment: [
      "Apply copper-based fungicides",
      "Use systemic fungicides",
      "Remove infected fruit and leaves",
      "Improve air circulation through pruning",
      "Apply treatments before rain",
      "Sanitize pruning equipment",
    ],
    prevention: [
      "Choose resistant grape varieties",
      "Ensure proper vine spacing",
      "Remove fallen leaves and fruit",
      "Prune for good air circulation",
      "Apply preventive fungicide sprays",
      "Monitor weather conditions closely",
    ],
    icon: Bug,
  },
  "grape-esca": {
    name: "Esca (Black Measles)",
    plant: "Grape",
    severity: "Critical",
    scientificName: "Phaeomoniella chlamydospora",
    description:
      "Esca is a complex fungal disease that affects the wood of grapevines, causing decline and death. It's one of the most serious trunk diseases of grapes.",
    symptoms: [
      "Tiger-stripe pattern on leaves",
      "Interveinal chlorosis and necrosis",
      "Black spots on berries",
      "Stunted shoot growth",
      "Dieback of canes",
      "White rot in trunk wood",
    ],
    causes: [
      "Complex of fungi including Phaeomoniella chlamydospora",
      "Pruning wounds",
      "Vine stress",
      "Age of vineyard",
      "Environmental stress",
      "Poor pruning practices",
    ],
    treatment: [
      "Remove affected wood during dormancy",
      "Apply wound protectants after pruning",
      "Use trunk injection treatments",
      "Improve vine nutrition",
      "Reduce vine stress",
      "Consider trunk renewal",
    ],
    prevention: [
      "Use proper pruning techniques",
      "Apply wound protectants",
      "Avoid pruning during wet weather",
      "Maintain vine health",
      "Choose appropriate rootstocks",
      "Monitor for early symptoms",
    ],
    icon: AlertTriangle,
  },
  "grape-leaf-blight": {
    name: "Leaf Blight",
    plant: "Grape",
    severity: "Medium",
    scientificName: "Pseudocercospora vitis",
    description:
      "Grape leaf blight is a fungal disease that causes leaf spots and defoliation, potentially reducing vine vigor and fruit quality.",
    symptoms: [
      "Small, dark spots on leaves",
      "Spots with yellow halos",
      "Premature leaf drop",
      "Reduced photosynthesis",
      "Weakened vine growth",
      "Shot-hole appearance in leaves",
    ],
    causes: [
      "Pseudocercospora vitis fungus",
      "Warm, humid conditions",
      "Poor air circulation",
      "Extended leaf wetness",
      "Dense canopy",
      "Susceptible varieties",
    ],
    treatment: [
      "Apply copper-based fungicides",
      "Use strobilurin fungicides",
      "Improve canopy management",
      "Remove infected leaves",
      "Enhance air circulation",
      "Apply treatments preventively",
    ],
    prevention: [
      "Choose resistant varieties",
      "Proper canopy management",
      "Ensure good air circulation",
      "Avoid overhead irrigation",
      "Monitor weather conditions",
      "Apply preventive sprays",
    ],
    icon: Leaf,
  },

  // Orange diseases
  "orange-huanglongbing": {
    name: "Huanglongbing (Citrus Greening)",
    plant: "Orange",
    severity: "Critical",
    scientificName: "Candidatus Liberibacter asiaticus",
    description:
      "Huanglongbing (HLB) is the most devastating disease of citrus worldwide. It's transmitted by the Asian citrus psyllid and has no cure once a tree is infected.",
    symptoms: [
      "Yellow shoots and branches",
      "Asymmetrical, mottled leaves",
      "Small, misshapen fruit",
      "Bitter, unusable fruit",
      "Premature fruit drop",
      "Tree decline and death",
    ],
    causes: [
      "Candidatus Liberibacter asiaticus bacteria",
      "Asian citrus psyllid transmission",
      "Infected plant material",
      "Poor vector control",
      "Movement of infected trees",
      "Lack of early detection",
    ],
    treatment: [
      "Remove infected trees immediately",
      "Control psyllid vectors",
      "Apply systemic insecticides",
      "Enhance tree nutrition",
      "Use trunk injection treatments",
      "Implement area-wide management",
    ],
    prevention: [
      "Use certified disease-free nursery stock",
      "Control Asian citrus psyllid",
      "Monitor trees regularly",
      "Quarantine infected areas",
      "Apply preventive insecticide treatments",
      "Report suspected cases immediately",
    ],
    icon: Bug,
  },

  // Peach diseases
  "peach-bacterial-spot": {
    name: "Bacterial Spot",
    plant: "Peach",
    severity: "High",
    scientificName: "Xanthomonas arboricola pv. pruni",
    description:
      "Bacterial spot is a serious disease of stone fruits that affects leaves, fruit, and twigs, causing significant economic losses in peach production.",
    symptoms: [
      "Small, dark spots on leaves",
      "Shot-hole appearance in leaves",
      "Sunken lesions on fruit",
      "Cracking around fruit lesions",
      "Twig cankers",
      "Premature defoliation",
    ],
    causes: [
      "Xanthomonas arboricola pv. pruni bacteria",
      "Warm, humid weather",
      "Rain splash and wind",
      "Wounds from insects or hail",
      "Overhead irrigation",
      "Susceptible varieties",
    ],
    treatment: [
      "Apply copper-based bactericides",
      "Use streptomycin sprays",
      "Remove infected plant parts",
      "Improve air circulation",
      "Avoid overhead watering",
      "Apply treatments before rain",
    ],
    prevention: [
      "Choose resistant peach varieties",
      "Ensure proper tree spacing",
      "Avoid overhead irrigation",
      "Remove fallen leaves and fruit",
      "Apply preventive copper sprays",
      "Monitor weather conditions",
    ],
    icon: Bug,
  },

  // Pepper diseases
  "pepper-bacterial-spot": {
    name: "Bacterial Spot",
    plant: "Pepper",
    severity: "High",
    scientificName: "Xanthomonas euvesicatoria",
    description:
      "Bacterial spot is a serious disease of peppers that can cause significant yield losses and fruit quality reduction in warm, humid conditions.",
    symptoms: [
      "Small, dark spots on leaves",
      "Yellow halos around leaf spots",
      "Raised, scabby lesions on fruit",
      "Premature leaf drop",
      "Reduced fruit quality",
      "Stunted plant growth",
    ],
    causes: [
      "Xanthomonas euvesicatoria bacteria",
      "Warm temperatures (75-86°F)",
      "High humidity and moisture",
      "Rain splash transmission",
      "Contaminated seeds",
      "Wounds from insects or handling",
    ],
    treatment: [
      "Apply copper-based bactericides",
      "Use streptomycin treatments",
      "Remove infected plant material",
      "Improve air circulation",
      "Reduce humidity around plants",
      "Apply treatments preventively",
    ],
    prevention: [
      "Use certified disease-free seeds",
      "Choose resistant pepper varieties",
      "Avoid overhead watering",
      "Ensure proper plant spacing",
      "Rotate crops annually",
      "Sanitize tools and equipment",
    ],
    icon: Bug,
  },

  // Potato diseases
  "potato-early-blight": {
    name: "Early Blight",
    plant: "Potato",
    severity: "High",
    scientificName: "Alternaria solani",
    description:
      "Early blight is a common fungal disease of potatoes that can cause significant yield losses and tuber quality reduction if not properly managed.",
    symptoms: [
      "Dark brown spots with concentric rings on leaves",
      "Target-spot appearance",
      "Yellowing around leaf spots",
      "Premature leaf drop",
      "Dark, sunken lesions on tubers",
      "Collar rot on stems",
    ],
    causes: [
      "Alternaria solani fungus",
      "Warm temperatures (75-85°F)",
      "High humidity conditions",
      "Plant stress from drought",
      "Poor nutrition",
      "Wounds on tubers",
    ],
    treatment: [
      "Apply fungicides containing chlorothalonil",
      "Use copper-based treatments",
      "Remove infected plant debris",
      "Improve air circulation",
      "Reduce plant stress",
      "Apply mulch to prevent soil splash",
    ],
    prevention: [
      "Choose resistant potato varieties",
      "Rotate crops for 3-4 years",
      "Ensure adequate nutrition",
      "Avoid overhead irrigation",
      "Remove plant debris after harvest",
      "Apply preventive fungicide sprays",
    ],
    icon: Bug,
  },
  "potato-late-blight": {
    name: "Late Blight",
    plant: "Potato",
    severity: "Critical",
    scientificName: "Phytophthora infestans",
    description:
      "Late blight is one of the most destructive diseases of potato. It was responsible for the Irish Potato Famine and continues to cause significant losses worldwide.",
    symptoms: [
      "Water-soaked, dark green to brown lesions on leaves",
      "White, fuzzy growth on leaf undersides",
      "Rapid spread during cool, wet weather",
      "Dark brown to black lesions on stems",
      "Firm, brown rot on tubers",
      "Foul odor from infected tubers",
    ],
    causes: [
      "Phytophthora infestans oomycete",
      "Cool temperatures (60-70°F)",
      "High humidity (>90%)",
      "Extended periods of leaf wetness",
      "Poor drainage",
      "Infected seed potatoes",
    ],
    treatment: [
      "Apply systemic fungicides immediately",
      "Use copper-based fungicides preventively",
      "Remove and destroy infected plants",
      "Improve drainage and air circulation",
      "Harvest tubers as soon as possible",
      "Store tubers in cool, dry conditions",
    ],
    prevention: [
      "Plant certified disease-free seed potatoes",
      "Choose resistant potato varieties",
      "Ensure proper field drainage",
      "Avoid overhead irrigation",
      "Monitor weather conditions closely",
      "Apply preventive fungicide programs",
    ],
    icon: Droplets,
  },

  // Squash diseases
  "squash-powdery-mildew": {
    name: "Powdery Mildew",
    plant: "Squash",
    severity: "Medium",
    scientificName: "Podosphaera xanthii",
    description:
      "Powdery mildew is a common fungal disease of squash and other cucurbits that can reduce yield and fruit quality by affecting photosynthesis.",
    symptoms: [
      "White powdery coating on leaves",
      "Yellow spots on upper leaf surfaces",
      "Premature leaf senescence",
      "Reduced fruit size and quality",
      "Stunted plant growth",
      "Distorted leaves",
    ],
    causes: [
      "Podosphaera xanthii fungus",
      "High humidity with dry conditions",
      "Poor air circulation",
      "Overcrowded plantings",
      "Moderate temperatures",
      "Shaded growing conditions",
    ],
    treatment: [
      "Apply sulfur-based fungicides",
      "Use potassium bicarbonate sprays",
      "Apply systemic fungicides if severe",
      "Improve air circulation",
      "Remove heavily infected leaves",
      "Increase sunlight exposure",
    ],
    prevention: [
      "Choose resistant squash varieties",
      "Ensure proper plant spacing",
      "Provide good air circulation",
      "Avoid overhead watering",
      "Monitor humidity levels",
      "Apply preventive treatments",
    ],
    icon: Droplets,
  },

  // Strawberry diseases
  "strawberry-leaf-scorch": {
    name: "Leaf Scorch",
    plant: "Strawberry",
    severity: "Medium",
    scientificName: "Diplocarpon earlianum",
    description:
      "Strawberry leaf scorch is a fungal disease that causes distinctive leaf spots and can reduce plant vigor and fruit production.",
    symptoms: [
      "Small, dark purple spots on leaves",
      "Spots with white to gray centers",
      "Irregular-shaped lesions",
      "Premature leaf drop",
      "Reduced plant vigor",
      "Decreased fruit production",
    ],
    causes: [
      "Diplocarpon earlianum fungus",
      "Warm, humid weather",
      "Extended periods of leaf wetness",
      "Poor air circulation",
      "Overhead irrigation",
      "Dense plant canopy",
    ],
    treatment: [
      "Apply fungicides containing myclobutanil",
      "Use copper-based treatments",
      "Remove infected leaves",
      "Improve air circulation",
      "Reduce humidity around plants",
      "Apply treatments before symptoms appear",
    ],
    prevention: [
      "Choose resistant strawberry varieties",
      "Ensure proper plant spacing",
      "Avoid overhead watering",
      "Remove old leaves regularly",
      "Apply preventive fungicide sprays",
      "Monitor weather conditions",
    ],
    icon: Leaf,
  },

  // Tomato diseases
  "tomato-bacterial-spot": {
    name: "Bacterial Spot",
    plant: "Tomato",
    severity: "High",
    scientificName: "Xanthomonas perforans",
    description:
      "Bacterial spot is a serious disease of tomatoes that can cause significant yield losses and fruit quality reduction, especially in warm, humid climates.",
    symptoms: [
      "Small, dark brown spots on leaves",
      "Yellow halos around leaf spots",
      "Raised, scabby lesions on fruit",
      "Premature leaf drop",
      "Reduced fruit marketability",
      "Stunted plant growth",
    ],
    causes: [
      "Xanthomonas perforans bacteria",
      "Warm temperatures (75-86°F)",
      "High humidity and rainfall",
      "Contaminated seeds or transplants",
      "Wounds from insects or handling",
      "Overhead irrigation",
    ],
    treatment: [
      "Apply copper-based bactericides",
      "Use streptomycin treatments",
      "Remove infected plant material",
      "Improve air circulation",
      "Avoid overhead watering",
      "Apply treatments preventively",
    ],
    prevention: [
      "Use certified disease-free seeds",
      "Choose resistant tomato varieties",
      "Avoid overhead irrigation",
      "Ensure proper plant spacing",
      "Rotate crops annually",
      "Sanitize tools and equipment",
    ],
    icon: Bug,
  },
  "tomato-early-blight": {
    name: "Early Blight",
    plant: "Tomato",
    severity: "High",
    scientificName: "Alternaria solani",
    description:
      "Early blight is a common fungal disease that affects tomatoes and other solanaceous crops. It typically occurs during warm, humid conditions and can cause significant yield losses.",
    symptoms: [
      "Dark brown spots with concentric rings on lower leaves",
      "Yellow halo around leaf spots",
      "Progressive upward movement of disease",
      "Premature leaf drop",
      "Dark, sunken lesions on fruit",
      "Collar rot on seedlings",
    ],
    causes: [
      "Alternaria solani fungus",
      "Warm temperatures (75-85°F)",
      "High humidity and moisture",
      "Poor air circulation",
      "Plant stress from drought or nutrient deficiency",
      "Wounds from insects or mechanical damage",
    ],
    treatment: [
      "Apply copper-based fungicides",
      "Use chlorothalonil or mancozeb fungicides",
      "Remove affected plant parts immediately",
      "Improve air circulation around plants",
      "Reduce humidity through proper spacing",
      "Apply mulch to prevent soil splash",
    ],
    prevention: [
      "Choose resistant tomato varieties",
      "Rotate crops annually",
      "Avoid overhead watering",
      "Provide adequate plant spacing",
      "Remove plant debris at end of season",
      "Apply preventive fungicide sprays",
    ],
    icon: Bug,
  },
  "tomato-late-blight": {
    name: "Late Blight",
    plant: "Tomato",
    severity: "Critical",
    scientificName: "Phytophthora infestans",
    description:
      "Late blight is one of the most destructive diseases of tomatoes. It can destroy entire crops within days under favorable conditions and requires immediate action.",
    symptoms: [
      "Water-soaked lesions on leaves",
      "White fuzzy growth on leaf undersides",
      "Rapid blackening and death of foliage",
      "Brown, firm lesions on fruit",
      "Foul odor from infected tissue",
      "Complete plant collapse in severe cases",
    ],
    causes: [
      "Phytophthora infestans oomycete",
      "Cool temperatures (60-70°F)",
      "High humidity (>90%)",
      "Extended periods of leaf wetness",
      "Poor air circulation",
      "Infected transplants or nearby potatoes",
    ],
    treatment: [
      "Apply systemic fungicides immediately",
      "Use copper-based fungicides preventively",
      "Remove and destroy infected plants",
      "Improve air circulation and drainage",
      "Harvest green fruit before infection",
      "Apply treatments before rain events",
    ],
    prevention: [
      "Choose resistant tomato varieties",
      "Ensure proper plant spacing",
      "Avoid overhead irrigation",
      "Monitor weather conditions closely",
      "Apply preventive fungicide programs",
      "Remove plant debris thoroughly",
    ],
    icon: Droplets,
  },
  "tomato-leaf-mold": {
    name: "Leaf Mold",
    plant: "Tomato",
    severity: "Medium",
    scientificName: "Passalora fulva",
    description:
      "Tomato leaf mold is a fungal disease that primarily affects greenhouse-grown tomatoes but can also occur in field conditions with high humidity.",
    symptoms: [
      "Yellow spots on upper leaf surfaces",
      "Olive-green to brown fuzzy growth on leaf undersides",
      "Progressive yellowing and browning of leaves",
      "Premature leaf drop",
      "Reduced photosynthesis",
      "Stunted plant growth",
    ],
    causes: [
      "Passalora fulva fungus",
      "High humidity (>85%)",
      "Poor air circulation",
      "Moderate temperatures (70-80°F)",
      "Greenhouse conditions",
      "Dense plant canopy",
    ],
    treatment: [
      "Improve ventilation and air circulation",
      "Reduce humidity levels",
      "Apply fungicides containing chlorothalonil",
      "Remove infected leaves",
      "Increase plant spacing",
      "Use resistant varieties",
    ],
    prevention: [
      "Choose resistant tomato varieties",
      "Ensure adequate ventilation",
      "Maintain proper humidity levels",
      "Provide adequate plant spacing",
      "Monitor greenhouse conditions",
      "Apply preventive treatments",
    ],
    icon: Droplets,
  },
  "tomato-septoria-leaf-spot": {
    name: "Septoria Leaf Spot",
    plant: "Tomato",
    severity: "Medium",
    scientificName: "Septoria lycopersici",
    description:
      "Septoria leaf spot is a common fungal disease of tomatoes that causes distinctive small spots with dark borders and can lead to significant defoliation.",
    symptoms: [
      "Small, circular spots with dark borders",
      "Gray to white centers in spots",
      "Tiny black specks (pycnidia) in spot centers",
      "Progressive yellowing of leaves",
      "Premature defoliation",
      "Reduced fruit production",
    ],
    causes: [
      "Septoria lycopersici fungus",
      "Warm, humid weather",
      "Extended periods of leaf wetness",
      "Rain splash transmission",
      "Infected plant debris",
      "Poor air circulation",
    ],
    treatment: [
      "Apply fungicides containing chlorothalonil",
      "Use copper-based treatments",
      "Remove infected lower leaves",
      "Improve air circulation",
      "Apply mulch to prevent soil splash",
      "Water at soil level",
    ],
    prevention: [
      "Choose resistant varieties when available",
      "Rotate crops annually",
      "Remove plant debris",
      "Avoid overhead watering",
      "Ensure proper plant spacing",
      "Apply preventive fungicide sprays",
    ],
    icon: Leaf,
  },
  "tomato-spider-mites": {
    name: "Spider Mites",
    plant: "Tomato",
    severity: "Medium",
    scientificName: "Tetranychus urticae",
    description:
      "Spider mites are tiny arachnids that feed on tomato plants, causing stippling, yellowing, and webbing on leaves. They thrive in hot, dry conditions.",
    symptoms: [
      "Fine stippling or speckling on leaves",
      "Yellow or bronze discoloration",
      "Fine webbing on leaves and stems",
      "Premature leaf drop",
      "Reduced plant vigor",
      "Tiny moving dots on leaf undersides",
    ],
    causes: [
      "Tetranychus urticae mites",
      "Hot, dry weather conditions",
      "Low humidity",
      "Dusty conditions",
      "Stressed plants",
      "Overuse of broad-spectrum insecticides",
    ],
    treatment: [
      "Apply miticides or insecticidal soaps",
      "Use predatory mites for biological control",
      "Increase humidity around plants",
      "Remove heavily infested leaves",
      "Apply horticultural oils",
      "Use strong water sprays to dislodge mites",
    ],
    prevention: [
      "Maintain adequate soil moisture",
      "Increase humidity around plants",
      "Avoid dusty conditions",
      "Encourage beneficial insects",
      "Monitor plants regularly",
      "Avoid broad-spectrum insecticides",
    ],
    icon: Bug,
  },
  "tomato-target-spot": {
    name: "Target Spot",
    plant: "Tomato",
    severity: "Medium",
    scientificName: "Corynespora cassiicola",
    description:
      "Target spot is a fungal disease that affects tomatoes, causing distinctive target-like lesions on leaves and fruit, potentially reducing yield and quality.",
    symptoms: [
      "Circular spots with concentric rings",
      "Target-like appearance of lesions",
      "Brown to black spots on leaves",
      "Lesions on stems and fruit",
      "Premature leaf yellowing",
      "Defoliation in severe cases",
    ],
    causes: [
      "Corynespora cassiicola fungus",
      "Warm, humid conditions",
      "Extended periods of leaf wetness",
      "Poor air circulation",
      "High plant density",
      "Infected plant debris",
    ],
    treatment: [
      "Apply fungicides containing azoxystrobin",
      "Use chlorothalonil-based treatments",
      "Remove infected plant material",
      "Improve air circulation",
      "Reduce humidity around plants",
      "Apply treatments preventively",
    ],
    prevention: [
      "Choose resistant varieties when available",
      "Ensure proper plant spacing",
      "Avoid overhead irrigation",
      "Remove plant debris",
      "Rotate crops annually",
      "Monitor weather conditions",
    ],
    icon: Leaf,
  },
  "tomato-yellow-leaf-curl-virus": {
    name: "Yellow Leaf Curl Virus",
    plant: "Tomato",
    severity: "High",
    scientificName: "Tomato yellow leaf curl virus",
    description:
      "Tomato yellow leaf curl virus is a devastating viral disease transmitted by whiteflies that can cause severe yield losses in tomato production.",
    symptoms: [
      "Upward curling of leaf margins",
      "Yellowing of leaf veins",
      "Stunted plant growth",
      "Reduced fruit size and number",
      "Interveinal chlorosis",
      "Brittle, leathery leaves",
    ],
    causes: [
      "Tomato yellow leaf curl virus",
      "Whitefly transmission (Bemisia tabaci)",
      "Infected transplants",
      "High whitefly populations",
      "Warm weather conditions",
      "Poor vector control",
    ],
    treatment: [
      "Control whitefly vectors with insecticides",
      "Remove infected plants immediately",
      "Use reflective mulches",
      "Apply systemic insecticides",
      "Install physical barriers",
      "No cure once infected",
    ],
    prevention: [
      "Use virus-resistant varieties",
      "Control whitefly populations",
      "Use certified virus-free transplants",
      "Install insect screening",
      "Apply reflective mulches",
      "Monitor for whiteflies regularly",
    ],
    icon: Bug,
  },
  "tomato-mosaic-virus": {
    name: "Mosaic Virus",
    plant: "Tomato",
    severity: "High",
    scientificName: "Tomato mosaic virus",
    description:
      "Tomato mosaic virus is a highly contagious viral disease that can be transmitted mechanically and through seeds, causing significant yield and quality losses.",
    symptoms: [
      "Mottled light and dark green patterns on leaves",
      "Distorted and curled leaves",
      "Stunted plant growth",
      "Reduced fruit size",
      "Uneven fruit ripening",
      "Necrotic streaks on stems",
    ],
    causes: [
      "Tomato mosaic virus",
      "Mechanical transmission through handling",
      "Contaminated tools and equipment",
      "Infected seeds",
      "Contact with infected plants",
      "Poor sanitation practices",
    ],
    treatment: [
      "Remove infected plants immediately",
      "Sanitize tools and equipment",
      "Control aphid vectors",
      "No chemical cure available",
      "Prevent spread to healthy plants",
      "Destroy infected plant material",
    ],
    prevention: [
      "Use certified virus-free seeds",
      "Choose resistant varieties",
      "Sanitize tools between plants",
      "Control aphid populations",
      "Avoid handling wet plants",
      "Practice good sanitation",
    ],
    icon: Bug,
  },
}

interface PageProps {
  params: {
    slug: string
  }
}

export default function DiseaseDetailPage({ params }: PageProps) {
  const disease = diseaseDatabase[params.slug]

  if (!disease) {
    notFound()
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "High":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
      case "High":
        return <AlertTriangle className="h-4 w-4" />
      case "Medium":
        return <Info className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 pt-20 fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/disease-info">
          <Button variant="outline" size="sm" className="mb-4 h-8 text-xs">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Disease Info
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <disease.icon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{disease.name}</h1>
              <p className="text-sm text-gray-600">
                {disease.plant} • <em>{disease.scientificName}</em>
              </p>
            </div>
            <Badge className={`text-xs px-2 py-0.5 ${getSeverityColor(disease.severity)}`}>
              {getSeverityIcon(disease.severity)}
              <span className="ml-1">{disease.severity} Risk</span>
            </Badge>
          </div>
          <p className="text-gray-700 text-sm md:text-base leading-relaxed">{disease.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Symptoms */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center text-sm font-bold text-red-700">
                <AlertTriangle className="mr-1.5 h-4 w-4" />
                Symptoms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <ul className="space-y-1.5">
                {disease.symptoms.map((symptom: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span className="text-xs md:text-sm text-gray-700">{symptom}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Causes */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center text-sm font-bold text-orange-700">
                <Info className="mr-1.5 h-4 w-4" />
                Causes & Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <ul className="space-y-1.5">
                {disease.causes.map((cause: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span className="text-xs md:text-sm text-gray-700">{cause}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Treatment */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center text-sm font-bold text-blue-700">
                <CheckCircle className="mr-1.5 h-4 w-4" />
                Treatment Options
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <ul className="space-y-1.5">
                {disease.treatment.map((treatment: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span className="text-xs md:text-sm text-gray-700">{treatment}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Prevention */}
          <Card>
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center text-sm font-bold text-green-700">
                <Leaf className="mr-1.5 h-4 w-4" />
                Prevention Strategies
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <ul className="space-y-1.5">
                {disease.prevention.map((prevention: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                    <span className="text-xs md:text-sm text-gray-700">{prevention}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Alert className="mt-6 py-2.5 px-3">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-xs text-gray-700">
            <strong>Need help identifying this disease?</strong> Use our AI-powered disease detection tool to analyze
            your plant photos and get instant diagnosis with treatment recommendations.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Link href="/disease-detection">
            <Button size="sm" className="h-9 text-xs bg-green-600 hover:bg-green-700 flex-1 sm:flex-none">Diagnose Your Plant</Button>
          </Link>
          <Link href="/contact">
            <Button size="sm" variant="outline" className="h-9 text-xs flex-1 sm:flex-none">
              Contact Expert
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
