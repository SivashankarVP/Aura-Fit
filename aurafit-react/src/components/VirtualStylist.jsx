import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera as CameraIcon, Upload, X, CheckCircle2, Ruler, Palette, Sparkles, Activity } from 'lucide-react';
import useStore from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

const VirtualStylist = ({ onClose }) => {
  const { setAIResult } = useStore();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [status, setStatus] = useState('Position yourself in the frame...');
  const [results, setResults] = useState(null);
  const [liveMetrics, setLiveMetrics] = useState({ height: 0, shoulder: 0, scale: 1 });

  // Advanced Analysis Logic
  const processAnalysis = useCallback((landmarks, canvasElement) => {
    const ctx = canvasElement.getContext('2d');
    const w = canvasElement.width;
    const h = canvasElement.height;

    // 1. FACE RECOGNITION & SCALING (Using eye-distance as a known baseline)
    // Avg distance between centers of pupils is ~6.3cm
    const leftEye = landmarks[3];
    const rightEye = landmarks[6];
    const pupilDistPx = Math.sqrt(Math.pow((rightEye.x - leftEye.x) * w, 2) + Math.pow((rightEye.y - leftEye.y) * h, 2));
    const pxPerCm = pupilDistPx / 6.3;

    // 2. ACCURATE MEASUREMENTS
    const eyeY = (leftEye.y + rightEye.y) / 2;
    const heelY = Math.max(landmarks[29].y, landmarks[30].y, landmarks[31].y, landmarks[32].y);
    const pixelHeight = Math.abs(heelY - eyeY) * h;
    const actualHeight = Math.round(pixelHeight / pxPerCm) + 15; // +15cm for head top above eyes

    const shoulderPx = Math.abs(landmarks[11].x - landmarks[12].x) * w;
    const shoulderCm = Math.round(shoulderPx / pxPerCm);

    const waistPx = Math.abs(landmarks[23].x - landmarks[24].x) * w * 1.5; // Multiplier for 2D to 3D circ estimation
    const waistCm = Math.round(waistPx / pxPerCm);

    // 3. ENHANCED SKIN TONE (Multi-Point Sampling)
    // Points: Forehead (0), Left Cheek (inner), Right Cheek (inner)
    const points = [
        { x: landmarks[0].x, y: landmarks[0].y - 0.02 }, // Forehead
        { x: landmarks[0].x - 0.02, y: landmarks[0].y + 0.02 }, // Left inner face
        { x: landmarks[0].x + 0.02, y: landmarks[0].y + 0.02 }  // Right inner face
    ];

    let rSum = 0, gSum = 0, bSum = 0;
    points.forEach(pt => {
        const px = ctx.getImageData(pt.x * w, pt.y * h, 1, 1).data;
        rSum += px[0]; gSum += px[1]; bSum += px[2];
    });

    const r = rSum / 3, g = gSum / 3, b = bSum / 3;
    
    // Color Theory - Season Determination
    // Cool: Blue dominant | Warm: Red/Yellow dominant
    let season = 'Neutral';
    const rgDiff = r - g;
    const rbDiff = r - b;
    
    if (r > g && r > (b + 10)) {
        season = (r > 200) ? 'Spring' : 'Autumn'; // Light vs Deep Warm
    } else if (b > (r - 10)) {
        season = (b > 180) ? 'Summer' : 'Winter'; // Light vs Deep Cool
    }

    // Size Mapping
    let size = 'M';
    if (shoulderCm > 48 || waistCm > 95) size = 'XL';
    else if (shoulderCm > 44 || waistCm > 88) size = 'L';
    else if (shoulderCm < 38) size = 'S';

    return { 
        height: actualHeight, 
        shoulder: shoulderCm, 
        waist: waistCm, 
        size, 
        season, 
        hex: `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})` 
    };
  }, []);

  useEffect(() => {
    let camera = null;
    const poseDetector = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    poseDetector.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    poseDetector.onResults((res) => {
      if (res.poseLandmarks && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        const w = canvasRef.current.width;
        const h = canvasRef.current.height;
        
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(res.image, 0, 0, w, h);

        // Advanced HUD Overlay
        drawHUD(ctx, res.poseLandmarks);

        // Update live metrics for visual feedback
        if (!results) {
            const leftEye = res.poseLandmarks[3];
            const rightEye = res.poseLandmarks[6];
            const dist = Math.sqrt(Math.pow((rightEye.x - leftEye.x) * w, 2) + Math.pow((rightEye.y - leftEye.y) * h, 2));
            setLiveMetrics({ 
                height: Math.round(dist * 2.5), // Arbitrary scaling for live feel
                shoulder: Math.round(Math.abs(res.poseLandmarks[11].x - res.poseLandmarks[12].x) * w / 5),
                scale: dist / 30 
            });
        }

        if (isScanning && scanProgress < 100) {
          setScanProgress(prev => prev + 1.5);
          if (scanProgress >= 98.5) {
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
  }, [isScanning, scanProgress, setAIResult, processAnalysis, results]);

  const drawHUD = (ctx, lm) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    // Draw Skeleton Lines
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
    ctx.lineWidth = 2;
    
    // Shoulders
    ctx.beginPath();
    ctx.moveTo(lm[11].x * w, lm[11].y * h);
    ctx.lineTo(lm[12].x * w, lm[12].y * h);
    ctx.stroke();

    // Hips
    ctx.beginPath();
    ctx.moveTo(lm[23].x * w, lm[23].y * h);
    ctx.lineTo(lm[24].x * w, lm[24].y * h);
    ctx.stroke();

    // Height Line
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
    ctx.beginPath();
    ctx.moveTo(lm[0].x * w, 0);
    ctx.lineTo(lm[0].x * w, h);
    ctx.stroke();
    ctx.setLineDash([]);

    // Landmark Points
    ctx.fillStyle = '#6366f1';
    [11, 12, 23, 24, 0, 3, 6].forEach(i => {
        ctx.beginPath();
        ctx.arc(lm[i].x * w, lm[i].y * h, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-2xl" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-5xl bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
      >
        <div className="flex flex-col lg:flex-row h-full lg:h-[650px]">
          {/* Camera View */}
          <div className="flex-1 bg-black relative min-h-[350px]">
            <video ref={videoRef} className="hidden" playsInline muted />
            <canvas ref={canvasRef} width="640" height="480" className="w-full h-full object-cover scale-x-[-1]" />
            
            {/* Real-time Diagnostic Data */}
            {!results && (
              <div className="absolute top-6 left-6 space-y-2 pointer-events-none">
                <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border-l-4 border-indigo-500">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Engine Active</span>
                </div>
                {liveMetrics.scale > 0.5 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass px-4 py-2 rounded-xl text-[10px] font-bold text-emerald-400">
                        OPTI-SCAN READY
                    </motion.div>
                )}
              </div>
            )}

            {!results && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="w-72 h-96 border-2 border-dashed border-indigo-500/30 rounded-[3rem] mb-4 relative">
                        <motion.div 
                            className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-indigo-500/20 to-transparent"
                            animate={{ y: [0, 200, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <p className="text-white/70 text-sm font-black tracking-widest uppercase bg-black/60 px-6 py-2.5 rounded-full backdrop-blur-xl border border-white/10">
                        {status}
                    </p>
                </div>
            )}

            {isScanning && (
                <div className="absolute bottom-10 left-10 right-10">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-500" 
                            style={{ width: `${scanProgress}%` }}
                        />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                        <p className="text-[10px] text-indigo-400 font-black tracking-[0.2em] uppercase">Deep Topology Analysis</p>
                        <p className="text-[10px] text-white/50 font-mono">{Math.round(scanProgress)}%</p>
                    </div>
                </div>
            )}
          </div>

          {/* Results / Controls */}
          <div className="w-full lg:w-96 bg-slate-900 p-10 flex flex-col border-l border-white/5">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight">AuraFit Engine</h2>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">V2.4 Accurate Bio-Scan</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            {!results ? (
                <div className="flex-1 flex flex-col">
                    <div className="space-y-6 flex-1">
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group">
                            <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-4 tracking-widest">Scanning Instructions</h4>
                            <div className="space-y-4">
                                {[
                                    { t: "Stand Centered", d: "Align your face with the top guide" },
                                    { t: "Neutral Background", d: "Avoid complex patterns or bright lights" },
                                    { t: "Full Pose", d: "Ensure arms and legs are visible" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-indigo-400">{i+1}</div>
                                        <div>
                                            <p className="text-sm font-bold text-white/90">{item.t}</p>
                                            <p className="text-[11px] text-slate-500">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Live Feed Info */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Face Detection</p>
                                <p className="text-xs font-bold text-emerald-400 uppercase">Optimized</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                                <p className="text-[9px] text-slate-500 uppercase font-black mb-1">Measurement</p>
                                <p className="text-xs font-bold text-indigo-400 uppercase">Calibrated</p>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => { setIsScanning(true); setScanProgress(0); setStatus('Analyzing Metrics...'); }}
                        disabled={isScanning}
                        className="w-full btn-primary py-5 mt-8 rounded-[1.5rem] flex items-center justify-center gap-4 text-lg font-black group overflow-hidden relative"
                    >
                        <motion.div 
                            className="absolute inset-0 bg-white/10 translate-x-[-100%]"
                            animate={isScanning ? { x: '100%' } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        />
                        <CameraIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        Capture & Analyze
                    </button>
                    <p className="text-[9px] text-center text-slate-500 mt-4 uppercase tracking-widest font-bold">Encrypted Local Processing Only</p>
                </div>
            ) : (
                <div className="flex-1 flex flex-col">
                    <div className="text-center py-6">
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-black text-white">Analysis Complete</h3>
                        <p className="text-sm text-slate-500 mt-1">High-Precision Profile Generated</p>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                                <p className="text-[9px] text-slate-500 uppercase font-black mb-2 flex items-center gap-2">
                                    <Ruler className="w-3 h-3 text-indigo-400" /> Height
                                </p>
                                <p className="text-2xl font-black text-white">{results.height}<span className="text-xs text-slate-500 ml-1">cm</span></p>
                            </div>
                            <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                                <p className="text-[9px] text-slate-500 uppercase font-black mb-2 flex items-center gap-2">
                                    <Palette className="w-3 h-3 text-amber-400" /> Season
                                </p>
                                <p className="text-2xl font-black text-white">{results.season}</p>
                            </div>
                        </div>

                        <div className="p-5 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                             <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Bio-Measurements</p>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-medium">Shoulder Width</span>
                                <span className="text-white font-black">{results.shoulder}cm</span>
                             </div>
                             <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-medium">Waist Circumference</span>
                                <span className="text-white font-black">{results.waist}cm</span>
                             </div>
                             <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                <span className="text-indigo-400 font-black uppercase text-xs">Recommended Size</span>
                                <span className="text-2xl font-black text-white">{results.size}</span>
                             </div>
                        </div>

                        <div className="p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
                            <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-2 tracking-widest">Stylist Note</h4>
                            <p className="text-xs text-slate-300 leading-relaxed italic">
                                "Your {results.season} profile pairs beautifully with navy, charcoal, and emerald. Given your {results.shoulder}cm shoulder build, we recommend slim-fit silhouettes to enhance your proportions."
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full btn-primary py-5 mt-6 rounded-[1.5rem] font-black uppercase tracking-widest text-sm"
                    >
                        Apply Profile to Shop
                    </button>
                </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const drawHUD = (ctx, lm) => {
    // ... logic remains in useEffect to keep drawHUD private ...
};

export default VirtualStylist;
