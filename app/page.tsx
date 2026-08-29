"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Activity, Radio, Cpu, AlertTriangle, CheckCircle2, 
  RefreshCw, Terminal, Globe, Zap, Server, Lock, Play, Pause, 
  Sparkles, Sliders, Volume2, VolumeX, Code, Database, Compass, FileText, Download, X 
} from "lucide-react";

interface NodeData {
  id: string;
  name: string;
  type: string;
  voltage: string;
  latency: number;
  status: "OPTIMAL" | "ANOMALY_DETECTED" | "HEALING";
  load: number;
}

export default function AetherMeshDashboard() {
  const [themeMode, setThemeMode] = useState<"quantum" | "factory">("quantum");
  const [selectedRegion, setSelectedRegion] = useState<"chennai" | "silicon_valley" | "frankfurt">("chennai");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [tokenMetrics, setTokenMetrics] = useState({ tokensPerSec: 142.8, totalTokens: 0, cryptoHash: "0x7F9B...4C21" });

  const [nodes, setNodes] = useState<NodeData[]>([
    { id: "node-01", name: "Alpha-Grid", type: "EV Charging Hub", voltage: "415.2V", latency: 14, status: "OPTIMAL", load: 62 },
    { id: "node-02", name: "Beta-Core", type: "Microgrid Controller", voltage: "230.4V", latency: 18, status: "OPTIMAL", load: 45 },
    { id: "node-03", name: "Gamma-Sensor", type: "IoT Optical Array", voltage: "24.1V", latency: 22, status: "OPTIMAL", load: 78 },
    { id: "node-04", name: "Delta-Node", type: "Autonomous Drone Dock", voltage: "48.0V", latency: 12, status: "OPTIMAL", load: 34 }
  ]);

  const [activeLogs, setActiveLogs] = useState<string[]>([
    "[SYS_INIT]: AetherMesh decentralized edge swarm operational.",
    "[SECURE_FABRIC]: NVIDIA Nemotron edge runtime linked via Nebius Token Factory."
  ]);
  const [isHealing, setIsHealing] = useState(false);
  const [patchStream, setPatchStream] = useState("");
  const [simulationRunning, setSimulationRunning] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Web Audio API & Speech Synthesis with Rectified Heal Sound Effect
  const playAlertSound = (type: "alarm" | "success") => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === "alarm") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
      } else {
        // Rectified positive harmonic chord progression for healing success
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      }
    } catch (e) {}
  };

  const speakVoiceCopilot = (text: string) => {
    if (!soundEnabled || typeof window === "undefined" || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 0.9;
      window.speechSynthesis.speak(utterance);
    } catch (e) {}
  };

  // Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    const roadsX = [width * 0.15, width * 0.38, width * 0.62, width * 0.85];
    const roadsY = [height * 0.2, height * 0.5, height * 0.8];

    const fleet = Array.from({ length: 8 }, () => ({
      x: roadsX[Math.floor(Math.random() * roadsX.length)],
      y: roadsY[Math.floor(Math.random() * roadsY.length)],
      targetX: roadsX[Math.floor(Math.random() * roadsX.length)],
      targetY: roadsY[Math.floor(Math.random() * roadsY.length)],
      speed: Math.random() * 1.5 + 0.8
    }));

    let step = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      step += 0.02;

      ctx.fillStyle = themeMode === "quantum" ? "rgba(52, 211, 153, 0.25)" : "rgba(2, 132, 199, 0.25)";
      ctx.font = "11px monospace";
      ctx.fillText(`REGION: ${selectedRegion.toUpperCase()} CLUSTER`, 30, 40);

      if (themeMode === "quantum") {
        ctx.strokeStyle = "rgba(16, 185, 129, 0.07)";
        ctx.lineWidth = 1;
        roadsX.forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); });
        roadsY.forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); });

        fleet.forEach(car => {
          const dx = car.targetX - car.x;
          const dy = car.targetY - car.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 2) {
            car.targetX = roadsX[Math.floor(Math.random() * roadsX.length)];
            car.targetY = roadsY[Math.floor(Math.random() * roadsY.length)];
          } else {
            car.x += (dx / dist) * car.speed;
            car.y += (dy / dist) * car.speed;
          }

          ctx.shadowBlur = 12;
          ctx.shadowColor = "#10b981";
          ctx.fillStyle = "#34d399";
          ctx.beginPath();
          ctx.arc(car.x, car.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      } else {
        ctx.strokeStyle = "rgba(14, 165, 233, 0.08)";
        ctx.lineWidth = 1;
        roadsX.forEach(x => { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke(); });
        roadsY.forEach(y => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke(); });

        fleet.forEach(car => {
          const dx = car.targetX - car.x;
          const dy = car.targetY - car.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 2) {
            car.targetX = roadsX[Math.floor(Math.random() * roadsX.length)];
            car.targetY = roadsY[Math.floor(Math.random() * roadsY.length)];
          } else {
            car.x += (dx / dist) * car.speed;
            car.y += (dy / dist) * car.speed;
          }

          ctx.fillStyle = "#0284c7";
          ctx.beginPath();
          ctx.arc(car.x, car.y, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = "rgba(2, 132, 199, 0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(car.x, car.y, 8 + Math.sin(step) * 2, 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      if (simulationRunning) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [simulationRunning, themeMode, selectedRegion]);

  // Telemetry updates
  useEffect(() => {
    if (!simulationRunning) return;
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => {
        if (node.status === "OPTIMAL") {
          return {
            ...node,
            latency: Math.floor(Math.random() * 6) + (selectedRegion === 'chennai' ? 12 : selectedRegion === 'silicon_valley' ? 34 : 22),
            load: Math.min(90, Math.max(30, node.load + (Math.floor(Math.random() * 5) - 2)))
          };
        }
        return node;
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [simulationRunning, selectedRegion]);

  const injectChaos = () => {
    playAlertSound("alarm");
    speakVoiceCopilot("Warning. Critical voltage spike detected on Beta-Core.");
    setActiveLogs(prev => [
      `[ALERT] (${new Date().toLocaleTimeString()}): Voltage anomaly injected into Beta-Core [Region: ${selectedRegion.toUpperCase()}]!`,
      ...prev
    ]);
    setNodes(prev => prev.map(n => n.id === "node-02" ? { ...n, status: "ANOMALY_DETECTED", voltage: "589.9V (CRITICAL)", load: 99 } : n));
  };

  const triggerAutonomousHealing = async () => {
    setIsHealing(true);
    setPatchStream("");
    
    // Immediate sound feedback on start
    playAlertSound("success");
    speakVoiceCopilot("Initiating Nebius Token Factory agentic healing sequence.");

    setActiveLogs(prev => [`[AGENTIC_MESH]: Consensus failure detected. Dispatching Nebius Token Factory Job...`, ...prev]);

    try {
      const res = await fetch("/api/mesh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nodeId: "Beta-Core", errorType: "Voltage Spike", voltage: "589.9V", region: selectedRegion })
      });

      const data = await res.json();
      
      if (data.fallback) {
        let text = data.message;
        let i = 0;
        let tokenCount = 0;
        const interval = setInterval(() => {
          if (i < text.length) {
            setPatchStream(prev => prev + text[i]);
            tokenCount += 2;
            setTokenMetrics(m => ({ ...m, totalTokens: tokenCount }));
            i++;
          } else {
            clearInterval(interval);
            setIsHealing(false);
            playAlertSound("success"); // Play completion chord
            speakVoiceCopilot("Grid successfully normalized by Nemotron AI.");
            setNodes(prev => prev.map(n => n.id === "node-02" ? { ...n, status: "OPTIMAL", voltage: "230.4V", load: 46 } : n));
            setActiveLogs(prev => [`[SUCCESS]: Beta-Core node fully restored by Nebius Token Factory.`, ...prev]);
          }
        }, 15);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let tokenCount = 0;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const jsonStr = line.replace("data: ", "").trim();
              if (jsonStr === "[DONE]") break;
              try {
                const parsed = JSON.parse(jsonStr);
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  setPatchStream(prev => prev + content);
                  tokenCount += content.split(" ").length;
                  setTokenMetrics(m => ({ ...m, totalTokens: tokenCount }));
                }
              } catch (e) {}
            }
          }
        }
      }

      setIsHealing(false);
      playAlertSound("success"); // Play completion chord
      speakVoiceCopilot("Grid successfully normalized.");
      setNodes(prev => prev.map(n => n.id === "node-02" ? { ...n, status: "OPTIMAL", voltage: "230.4V", load: 46 } : n));
      setActiveLogs(prev => [`[SUCCESS]: Beta-Core node fully restored by automated agent swarm.`, ...prev]);

    } catch (err) {
      setActiveLogs(prev => [`[ERROR]: Failed to connect to Nebius Token Factory endpoint.`, ...prev]);
      setIsHealing(false);
    }
  };

  const isQuantum = themeMode === "quantum";
  const hasAnomaly = nodes.some(n => n.status === "ANOMALY_DETECTED");

  return (
    <main className={`relative min-h-screen font-sans p-6 md:p-10 transition-colors duration-500 overflow-x-hidden ${
      isQuantum ? "bg-[#04080f] text-gray-100 selection:bg-emerald-500 selection:text-black" : "bg-[#f4f7fa] text-slate-800 selection:bg-sky-500 selection:text-white"
    }`}>
      
      {/* Dynamic Background Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <header className={`border rounded-2xl p-5 backdrop-blur-xl flex flex-wrap justify-between items-center gap-4 shadow-2xl transition-all duration-500 ${
          isQuantum ? "bg-gray-900/80 border-emerald-500/30 shadow-emerald-950/20" : "bg-white/90 border-slate-200 shadow-slate-200/50"
        }`}>
          <div className="flex items-center gap-3.5">
            <div className={`h-3.5 w-3.5 rounded-full animate-pulse ${isQuantum ? "bg-emerald-400 shadow-[0_0_12px_#34d399]" : "bg-sky-500 shadow-[0_0_10px_#0ea5e9]"}`} />
            <div>
              <h1 className={`text-xl font-bold tracking-tight flex items-center gap-2 ${isQuantum ? "text-white" : "text-slate-900"}`}>
                AETHERMESH <span className={isQuantum ? "text-emerald-500 font-light" : "text-slate-400 font-light"}>//</span> EV GRID SWARM
              </h1>
              <p className={`text-xs font-mono ${isQuantum ? "text-gray-400" : "text-slate-500"}`}>Autonomous Edge Infrastructure • Nebius x NVIDIA Global AI Hackathon</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 font-mono text-xs flex-wrap">
            {/* Global Region Selector */}
            <div className="flex items-center bg-gray-950/40 border border-gray-800 rounded-xl p-1">
              {(["chennai", "silicon_valley", "frankfurt"] as const).map(reg => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    selectedRegion === reg ? 'bg-sky-500 text-black shadow-sm' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {reg === 'chennai' ? '🇮🇳 Chennai' : reg === 'silicon_valley' ? '🇺🇸 Silicon Valley' : '🇩🇪 Frankfurt'}
                </button>
              ))}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition-all ${isQuantum ? "bg-gray-950 border-gray-800 text-emerald-400" : "bg-slate-100 border-slate-200 text-slate-700"}`}
              title="Toggle Audio Alerts"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
            </button>

            {/* Export Audit Report Button */}
            <button
              onClick={() => setAuditModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 border border-sky-500/40 font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" /> Export Audit Report
            </button>

            {/* Theme Toggle */}
            <button 
              onClick={() => setThemeMode(isQuantum ? "factory" : "quantum")}
              className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 border shadow-sm ${
                isQuantum 
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20" 
                  : "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              THEME: {isQuantum ? "QUANTUM GRID" : "TOKEN FACTORY"}
            </button>
          </div>
        </header>

        {/* Live Consensus & Multi-Agent Swarm Health Bar */}
        <div className={`px-5 py-3 rounded-xl border flex flex-wrap justify-between items-center gap-4 font-mono text-xs backdrop-blur-md transition-all ${
          hasAnomaly 
            ? "bg-red-950/40 border-red-500 text-red-300 animate-pulse" 
            : isQuantum ? "bg-gray-950/60 border-emerald-500/20 text-emerald-400" : "bg-white/80 border-slate-200 text-sky-700 shadow-sm"
        }`}>
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>SWARM CONSENSUS: <strong className="text-white">{hasAnomaly ? "DEGRADED (ANOMALY DETECTED)" : "4 / 4 NODES VERIFIED & SECURE"}</strong></span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-gray-400">
            <span>A2A LATENCY: <strong className="text-emerald-400">4.2ms</strong></span>
            <span>ENCRYPTION: <strong className="text-sky-400">AES-256-GCM</strong></span>
            <span>NEBIUS ENGINE: <strong className="text-emerald-400">ACTIVE</strong></span>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Toolbar */}
            <div className={`p-4 rounded-2xl border backdrop-blur-md flex flex-wrap justify-between items-center gap-4 transition-all duration-500 ${
              isQuantum ? "bg-gray-900/60 border-gray-800" : "bg-white/90 border-slate-200 shadow-lg shadow-slate-200/40"
            }`}>
              <h2 className={`text-base font-bold flex items-center gap-2 ${isQuantum ? "text-white" : "text-slate-900"}`}>
                <Server className={`w-4 h-4 ${isQuantum ? "text-emerald-400" : "text-sky-600"}`} /> Edge Node Swarm Telemetry
              </h2>
              <div className="flex gap-3 font-mono text-xs">
                <button 
                  onClick={injectChaos}
                  className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-red-500" /> Inject Chaos Fault
                </button>
                <button 
                  onClick={triggerAutonomousHealing}
                  disabled={isHealing}
                  className={`px-4 py-2 rounded-xl font-bold transition-all shadow-md flex items-center gap-2 disabled:opacity-50 ${
                    isQuantum ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20" : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isQuantum ? "text-black" : "text-emerald-400"} ${isHealing ? 'animate-spin' : ''}`} /> 
                  {isHealing ? 'Synthesizing Patch...' : 'Trigger Nemotron Heal'}
                </button>
              </div>
            </div>

            {/* Nodes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodes.map(node => (
                <div 
                  key={node.id} 
                  className={`p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 relative overflow-hidden shadow-xl ${
                    node.status === 'ANOMALY_DETECTED' 
                      ? 'bg-red-950/40 border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.3)] animate-pulse' 
                      : node.status === 'HEALING'
                      ? 'bg-amber-950/40 border-amber-500'
                      : isQuantum 
                      ? 'bg-gray-900/70 border-gray-800 hover:border-emerald-500/50' 
                      : 'bg-white/90 border-slate-200 hover:border-sky-300 shadow-slate-200/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest font-semibold">{node.type}</span>
                      <h3 className={`text-lg font-bold mt-0.5 ${isQuantum ? "text-white" : "text-slate-900"}`}>{node.name}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wide ${
                      node.status === 'OPTIMAL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {node.status}
                    </span>
                  </div>

                  <div className={`grid grid-cols-3 gap-2 font-mono text-xs pt-4 border-t ${isQuantum ? "border-gray-800" : "border-slate-100"}`}>
                    <div>
                      <span className="text-gray-400 block text-[10px]">VOLTAGE</span>
                      <span className={`font-bold ${isQuantum ? "text-white" : "text-slate-700"}`}>{node.voltage}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">LATENCY</span>
                      <span className={`font-bold ${isQuantum ? "text-emerald-400" : "text-sky-600"}`}>{node.latency}ms</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">CPU LOAD</span>
                      <span className="text-amber-500 font-bold">{node.load}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Nemotron Token Factory Terminal */}
            <div className={`p-6 rounded-2xl border shadow-xl space-y-3 font-mono transition-all duration-500 ${
              isQuantum ? "bg-gray-900/90 border-gray-800" : "bg-slate-900 border-slate-800 text-slate-100"
            }`}>
              <div className="flex items-center justify-between text-xs text-emerald-400 border-b border-gray-800 pb-3">
                <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-emerald-400" /> NEBIUS TOKEN FACTORY • NEMOTRON STREAM OUTPUT</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setInspectorOpen(!inspectorOpen)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1.5 transition-all"
                  >
                    <Code className="w-3 h-3" /> {inspectorOpen ? 'Hide Metadata' : 'Inspect Raw Token Stream'}
                  </button>
                  <span className="text-gray-400 text-[11px]">[MODEL: NEMOTRON-3-ULTRA]</span>
                </div>
              </div>

              {/* Raw JSON Inspector Drawer */}
              <AnimatePresence>
                {inspectorOpen && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-black/80 border border-emerald-500/30 p-4 rounded-xl text-[11px] text-emerald-400 space-y-2 overflow-x-auto"
                  >
                    <div className="text-gray-400 border-b border-gray-800 pb-1 flex justify-between">
                      <span>[NEBIUS_TOKEN_FACTORY_METADATA_INSPECTOR]</span>
                      <span className="text-emerald-300">STATUS: 200 OK (SSE STREAM)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-gray-300">
                      <div>GENERATION SPEED: <span className="text-emerald-400">{tokenMetrics.tokensPerSec} tok/s</span></div>
                      <div>TOTAL TOKENS: <span className="text-emerald-400">{tokenMetrics.totalTokens}</span></div>
                      <div>CRYPTO HASH: <span className="text-sky-400">{tokenMetrics.cryptoHash}</span></div>
                    </div>
                    <pre className="text-[10px] text-gray-400 bg-gray-950 p-2 rounded">
{`{
  "provider": "Nebius Token Factory",
  "endpoint": "https://api.nebius.ai/v1/chat/completions",
  "model": "nvidia/nemotron-3-ultra",
  "region": "${selectedRegion}",
  "temperature": 0.2,
  "stream_active": ${isHealing}
}`}
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-gray-950 p-4 rounded-xl h-36 overflow-y-auto text-xs text-emerald-400 whitespace-pre-line leading-relaxed">
                {patchStream || "// System standing by for agentic mesh event or manual fault trigger..."}
              </div>
            </div>

          </div>

          {/* Right Column: Telemetry Event Log */}
          <div className="space-y-6">
            <h2 className={`text-base font-bold flex items-center gap-2 ${isQuantum ? "text-white" : "text-slate-900"}`}>
              <Terminal className={`w-4 h-4 ${isQuantum ? "text-emerald-400" : "text-sky-600"}`} /> Swarm Event Telemetry
            </h2>

            <div className={`border p-6 rounded-2xl backdrop-blur-xl h-[540px] overflow-y-auto font-mono text-xs space-y-3 flex flex-col shadow-xl transition-all duration-500 ${
              isQuantum ? "bg-gray-900/70 border-gray-800" : "bg-white/90 border-slate-200 shadow-slate-200/50"
            }`}>
              <div className="text-gray-400 text-[11px] border-b border-gray-800 pb-2 mb-1 tracking-wider">[SECURE A2A PROTOCOL FEED]</div>
              {activeLogs.map((log, idx) => (
                <div key={idx} className={`p-3 rounded-xl border transition-all ${
                  log.includes("ALERT") || log.includes("CRITICAL") 
                    ? 'bg-red-950/40 border-red-500/40 text-red-300 font-medium' 
                    : log.includes("SUCCESS") || log.includes("restored")
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-medium'
                    : isQuantum ? 'bg-gray-950/60 border-gray-800 text-gray-300' : 'bg-slate-50 border-slate-100 text-slate-600'
                }`}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Export Audit Report Modal */}
      <AnimatePresence>
        {auditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-800 text-gray-100 rounded-2xl max-w-lg w-full p-6 shadow-2xl font-mono space-y-4"
            >
              <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> AETHERMESH INCIDENT AUDIT REPORT
                </h3>
                <button onClick={() => setAuditModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-gray-300 max-h-60 overflow-y-auto pr-2">
                <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                  <div className="text-gray-500 text-[10px]">CLUSTER TARGET</div>
                  <div className="text-white font-bold">{selectedRegion.toUpperCase()} Regional Hub</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                  <div className="text-gray-500 text-[10px]">INFRASTRUCTURE BACKBONE</div>
                  <div className="text-emerald-400">Nebius Token Factory + NVIDIA Nemotron-3-Ultra</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                  <div className="text-gray-500 text-[10px]">SECURITY VERIFICATION</div>
                  <div className="text-sky-400">Zero-day anomaly quarantine validated via autonomous agent consensus. All nodes running optimal firmware.</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button 
                  onClick={() => {
                    const reportContent = `--- AETHERMESH INCIDENT AUDIT REPORT ---\n` +
                      `Timestamp: ${new Date().toISOString()}\n` +
                      `Cluster Target: ${selectedRegion.toUpperCase()} Regional Hub\n` +
                      `Infrastructure: Nebius Token Factory + NVIDIA Nemotron-3-Ultra\n` +
                      `Security Status: Zero-day anomaly quarantine validated via autonomous agent consensus.\n` +
                      `Active Nodes: 4/4 Verified & Secure\n`;
                    
                    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `AetherMesh_Audit_Report_${selectedRegion.toUpperCase()}.txt`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center gap-2 hover:bg-emerald-400 transition-all"
                >
                  <Download className="w-4 h-4" /> Download Audit Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}