import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera as CameraIcon, Upload, X, CheckCircle2, Ruler, Palette, Sparkles } from 'lucide-react';
// We access pose and cam via window.Pose and window.Camera
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const VirtualStylist = ({ onClose }) => {
  const { setAIResult } = useStore();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [status, setStatus] = useState('Initialize your pose...');
  const [results, setResults] = useState(null);

  const processAnalysis = useCallback((landmarks, canvasElement) => {
    // 1. Calculate Estimated Height (simplified)
    const eyeY = landmarks[1].y;
    const heelY = Math.max(landmarks[29].y, landmarks[30].y);
    const pixelHeight = Math.abs(heelY - eyeY) * canvasElement.height;
    
    // Scale factor (assuming roughly 170cm height average in frame)
    const estHeight = Math.round(170 * (pixelHeight / (canvasElement.height * 0.7)));
    
    // 2. Estimate Build
    const shoulderWidth = Math.abs(landmarks[11].x - landmarks[12].x) * canvasElement.width;
    let size = 'M';
    if (shoulderWidth > 150) size = 'XL';
    else if (shoulderWidth > 120) size = 'L';
    else if (shoulderWidth < 90) size = 'S';

    // 3. Skin Tone & Season
    const ctx = canvasElement.getContext('2d');
    const foreheadX = landmarks[0].x * canvasElement.width;
    const foreheadY = (landmarks[0].y - 0.05) * canvasElement.height;
    const pixel = ctx.getImageData(foreheadX, foreheadY, 1, 1).data;
    
    const r = pixel[0], g = pixel[1], b = pixel[2];
    const brightness = (r + g + b) / 3;
    
    let season = 'Neutral';
    if (r > g && r > b) season = 'Warm';
    else if (b > r && b > g) season = 'Cool';

    return { height: estHeight, size, season, colors: [r, g, b] };
  }, []);

  useEffect(() => {
    let camera = null;
    const poseDetector = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    poseDetector.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    poseDetector.onResults((res) => {
      if (res.poseLandmarks && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(res.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw basic landmarks for feedback
        landmarksToDraw(ctx, res.poseLandmarks);

        if (isScanning && scanProgress < 100) {
          setScanProgress(prev => prev + 2);
          if (scanProgress >= 98) {
            const data = processAnalysis(res.poseLandmarks, canvasRef.current);
            setResults(data);
            setAIResult(data);
            setIsScanning(false);
            setStatus('Analysis Complete!');
          }
        }
      }
    });

    if (videoRef.current) {
      camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          await poseDetector.send({ image: videoRef.current });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    return () => {
      if (camera) camera.stop();
      poseDetector.close();
    };
  }, [isScanning, scanProgress, setAIResult, processAnalysis]);

  const landmarksToDraw = (ctx, points) => {
    ctx.fillStyle = '#6366f1';
    points.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x * ctx.canvas.width, pt.y * ctx.canvas.height, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
      >
        <div className="flex flex-col lg:flex-row h-full lg:h-[600px]">
          {/* Camera View */}
          <div className="flex-1 bg-black relative min-h-[300px]">
            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas ref={canvasRef} width="640" height="480" className="w-full h-full object-cover scale-x-[-1]" />
            
            {!results && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-64 h-80 border-2 border-dashed border-indigo-500/50 rounded-full mb-4 animate-pulse" />
                    <p className="text-white/70 text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                        {status}
                    </p>
                </div>
            )}

            {isScanning && (
                <div className="absolute bottom-10 left-10 right-10">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-indigo-500" 
                            initial={{ width: 0 }}
                            animate={{ width: `${scanProgress}%` }}
                        />
                    </div>
                    <p className="text-center text-xs text-indigo-400 mt-2 font-bold tracking-widest uppercase">Scanning Body Topology...</p>
                </div>
            )}
          </div>

          {/* Results / Controls */}
          <div className="w-full lg:w-80 bg-slate-800 p-8 flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                    Aura Analyst
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            {!results ? (
                <div className="flex-1 flex flex-col gap-4">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">1</div>
                            <p className="text-sm font-medium">Stand 3-5 ft away</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">2</div>
                            <p className="text-sm font-medium">Full body in frame</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">3</div>
                            <p className="text-sm font-medium">Good lighting helps</p>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setIsScanning(true); setScanProgress(0); setStatus('Analyzing...'); }}
                        disabled={isScanning}
                        className="w-full btn-primary py-4 mt-auto rounded-2xl flex items-center justify-center gap-3 text-lg"
                    >
                        <CameraIcon className="w-6 h-6" />
                        Start Scan
                    </button>
                    <label className="w-full py-3 text-center border border-white/10 rounded-2xl text-sm font-medium cursor-pointer hover:bg-white/5 transition-colors">
                        <input type="file" className="hidden" onChange={() => alert('Static image analysis coming soon!')} />
                        Upload Photo
                    </label>
                </div>
            ) : (
                <div className="flex-1 space-y-6">
                    <div className="text-center py-4">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                        <h3 className="text-xl font-bold text-white uppercase tracking-wider">Aura Found</h3>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div className="flex items-center gap-3">
                                <Ruler className="w-5 h-5 text-indigo-400" />
                                <span className="text-sm text-slate-400 font-medium">Fit Guide</span>
                            </div>
                            <span className="font-bold text-lg">{results.size}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                            <div className="flex items-center gap-3">
                                <Palette className="w-5 h-5 text-amber-400" />
                                <span className="text-sm text-slate-400 font-medium">Undertone</span>
                            </div>
                            <span className="font-bold">{results.season}</span>
                        </div>
                    </div>

                    <div className="mt-8 p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
                        <p className="text-xs text-indigo-300 font-bold uppercase tracking-widest mb-2">Style Insight</p>
                        <p className="text-sm text-slate-300 italic leading-relaxed">
                            "Based on your {results.season} undertones, we recommend rich, earthy palettes. Your {results.size} frame will look best in tailored silhouettes."
                        </p>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full btn-primary py-4 mt-6 rounded-2xl font-bold uppercase tracking-widest"
                    >
                        Apply Profile
                    </button>
                </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VirtualStylist;
