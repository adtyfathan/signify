"""
Jalankan:
venv\Scripts\Activate.ps1
uvicorn main:app --host 127.0.0.1 --port 8001

Dependensi baru (tambahkan ke requirements.txt):
    torch torchvision huggingface_hub
"""

import logging
import string
from contextlib import asynccontextmanager
from pathlib import Path

import cv2
import numpy as np
import torch
import torch.nn as nn
from torchvision import models, transforms
from huggingface_hub import hf_hub_download
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)


# ── Path ──────────────────────────────────────────────────────────────────────
BASE_DIR   = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "efficientnet_bisindo_sign_language.pth"

# ── Konstanta model ───────────────────────────────────────────────────────────
IMG_SIZE    = 300                              # EfficientNet-B3 standard input size
NUM_CLASSES = 26
LABELS      = list(string.ascii_uppercase)    # ['A', 'B', ..., 'Z']
DEVICE      = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ── ImageNet normalization (sesuai training EfficientNet) ─────────────────────
TRANSFORM = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std =[0.229, 0.224, 0.225],
    ),
])

# ── Global state ──────────────────────────────────────────────────────────────
model = None


# ── Build model architecture (harus sama persis dengan saat training) ─────────
def build_model() -> nn.Module:
    """
    Arsitektur sesuai README HuggingFace:
        model.classifier = nn.Sequential(
            nn.Dropout(p=0.4),
            nn.Linear(1536, 512),
            nn.SiLU(),
            nn.Dropout(p=0.3),
            nn.Linear(512, 26)
        )
    """
    net = models.efficientnet_b3(weights=None)
    net.classifier = nn.Sequential(
        nn.Dropout(p=0.4),
        nn.Linear(1536, 512),
        nn.SiLU(),
        nn.Dropout(p=0.3),
        nn.Linear(512, NUM_CLASSES),
    )
    return net


# ── Lifespan: load / download model sekali saat server start ──────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global model

    # Download dari HuggingFace jika belum ada di lokal
    if not MODEL_PATH.exists():
        log.info("Model tidak ditemukan lokal, mengunduh dari HuggingFace...")
        MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
        try:
            downloaded = hf_hub_download(
                repo_id   = "Syizuril/bisindo-sign-language",
                filename  = "efficientnet_bisindo_sign_language.pth",
                local_dir = str(MODEL_PATH.parent),
            )
            log.info(f"Model berhasil diunduh ke: {downloaded}")
        except Exception as e:
            raise RuntimeError(
                f"Gagal mengunduh model dari HuggingFace: {e}\n"
                "Pastikan koneksi internet tersedia atau letakkan file .pth di folder models/"
            ) from e

    log.info(f"Memuat model EfficientNet-B3 BISINDO dari {MODEL_PATH}...")
    net = build_model()
    checkpoint = torch.load(str(MODEL_PATH), map_location=DEVICE)

    # File .pth menyimpan dict pembungkus: {"model_state_dict": ..., "class_to_idx": ...}
    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        state_dict = checkpoint["model_state_dict"]
        log.info(f"Checkpoint keys: {list(checkpoint.keys())}")
        if "class_to_idx" in checkpoint:
            log.info(f"class_to_idx dari checkpoint: {checkpoint['class_to_idx']}")
    else:
        # Fallback: langsung state_dict
        state_dict = checkpoint

    net.load_state_dict(state_dict)
    net.to(DEVICE)
    net.eval()
    model = net

    log.info(f"Model berhasil dimuat | device={DEVICE} | IMG_SIZE={IMG_SIZE} | {NUM_CLASSES} kelas")
    log.info(f"Labels: {LABELS}")
    yield

    log.info("Server shutdown.")


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="BISINDO Sign Language API",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1", "http://localhost", "http://127.0.0.1:8000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ── Schema ────────────────────────────────────────────────────────────────────
class PredictResponse(BaseModel):
    predicted_label: str          # huruf terprediksi, contoh: "A"
    confidence:      float        # persentase keyakinan, contoh: 97.43
    is_correct:      bool | None  # None jika expected tidak dikirim


# ── Preprocessing ─────────────────────────────────────────────────────────────
def preprocess_frame(image_bytes: bytes) -> torch.Tensor:
    """
    Preprocess frame sesuai pipeline training EfficientNet-B3:
      1. Decode bytes → numpy BGR (OpenCV)
      2. BGR → RGB
      3. Resize ke 300x300
      4. ToTensor → [0, 1]
      5. Normalize dengan ImageNet mean/std
      6. Tambah batch dimension → (1, 3, 300, 300)
    """
    arr   = np.frombuffer(image_bytes, dtype=np.uint8)
    frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)

    if frame is None:
        raise ValueError("Gagal mendecode gambar. Pastikan format JPEG atau PNG.")

    # BGR → RGB
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Apply transforms (Resize, ToTensor, Normalize)
    tensor = TRANSFORM(frame)              # shape: (3, 300, 300)
    return tensor.unsqueeze(0).to(DEVICE)  # shape: (1, 3, 300, 300)


# ── Endpoint: prediksi ────────────────────────────────────────────────────────
@app.post("/predict", response_model=PredictResponse)
async def predict(
    file:     UploadFile = File(...,  description="Frame dari kamera (JPEG/PNG)"),
    expected: str | None = Form(None, description="Huruf yang diharapkan, misal 'A' (opsional)"),
):
    """
    Terima 1 frame gambar tangan → kembalikan prediksi huruf BISINDO.

    Dipanggil dari Laravel setiap user menekan tombol rekam:
    ```php
    Http::attach('file', $imageBytes, 'frame.jpg')
        ->post('http://127.0.0.1:8001/predict', ['expected' => 'A']);
    ```
    """
    if file.content_type not in ("image/jpeg", "image/jpg", "image/png"):
        raise HTTPException(
            status_code=415,
            detail="Format tidak didukung. Kirim gambar JPEG atau PNG.",
        )

    image_bytes = await file.read()

    try:
        input_tensor = preprocess_frame(image_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Inferensi tanpa gradient
    with torch.no_grad():
        logits      = model(input_tensor)[0]          # shape: (26,)
        probs       = torch.softmax(logits, dim=0)    # probabilities
        top_idx     = int(torch.argmax(probs).item())
        top_label   = LABELS[top_idx]
        confidence  = round(float(probs[top_idx].item()) * 100, 2)

    log.info(f"Prediksi: {top_label} ({confidence}%) | expected: {expected}")

    return PredictResponse(
        predicted_label = top_label,
        confidence      = confidence,
        is_correct      = (top_label == expected.upper()) if expected else None,
    )


# ── Endpoint: health check ────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status":       "ok",
        "model_loaded": model is not None,
        "model":        "EfficientNet-B3 (HuggingFace: Syizuril/bisindo-sign-language)",
        "device":       str(DEVICE),
        "img_size":     IMG_SIZE,
        "num_classes":  NUM_CLASSES,
        "labels":       LABELS,
    }