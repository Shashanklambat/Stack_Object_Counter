import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Camera,
  X,
  Download,
  RefreshCw,
  ImageIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface CountResult {
  count: number;
  image: string;
}

const isLikelyHexJpeg = (value: string) => {
  const v = value.trim();
  return v.length > 10 && v.startsWith("ffd8") && /^[0-9a-fA-F]+$/.test(v);
};

const hexToBase64 = (hex: string) => {
  const clean = hex.trim();
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  }

  // Convert bytes -> base64 in chunks to avoid call stack issues
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

const CounterTool = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CountResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG)");
      return;
    }

    setSelectedFile(file);
    setError(null);
    setResult(null);
    setCameraError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Stop camera if active
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      setError(null);
      setResult(null);
      setSelectedImage(null);
      setSelectedFile(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError("Camera is not supported in this browser.");
        return;
      }

      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
      } catch {
        // Fallback for devices/iframes that reject advanced constraints
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      }

      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(
        "Camera access denied or unavailable. Please allow camera permissions and try again."
      );
    }
  };

  // Attach stream to video element when camera becomes active
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(console.error);
    }
  }, [isCameraActive]);

  const captureImage = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setSelectedImage(dataUrl);

      // Convert to file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "captured-image.jpg", {
            type: "image/jpeg",
          });
          setSelectedFile(file);
        }
      }, "image/jpeg");

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        setIsCameraActive(false);
      }
    }
  }, []);

  const countObjects = async () => {
    if (!selectedFile) {
      setError("Please select or capture an image first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        "https://shashanklambat-counter.hf.space/count",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      const rawImage = String(data.image ?? "");
      let imageSrc = rawImage;

      if (rawImage.startsWith("data:")) {
        imageSrc = rawImage;
      } else if (rawImage.startsWith("http://") || rawImage.startsWith("https://")) {
        imageSrc = rawImage;
      } else if (isLikelyHexJpeg(rawImage)) {
        imageSrc = `data:image/jpeg;base64,${hexToBase64(rawImage)}`;
      } else if (rawImage) {
        // Assume base64 without prefix
        imageSrc = `data:image/jpeg;base64,${rawImage}`;
      }

      setResult({
        count: Number(data.total_count ?? data.count ?? 0),
        image: imageSrc,
      });
    } catch (err) {
      console.error("Count error:", err);
      setError("Failed to process image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!result?.image) return;

    const link = document.createElement("a");
    link.href = result.image;
    link.download = "counted-objects.jpg";
    link.click();
  };

  const resetTool = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setCameraError(null);
    setIsCameraActive(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <section id="counter" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Object Counting Tool
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload an image or use your camera to count stacked objects
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Input */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-6">Input Image</h3>

              {/* Upload Zone */}
              {!isCameraActive && !selectedImage && (
                <div
                  className={`upload-zone cursor-pointer mb-6 ${
                    isDragOver ? "dragover" : ""
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-medium mb-2">Drop your image here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (JPG, PNG)
                    </p>
                  </div>
                </div>
              )}

              {/* Camera View */}
              {isCameraActive && (
                <div className="relative mb-6 rounded-xl overflow-hidden bg-muted aspect-video">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <button
                      onClick={captureImage}
                      className="btn-ripple px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-elevated"
                    >
                      <Camera className="w-5 h-5 inline mr-2" />
                      Capture Image
                    </button>
                  </div>
                </div>
              )}

              {/* Image Preview */}
              {selectedImage && !isCameraActive && (
                <div className="relative mb-6 rounded-xl overflow-hidden bg-muted animate-scale-in">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-auto max-h-80 object-contain"
                  />
                  <button
                    onClick={resetTool}
                    className="absolute top-3 right-3 p-2 bg-background/80 rounded-full hover:bg-background transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Camera Error */}
              {cameraError && (
                <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl mb-6">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{cameraError}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {!isCameraActive && (
                  <button
                    onClick={startCamera}
                    className="flex-1 min-w-[140px] btn-ripple px-4 py-3 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    <Camera className="w-5 h-5 inline mr-2" />
                    Use Camera
                  </button>
                )}

                {isCameraActive && (
                  <button
                    onClick={resetTool}
                    className="flex-1 min-w-[140px] px-4 py-3 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors"
                  >
                    <X className="w-5 h-5 inline mr-2" />
                    Cancel
                  </button>
                )}

                <button
                  onClick={countObjects}
                  disabled={!selectedImage || isLoading}
                  className="flex-1 min-w-[140px] btn-ripple px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                      Counting...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 inline mr-2" />
                      Count Objects
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-6">Results</h3>

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                  </div>
                  <p className="text-lg font-medium loader-pulse">
                    AI detecting objects...
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    This may take a few seconds
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-destructive" />
                  </div>
                  <p className="text-lg font-medium text-destructive mb-2">
                    Detection Failed
                  </p>
                  <p className="text-sm text-muted-foreground text-center mb-6">
                    {error}
                  </p>
                  <button
                    onClick={resetTool}
                    className="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && !result && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">
                    Upload an image or capture one to see results
                  </p>
                </div>
              )}

              {/* Result State */}
              {result && !isLoading && (
                <div className="result-reveal">
                  {/* Count Badge */}
                  <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-success/10 border border-success/20 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                    <span className="text-2xl font-bold">
                      <span className="font-mono text-success">{result.count}</span>{" "}
                      objects detected
                    </span>
                  </div>

                  {/* Annotated Image */}
                  <div className="rounded-xl overflow-hidden bg-muted mb-6">
                    <img
                      src={result.image}
                      alt="Annotated result"
                      className="w-full h-auto"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={downloadImage}
                      className="flex-1 btn-ripple px-4 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <Download className="w-5 h-5 inline mr-2" />
                      Download Image
                    </button>
                    <button
                      onClick={resetTool}
                      className="flex-1 px-4 py-3 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      <RefreshCw className="w-5 h-5 inline mr-2" />
                      Upload Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CounterTool;
