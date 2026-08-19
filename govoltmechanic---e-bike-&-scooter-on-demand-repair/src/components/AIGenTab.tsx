import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Video,
  Upload,
  Play,
  Pause,
  Download,
  RotateCcw,
  Film,
  Layers,
  Wrench,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  Maximize2,
  RefreshCw,
  Sliders,
  Image as ImageIcon
} from 'lucide-react';
import { VideoGenerationItem } from '../types';

interface AIGenTabProps {
  onOpenBooking?: () => void;
}

const SAMPLE_PRESETS = [
  {
    title: 'Ather 450X Night Glide',
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Smooth cinematic tracking shot following an electric motorcycle gliding along an illuminated cyber city street at twilight, with subtle neon light reflections on the chassis.',
  },
  {
    title: 'Mobile Workshop Van & Tech',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Dynamic camera zoom out showing an EV mechanic technician inspecting high voltage lithium battery diagnostics with soft amber tool lighting and clean workshop background.',
  },
  {
    title: 'Ola S1 Pro Forest Sprint',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Low angle ultra smooth tracking shot of an electric scooter carving through a scenic mountain road, autumn leaves blowing gently across the pavement.',
  },
  {
    title: 'Futuristic Battery Swapping',
    image: 'https://images.unsplash.com/photo-1519752594763-2633d8d4ea29?auto=format&fit=crop&w=1200&q=80',
    prompt: 'Close-up slow motion shot of an electric vehicle lithium battery being slotted into a smart swap station with glowing turquoise indicator lights.',
  }
];

export const AIGenTab: React.FC<AIGenTabProps> = ({ onOpenBooking }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_PRESETS[0].image);
  const [selectedImageName, setSelectedImageName] = useState<string>(SAMPLE_PRESETS[0].title);
  const [prompt, setPrompt] = useState<string>(SAMPLE_PRESETS[0].prompt);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');
  
  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState<VideoGenerationItem | null>(null);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History
  const [videoHistory, setVideoHistory] = useState<VideoGenerationItem[]>([]);
  const [activePlaybackVideo, setActivePlaybackVideo] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollingIntervalRef = useRef<any>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('govolt_aigen_history');
      if (saved) {
        setVideoHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load video history', e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (items: VideoGenerationItem[]) => {
    setVideoHistory(items);
    try {
      localStorage.setItem('govolt_aigen_history', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save video history', e);
    }
  };

  // Clean up polling interval
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid JPG, PNG, or WebP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setSelectedImageName(file.name);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setSelectedImageName(file.name);
        setErrorMessage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Video Generation
  const handleGenerateVideo = async () => {
    if (!selectedImage) {
      setErrorMessage('Please select or upload an image to animate into video.');
      return;
    }
    if (!prompt.trim()) {
      setErrorMessage('Please provide animation instructions / prompt for the video.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGenerationProgress(5);
    setStatusMessage('Submitting request to Veo 3.1 Fast engine...');

    const newItem: VideoGenerationItem = {
      id: 'gen-' + Date.now(),
      operationName: '',
      prompt: prompt.trim(),
      aspectRatio,
      resolution,
      sourceImage: selectedImage,
      sourceImageName: selectedImageName,
      status: 'starting',
      progress: 5,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCurrentGeneration(newItem);

    try {
      // Step 1: POST to /api/generate-video
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageBase64: selectedImage,
          aspectRatio,
          resolution,
          model: 'veo-3.1-fast-generate-preview',
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to initialize Veo generation');
      }

      const operationName = data.operationName;
      newItem.operationName = operationName;
      newItem.status = 'processing';
      setCurrentGeneration({ ...newItem });
      setStatusMessage('Veo 3.1 is synthesizing dynamic physics & camera motion...');

      // Step 2: Poll operation until completed
      let attempts = 0;
      const maxAttempts = 120; // 10 minutes max with 5s intervals

      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

      pollingIntervalRef.current = setInterval(async () => {
        attempts++;
        const simulatedProgress = Math.min(92, 10 + Math.floor(attempts * 4));
        setGenerationProgress(simulatedProgress);

        try {
          const pollRes = await fetch('/api/video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName }),
          });
          const pollData = await pollRes.json();

          if (!pollRes.ok || pollData.error) {
            clearInterval(pollingIntervalRef.current);
            throw new Error(pollData.error || 'Video rendering failed');
          }

          if (pollData.done) {
            clearInterval(pollingIntervalRef.current);
            setGenerationProgress(96);
            setStatusMessage('Streaming finalized MP4 video buffer...');

            // Step 3: Download video blob
            const downloadRes = await fetch('/api/video-download', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ operationName }),
            });

            if (!downloadRes.ok) {
              throw new Error('Failed to retrieve video stream from Google storage');
            }

            const blob = await downloadRes.blob();
            const videoBlobUrl = URL.createObjectURL(blob);

            const completedItem: VideoGenerationItem = {
              ...newItem,
              status: 'completed',
              progress: 100,
              videoUrl: videoBlobUrl,
            };

            setCurrentGeneration(completedItem);
            setActivePlaybackVideo(videoBlobUrl);
            setIsGenerating(false);
            setGenerationProgress(100);
            setStatusMessage('Video generation completed successfully!');

            saveHistory([completedItem, ...videoHistory]);
          }
        } catch (pollErr: any) {
          clearInterval(pollingIntervalRef.current);
          setIsGenerating(false);
          setErrorMessage(pollErr.message || 'Error occurred while polling video generation');
          if (currentGeneration) {
            setCurrentGeneration({
              ...currentGeneration,
              status: 'failed',
              error: pollErr.message,
            });
          }
        }
      }, 5000);
    } catch (err: any) {
      console.error('Video gen error:', err);
      setIsGenerating(false);
      setErrorMessage(err.message || 'Failed to connect to Veo video generation server');
      if (currentGeneration) {
        setCurrentGeneration({
          ...currentGeneration,
          status: 'failed',
          error: err.message,
        });
      }
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedImage(preset.image);
    setSelectedImageName(preset.title);
    setPrompt(preset.prompt);
    setErrorMessage(null);
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = videoHistory.filter((item) => item.id !== id);
    saveHistory(updated);
    if (currentGeneration?.id === id) {
      setCurrentGeneration(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/70 via-slate-900/90 to-blue-950/70 border border-purple-500/30 overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 border border-purple-500/40 text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                VEO 3.1 FAST ENGINE
              </span>
              <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold rounded border border-cyan-500/30 uppercase">
                IMAGE TO VIDEO
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Animate Photos Into Cinematic Videos
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Upload any electric bike, scooter, workshop, or road photo and let Google's flagship <strong className="text-purple-300 font-mono">veo-3.1-fast-generate-preview</strong> model transform still images into fluid, ultra-realistic motion videos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 bg-black/40 border border-white/10 rounded-2xl flex items-center gap-3">
              <Film className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Supported Output</p>
                <p className="text-xs font-mono font-bold text-white">16:9 Landscape & 9:16 Reels</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-sm text-red-300 flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Generation Error</p>
            <p className="text-xs text-red-200 mt-0.5">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-xs text-red-400 hover:text-white underline font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Upload & Video Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Image Upload / Preset Picker Card */}
          <div className="p-6 bg-slate-900/80 border border-white/10 rounded-3xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  1. Select Source Image
                </h3>
              </div>
              <span className="text-xs text-slate-400">JPG, PNG, WebP</span>
            </div>

            {/* Dropzone & Preview Box */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center group ${
                selectedImage
                  ? 'border-purple-500/50 bg-black/40 min-h-[260px]'
                  : 'border-white/20 hover:border-cyan-400 bg-white/5 hover:bg-white/10 min-h-[220px]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {selectedImage ? (
                <div className="relative w-full h-full min-h-[260px] flex items-center justify-center bg-black/60">
                  <img
                    src={selectedImage}
                    alt={selectedImageName}
                    className="w-full h-64 object-contain rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                    <Upload className="w-8 h-8 text-cyan-400 animate-bounce" />
                    <span className="text-xs font-bold text-white bg-black/80 px-3 py-1.5 rounded-xl border border-white/20">
                      Click or Drop to Replace Image
                    </span>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-mono text-cyan-300 border border-white/10">
                    {selectedImageName}
                  </span>
                </div>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Drop your bike or scooter photo here</p>
                    <p className="text-xs text-slate-400 mt-1">or click to browse from device</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sample Presets */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                Or select a high-resolution demo photo:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SAMPLE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`group relative rounded-xl overflow-hidden border p-1 text-left transition-all ${
                      selectedImageName === preset.title
                        ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <img
                      src={preset.image}
                      alt={preset.title}
                      className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <p className="text-[10px] font-bold text-slate-200 mt-1.5 truncate px-1">
                      {preset.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Motion Prompt & Aspect Ratio Configuration */}
          <div className="p-6 bg-slate-900/80 border border-white/10 rounded-3xl space-y-5">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                2. Motion Prompt & Video Format
              </h3>
            </div>

            {/* Prompt Input */}
            <div>
              <label className="text-[11px] uppercase font-bold text-slate-400 block mb-2">
                Animation & Camera Motion Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe camera movement, lighting changes, physics, speed, weather, etc..."
                rows={3}
                className="w-full bg-slate-950 border border-white/10 focus:border-purple-400 rounded-2xl p-4 text-xs text-white placeholder:text-slate-600 focus:outline-none transition-colors"
              />
            </div>

            {/* Aspect Ratio & Resolution Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Aspect Ratio */}
              <div>
                <label className="text-[11px] uppercase font-bold text-slate-400 block mb-2">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      aspectRatio === '16:9'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>16:9 Landscape</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      aspectRatio === '9:16'
                        ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>9:16 Portrait</span>
                  </button>
                </div>
              </div>

              {/* Resolution */}
              <div>
                <label className="text-[11px] uppercase font-bold text-slate-400 block mb-2">
                  Resolution
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setResolution('720p')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      resolution === '720p'
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>720p Fast</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setResolution('1080p')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      resolution === '1080p'
                        ? 'bg-cyan-500 text-black border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>1080p HD</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Generate CTA Button */}
            <button
              type="button"
              onClick={handleGenerateVideo}
              disabled={isGenerating || !selectedImage}
              className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl active:scale-98 ${
                isGenerating || !selectedImage
                  ? 'bg-white/10 text-slate-500 cursor-not-allowed border border-white/5'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-[0_0_25px_rgba(168,85,247,0.5)]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Veo Generating Video ({generationProgress}%)...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                  <span>Generate Video with Veo 3.1</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Generation Player & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Generation & Video Player Card */}
          <div className="p-6 bg-slate-900/80 border border-white/10 rounded-3xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Video Output Studio
                </h3>
              </div>
              {currentGeneration?.status === 'completed' && (
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 text-[10px] font-mono font-bold rounded uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              )}
            </div>

            {/* Video Display Area */}
            <div className={`relative rounded-2xl bg-black overflow-hidden border border-white/10 flex items-center justify-center ${
              aspectRatio === '9:16' ? 'aspect-[9/16] max-h-[500px] mx-auto' : 'aspect-video'
            }`}>
              {isGenerating ? (
                <div className="p-6 text-center space-y-4 max-w-sm">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-purple-400 border-r-pink-500 animate-spin"></div>
                    <Sparkles className="w-7 h-7 text-purple-300 absolute inset-0 m-auto animate-pulse" />
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-sm font-bold text-white">Rendering Veo Video...</p>
                    <p className="text-xs text-slate-400">{statusMessage}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-300">{generationProgress}% Completed</span>
                </div>
              ) : activePlaybackVideo || currentGeneration?.videoUrl ? (
                <video
                  src={activePlaybackVideo || currentGeneration?.videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center space-y-3 text-slate-500">
                  <Film className="w-12 h-12 mx-auto stroke-[1.5]" />
                  <p className="text-xs">No video generated yet.</p>
                  <p className="text-[11px] text-slate-600">
                    Click "Generate Video with Veo 3.1" to animate the selected photo.
                  </p>
                </div>
              )}
            </div>

            {/* Video Action Controls if video exists */}
            {(activePlaybackVideo || currentGeneration?.videoUrl) && (
              <div className="flex items-center justify-between gap-3 pt-2">
                <a
                  href={activePlaybackVideo || currentGeneration?.videoUrl}
                  download="govolt-veo-animation.mp4"
                  className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4 Video</span>
                </a>
              </div>
            )}
          </div>

          {/* Video History Card */}
          <div className="p-6 bg-slate-900/80 border border-white/10 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Generation Library ({videoHistory.length})
                </h4>
              </div>
              {videoHistory.length > 0 && (
                <button
                  onClick={() => saveHistory([])}
                  className="text-[10px] text-slate-500 hover:text-red-400 uppercase font-bold transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {videoHistory.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Your generated videos will appear here.
              </p>
            ) : (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {videoHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (item.videoUrl) {
                        setActivePlaybackVideo(item.videoUrl);
                        setCurrentGeneration(item);
                      }
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                      currentGeneration?.id === item.id || activePlaybackVideo === item.videoUrl
                        ? 'bg-purple-500/20 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.sourceImage ? (
                        <img
                          src={item.sourceImage}
                          alt="Thumbnail"
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                          <Film className="w-5 h-5 text-purple-300" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 bg-purple-500/30 text-purple-300 rounded">
                            {item.aspectRatio}
                          </span>
                          <span className="text-[10px] text-slate-400">{item.createdAt}</span>
                        </div>
                        <p className="text-xs font-bold text-white truncate mt-0.5">{item.prompt}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
