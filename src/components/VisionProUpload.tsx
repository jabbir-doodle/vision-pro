'use client'
import React, { useState, useRef, useEffect } from "react";
import { CloudUpload, Settings } from "lucide-react";
import { motion, useMotionValue, useTransform, AnimatePresence, useSpring } from "framer-motion";
import { useTheme } from "./useTheme";

interface Props {
  onFileLoaded: (content: string) => void;
}

const VisionProUpload: React.FC<Props> = ({ onFileLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  // Particle system state - must be before any conditional returns
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, opacity: number}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Enhanced Motion values for Vision Pro liquid glass effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  // Use theme hook to handle hydration properly
  const { isDarkMode, isReady, toggleTheme } = useTheme();

  // Initialize particles - useEffect must be before conditional returns
  useEffect(() => {
    // Initialize floating particles
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.6 + 0.2
    }));
    setParticles(newParticles);
  }, []);

  // Show loading state until theme is ready
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const getProcessingMessage = (progress: number) => {
    if (progress < 25) return "🔍 Scanning file structure...";
    if (progress < 50) return "📊 Analyzing data...";
    if (progress < 75) return "🧠 Processing content...";
    if (progress < 95) return "✨ Finalizing...";
    return "🎉 Ready!";
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    
    setIsProcessing(true);
    
    // Animate progress
    for (let i = 0; i <= 100; i += 2) {
      setUploadProgress(i);
      setProcessingMessage(getProcessingMessage(i));
      await new Promise(resolve => setTimeout(resolve, 30));
    }
    
    const fileArray = Array.from(files);
    
    // Simple file processing for demo
    if (fileArray.length > 0) {
      const file = fileArray[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileLoaded(content);
        setIsProcessing(false);
        setUploadProgress(0);
      };
      reader.onerror = () => {
        alert(`Error reading file: ${file.name}`);
        setIsProcessing(false);
      };
      reader.readAsText(file);
    }
  };

  const UploadContent = ({ isDragging }: { isDragging: boolean }) => (
    <AnimatePresence mode="wait">
      {isDragging ? (
        <motion.div
          key="dragging"
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          {/* Animated upload icon with glow */}
          <motion.div 
            className="relative mb-6"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div 
              className="absolute inset-0 rounded-full blur-xl"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
                transform: 'scale(1.5)',
              }}
              animate={{
                scale: [1.5, 2, 1.5],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <CloudUpload className="relative w-16 h-16 text-white" />
          </motion.div>
          
          <motion.h3 
            className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            style={{ 
              textShadow: isDarkMode 
                ? '0 0 20px rgba(255, 255, 255, 0.3)' 
                : '0 2px 8px rgba(0, 0, 0, 0.1)' 
            }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Drop files here
          </motion.h3>
          <motion.p 
            className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Release to upload your files
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          key="idle"
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          {/* Upload icon with subtle animation */}
          <motion.div 
            className="relative mb-6 group"
            whileHover={{ scale: 1.05, rotateY: 10 }}
            style={{ perspective: 1000 }}
          >
            <motion.div 
              className="absolute inset-0 rounded-full blur-lg opacity-30"
              style={{
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                transform: 'scale(1.3)',
              }}
              animate={{
                scale: [1.3, 1.5, 1.3],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              whileHover={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(139, 92, 246, 0.2) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <CloudUpload className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
          
          <motion.h3 
            className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            style={{ 
              textShadow: isDarkMode 
                ? '0 0 20px rgba(255, 255, 255, 0.1)' 
                : '0 2px 8px rgba(0, 0, 0, 0.1)' 
            }}
          >
            Upload Files
          </motion.h3>
          
          <motion.p 
            className={`text-sm mb-6 text-center leading-relaxed max-w-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Drag and drop your files or click to browse
          </motion.p>

          {/* File format indicators */}
          <div className="flex flex-wrap justify-center gap-2 max-w-xs">
            {['.txt', '.json', '.log', '.csv', '.xml'].map((format, index) => (
              <motion.span
                key={format}
                className={`px-2 py-1 text-xs font-medium rounded-md ${
                  isDarkMode ? 'text-blue-200' : 'text-blue-700'
                }`}
                style={{
                  background: isDarkMode 
                    ? 'rgba(59, 130, 246, 0.1)' 
                    : 'rgba(59, 130, 246, 0.08)',
                  border: isDarkMode 
                    ? '1px solid rgba(59, 130, 246, 0.2)' 
                    : '1px solid rgba(59, 130, 246, 0.15)',
                  backdropFilter: 'blur(5px)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ 
                  scale: 1.05,
                  background: isDarkMode 
                    ? 'rgba(59, 130, 246, 0.15)' 
                    : 'rgba(59, 130, 246, 0.12)',
                  border: isDarkMode 
                    ? '1px solid rgba(59, 130, 246, 0.3)' 
                    : '1px solid rgba(59, 130, 246, 0.25)',
                }}
              >
                {format}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ProcessingAnimation = ({ progress }: { progress: number }) => (
    <motion.div 
      className="relative flex flex-col items-center justify-center p-12"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ perspective: 1000 }}
    >
      {/* Holographic background effect */}
      <motion.div 
        className="absolute inset-0 rounded-3xl"
        style={{
          background: `conic-gradient(from ${progress * 3.6}deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3), rgba(59, 130, 246, 0.3))`,
          backdropFilter: 'blur(40px) saturate(200%)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        }}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.05, 1],
        }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity }
        }}
      />

      {/* Dynamic particle explosions */}
      {particles.slice(0, 8).map((particle, index) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"
          style={{
            left: `${50 + Math.cos((index * 45 + progress * 2) * Math.PI / 180) * 80}px`,
            top: `${50 + Math.sin((index * 45 + progress * 2) * Math.PI / 180) * 80}px`,
          }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: index * 0.25,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 3D Neural Ring System */}
      <div className="relative">
        <motion.svg
          width="140"
          height="140"
          viewBox="0 0 140 140"
          className="absolute inset-0"
          style={{ 
            filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.8))',
          }}
        >
          {/* Background rings */}
          {[40, 50, 60].map((radius, index) => (
            <motion.circle
              key={index}
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke={`rgba(255, 255, 255, ${0.1 - index * 0.02})`}
              strokeWidth="1"
              animate={{ rotate: [0, 360] }}
              transition={{ 
                duration: 8 + index * 2, 
                repeat: Infinity, 
                ease: "linear",
                direction: index % 2 === 0 ? "normal" : "reverse"
              }}
              style={{ transformOrigin: '70px 70px' }}
            />
          ))}
          
          {/* Main progress ring */}
          <motion.circle
            cx="70"
            cy="70"
            r="55"
            fill="transparent"
            stroke="url(#advancedGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={345}
            strokeDashoffset={345 - (345 * progress) / 100}
            style={{ transformOrigin: '70px 70px', transform: 'rotate(-90deg)' }}
            animate={{
              filter: [
                'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))',
                'drop-shadow(0 0 25px rgba(139, 92, 246, 1))',
                'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          
          <defs>
            <linearGradient id="advancedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="33%" stopColor="#8b5cf6" />
              <stop offset="66%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
        </motion.svg>
        
        {/* Center holographic content */}
        <motion.div 
          className="relative z-10 w-[140px] h-[140px] flex flex-col items-center justify-center"
          style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <motion.div
            className="relative"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            style={{ perspective: 1000 }}
          >
            {/* Floating holographic layers */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 opacity-30"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-20"
              animate={{ scale: [1.1, 0.9, 1.1], rotate: [360, 180, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <Settings className="relative w-12 h-12 text-white z-10" />
          </motion.div>
          
          <motion.div 
            className="mt-3 text-center"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              {progress}%
            </div>
            <div className="text-xs text-blue-300 font-medium mt-1">Processing</div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Enhanced message display */}
      <motion.div 
        className="mt-8 text-center max-w-md"
        key={processingMessage}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.h3
          className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
          animate={{ 
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ 
            backgroundSize: '200% 200%',
            textShadow: '0 0 30px rgba(139, 92, 246, 0.5)'
          }}
        >
          {processingMessage}
        </motion.h3>
        
        {/* AI Processing indicators */}
        <div className="flex justify-center items-center space-x-4 mt-4">
          {['🧠', '⚡', '🔬'].map((icon, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm"
              animate={{
                scale: progress > (index + 1) * 25 ? [1, 1.3, 1] : 1,
                opacity: progress > (index + 1) * 25 ? [0.5, 1, 0.5] : 0.3,
              }}
              transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
            >
              <span className="text-sm">{icon}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        style={{
          background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          color: isDarkMode ? 'white' : 'black',
          border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
      
      {/* Premium Apple-style Background Environment */}
      <div className="absolute inset-0">
        {/* Theme-aware base background */}
        <div 
          className="absolute inset-0"
          style={{
            background: isDarkMode ? `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.4), transparent),
              radial-gradient(ellipse 60% 50% at 80% 50%, rgba(255, 119, 198, 0.3), transparent),
              radial-gradient(ellipse 60% 50% at 20% 80%, rgba(119, 198, 255, 0.3), transparent),
              linear-gradient(135deg, #000000 0%, #111827 50%, #1f2937 100%)
            ` : `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.1), transparent),
              radial-gradient(ellipse 60% 50% at 80% 50%, rgba(168, 85, 247, 0.08), transparent),
              radial-gradient(ellipse 60% 50% at 20% 80%, rgba(34, 197, 94, 0.08), transparent),
              linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)
            `
          }}
        />
        
        {/* Animated mesh gradients */}
        <motion.div 
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              `conic-gradient(from 0deg at 20% 30%, #667eea00, #764ba200, #f093fb00, #667eea40, #667eea00)`,
              `conic-gradient(from 60deg at 80% 20%, #667eea00, #764ba240, #f093fb00, #667eea00, #667eea00)`,
              `conic-gradient(from 120deg at 40% 70%, #667eea00, #764ba200, #f093fb40, #667eea00, #667eea00)`,
              `conic-gradient(from 180deg at 60% 50%, #667eea40, #764ba200, #f093fb00, #667eea00, #667eea00)`,
            ]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating geometric elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              width: `${60 + Math.random() * 100}px`,
              height: `${60 + Math.random() * 100}px`,
              background: `linear-gradient(${i * 45}deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.001))`,
              borderRadius: Math.random() > 0.5 ? '50%' : '20%',
              backdropFilter: 'blur(1px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}

        {/* Dynamic light rays */}
        <motion.div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              linear-gradient(45deg, transparent 40%, rgba(139, 69, 19, 0.1) 50%, transparent 60%),
              linear-gradient(-45deg, transparent 40%, rgba(25, 118, 210, 0.1) 50%, transparent 60%),
              linear-gradient(135deg, transparent 40%, rgba(156, 39, 176, 0.1) 50%, transparent 60%)
            `,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Particle system */}
        {particles.map((particle) => (
          <motion.div
            key={`particle-${particle.id}`}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, rgba(255, 255, 255, ${particle.opacity * 0.8}) 0%, transparent 70%)`,
              boxShadow: `0 0 ${particle.size * 2}px rgba(255, 255, 255, 0.2)`,
            }}
            animate={{
              y: [-50, -100, -150],
              opacity: [0, particle.opacity, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 10 + Math.random() * 5,
              repeat: Infinity,
              delay: particle.id * 1.5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
        {/* Ultra-Premium Vision Pro Interface */}
        <motion.div
          className="relative"
          style={{ 
            rotateX, 
            rotateY,
            transformStyle: "preserve-3d",
            perspective: 2000,
          }}
          onMouseMove={(e: React.MouseEvent) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            mouseX.set(e.clientX - centerX);
            mouseY.set(e.clientY - centerY);
            setMousePosition({ x: e.clientX - centerX, y: e.clientY - centerY });
          }}
          whileHover={{ scale: 1.008 }}
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        >
          {/* Theme-Aware Main Glass Panel */}
          <motion.div 
            className="relative overflow-hidden"
            style={{
              borderRadius: '32px',
              background: isDarkMode ? `
                linear-gradient(145deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.8) 100%),
                radial-gradient(ellipse at top, rgba(120, 119, 198, 0.2), transparent 50%),
                radial-gradient(ellipse at bottom right, rgba(255, 119, 198, 0.15), transparent 50%)
              ` : `
                linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.98) 50%, rgba(241, 245, 249, 0.95) 100%),
                radial-gradient(ellipse at top, rgba(59, 130, 246, 0.05), transparent 50%),
                radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.04), transparent 50%)
              `,
              backdropFilter: isDarkMode ? 'blur(40px) saturate(200%)' : 'blur(20px) saturate(180%)',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.18)' : '1px solid rgba(0, 0, 0, 0.1)',
              boxShadow: isDarkMode ? `
                0 32px 64px rgba(0, 0, 0, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -1px 0 rgba(255, 255, 255, 0.05),
                0 0 0 1px rgba(255, 255, 255, 0.05)
              ` : `
                0 32px 64px rgba(0, 0, 0, 0.1),
                inset 0 1px 0 rgba(255, 255, 255, 0.8),
                inset 0 -1px 0 rgba(0, 0, 0, 0.05),
                0 0 0 1px rgba(0, 0, 0, 0.05)
              `,
            }}
            whileHover={{
              boxShadow: isDarkMode ? `
                0 48px 96px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.15),
                inset 0 -1px 0 rgba(255, 255, 255, 0.08),
                0 0 0 1px rgba(255, 255, 255, 0.1)
              ` : `
                0 48px 96px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.9),
                inset 0 -1px 0 rgba(0, 0, 0, 0.08),
                0 0 0 1px rgba(0, 0, 0, 0.1)
              `,
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(0, 0, 0, 0.15)',
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Interactive light field */}
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `
                  radial-gradient(circle at ${50 + mousePosition.x * 0.02}% ${50 + mousePosition.y * 0.02}%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
                  radial-gradient(circle at ${80 + mousePosition.x * -0.01}% ${30 + mousePosition.y * 0.01}%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
                  radial-gradient(circle at ${20 + mousePosition.x * 0.015}% ${70 + mousePosition.y * -0.01}%, rgba(119, 198, 255, 0.15) 0%, transparent 50%)
                `,
              }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Premium Header Section */}
            <div className="relative z-10 text-center py-12 px-12">
              {/* Logo with Cinematic Glow */}
              <motion.div 
                className="mb-8 relative inline-block"
                initial={{ opacity: 0, scale: 0.8, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                whileHover={{ scale: 1.05, rotateY: 8 }}
                style={{ perspective: 1000 }}
              >
                {/* Multi-layer glow system */}
                <motion.div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(120, 119, 198, 0.6) 0%, rgba(120, 119, 198, 0.3) 30%, transparent 70%)',
                    filter: 'blur(25px)',
                    transform: 'scale(2.5)',
                  }}
                  animate={{
                    scale: [2.5, 3, 2.5],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(120, 119, 198, 0.4) 40%, transparent 70%)',
                    filter: 'blur(15px)',
                    transform: 'scale(1.8)',
                  }}
                  animate={{
                    scale: [1.8, 2.2, 1.8],
                    opacity: [0.3, 0.6, 0.3],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                  className="relative h-20 w-20 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center"
                  style={{ 
                    filter: 'drop-shadow(0 8px 32px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 0 rgba(120, 119, 198, 0.8))',
                  }}
                >
                  <CloudUpload className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              
              {/* Fixed Title with Solid Colors */}
              <motion.h1 
                className={`text-4xl font-bold mb-3 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                style={{ 
                  textShadow: isDarkMode 
                    ? '0 8px 32px rgba(255, 255, 255, 0.2)'
                    : '0 4px 16px rgba(0, 0, 0, 0.1)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 1 }}
              >
                Vision Pro Upload
              </motion.h1>
              
              <motion.p 
                className={`text-lg font-medium tracking-wide ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                } opacity-90`}
                style={{ 
                  textShadow: isDarkMode 
                    ? '0 4px 16px rgba(0, 0, 0, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                Experience the future of file uploads with Vision Pro UI
              </motion.p>

              {/* Subtle accent line */}
              <motion.div 
                className="mt-6 mx-auto w-24 h-px"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </div>

          {/* Upload Area with Liquid Glass */}
          <div className="relative z-10 p-8">
            <motion.div
              className="relative overflow-hidden rounded-2xl cursor-pointer"
              style={{
                background: isDragging 
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: isDragging 
                  ? '2px solid rgba(59, 130, 246, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isDragging
                  ? '0 25px 50px -12px rgba(59, 130, 246, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  : '0 10px 25px -5px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              }}
              whileHover={{
                scale: 1.005,
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
              whileTap={{ scale: 0.995 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onDragOver={(e: React.DragEvent) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e: React.DragEvent) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Liquid glass morphing effect */}
              <motion.div 
                className="absolute inset-0 opacity-30"
                style={{
                  background: isDragging
                    ? 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 70%)'
                    : 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 70%)',
                }}
                animate={{
                  scale: isDragging ? [1, 1.1, 1] : [1, 1.02, 1],
                  opacity: isDragging ? [0.3, 0.5, 0.3] : [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative z-10 p-10 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".log,.json,.txt,.csv,.xml"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                />

                {isProcessing ? (
                  <ProcessingAnimation progress={uploadProgress} />
                ) : (
                  <UploadContent isDragging={isDragging} />
                )}
              </div>
            </motion.div>

            {/* File Support Info with Glass Effect */}
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex justify-center space-x-4">
                {[
                  { icon: '📄', label: 'Text Files', desc: '.txt, .json, .log' },
                  { icon: '📊', label: 'Data Files', desc: '.csv, .xml' },
                  { icon: '⚡', label: 'Fast Upload', desc: 'Quick processing' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-center p-3 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                  >
                    <span className="text-lg mb-1">{item.icon}</span>
                    <span className={`text-xs font-medium mb-1 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>{item.label}</span>
                    <span className={`text-xs text-center ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{item.desc}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </div>
  );
};

export default VisionProUpload;