import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook untuk prediksi sign dari Python FastAPI server
 * Mengirim frame gambar ke http://127.0.0.1:8001/predict
 *
 * PERBAIKAN:
 * - Menerima webcamRef langsung (bukan canvas yang sudah ada overlay)
 * - Membuat offscreen canvas bersih dari video element
 * - Tidak flip horizontal (sesuai data training)
 */
export const usePythonPredict = (
  pythonApiUrl = 'http://127.0.0.1:8001',
  timeout = 5000,
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const timeoutRef = useRef(null);
  // Offscreen canvas untuk capture bersih (tidak ada overlay bounding box)
  const offscreenCanvasRef = useRef(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Prediksi dari webcamRef atau canvas
   *
   * @param {Object} source     - webcamRef (dari react-webcam) ATAU HTMLCanvasElement
   * @param {string} expectedLabel - Expected label (optional), e.g., 'A'
   */
  const predict = useCallback(
    async (source, expectedLabel = null) => {
      try {
        setIsLoading(true);
        setError(null);

        // ── Ambil video element dari webcamRef ──────────────────────────────
        // source bisa berupa: webcamRef, canvas element, atau canvas ref
        let videoEl = null;
        let canvasEl = null;

        if (source?.video instanceof HTMLVideoElement) {
          // Ini adalah webcamRef dari react-webcam
          videoEl = source.video;
        } else if (source?.current?.video instanceof HTMLVideoElement) {
          videoEl = source.current.video;
        } else if (source instanceof HTMLCanvasElement) {
          canvasEl = source;
        } else if (source?.current instanceof HTMLCanvasElement) {
          canvasEl = source.current;
        }

        let frameBlob;

        if (videoEl) {
          // ── Capture langsung dari video element (BERSIH, tanpa overlay) ──
          if (videoEl.readyState < 2) {
            throw new Error('Video belum siap');
          }

          const w = videoEl.videoWidth || 640;
          const h = videoEl.videoHeight || 480;

          // Reuse offscreen canvas
          if (!offscreenCanvasRef.current) {
            offscreenCanvasRef.current = document.createElement('canvas');
          }
          const offscreen = offscreenCanvasRef.current;
          offscreen.width = w;
          offscreen.height = h;
          const ctx = offscreen.getContext('2d');

          // ⚠️  Webcam di UI di-mirror (mirrored=true), tapi untuk model
          // kita kirim frame ASLI (tidak di-flip) agar sesuai data training.
          // Jika hasil debug_preprocess menunjukkan flip lebih baik,
          // ganti dengan blok ctx.scale(-1,1) di bawah.
          ctx.drawImage(videoEl, 0, 0, w, h);

          frameBlob = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Canvas to blob timeout')), 2000);
            offscreen.toBlob(
              (blob) => {
                clearTimeout(timer);
                blob ? resolve(blob) : reject(new Error('Failed to create blob'));
              },
              'image/jpeg',
              0.85,
            );
          });

        } else if (canvasEl) {
          // Fallback: canvas dikirim langsung (legacy)
          frameBlob = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('Canvas to blob timeout')), 2000);
            canvasEl.toBlob(
              (blob) => {
                clearTimeout(timer);
                blob ? resolve(blob) : reject(new Error('Failed to create blob'));
              },
              'image/jpeg',
              0.85,
            );
          });

        } else {
          throw new Error('Source tidak valid: berikan webcamRef atau canvas element');
        }

        console.log(`[API] Frame: ${(frameBlob.size / 1024).toFixed(1)}KB | Expected: ${expectedLabel}`);

        // ── Kirim ke Python API ─────────────────────────────────────────────
        const formData = new FormData();
        formData.append('file', frameBlob, 'frame.jpg');
        if (expectedLabel) {
          formData.append('expected', expectedLabel.toUpperCase());
        }

        const controller = new AbortController();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => controller.abort(), timeout);

        const res = await fetch(`${pythonApiUrl}/predict`, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.detail || `HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        console.log(`[API] Response: ${data.predicted_label} (${data.confidence}%) | correct: ${data.is_correct}`);

        if (!data.predicted_label || data.confidence === undefined) {
          throw new Error('Invalid response format from Python API');
        }

        setResponse(data);
        setIsLoading(false);
        return data;

      } catch (err) {
        setIsLoading(false);
        const errorMsg = err.name === 'AbortError' ? `Request timeout (${timeout}ms)` : err.message;
        setError(errorMsg);
        console.error('[usePythonPredict]', errorMsg);
        throw err;
      }
    },
    [pythonApiUrl, timeout],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { predict, response, isLoading, error, clearError };
};