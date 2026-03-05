import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/Button";
import { ProgressBar } from "../components/ProgressBar";
import { Stats, TurnResponse } from "../types";
import { DollarSign, BookOpen, Users, Zap, ArrowRight, Heart, Crown, Brain, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";

interface GameLoopProps {
  stats: Stats;
  scenario: string;
  options: string[];
  turn: number;
  maxTurns: number;
  onDecision: (decision: string) => void;
  lastConsequence: TurnResponse | null;
  onContinue: () => void;
  loading: boolean;
  imageLoading: boolean;
  imageUrl: string;
}

export function GameLoop({
  stats,
  scenario,
  options,
  turn,
  maxTurns,
  onDecision,
  lastConsequence,
  onContinue,
  loading,
  imageLoading,
  imageUrl,
}: GameLoopProps) {
  const showConsequence = !!lastConsequence;
  const [autoRead, setAutoRead] = useState(() => {
    return localStorage.getItem('autoRead') === 'true';
  });
  const [speaking, setSpeaking] = useState(false);

  const currentText = showConsequence 
    ? `${lastConsequence?.consequencia_imediata}. ${lastConsequence?.consequencia_futura}`
    : scenario;

  useEffect(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);

    if (autoRead && currentText && !loading) {
      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.lang = "pt-BR";
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
    
    return () => {
        window.speechSynthesis.cancel();
    };
  }, [currentText, autoRead, loading]);

  const toggleAutoRead = () => {
    const newValue = !autoRead;
    setAutoRead(newValue);
    localStorage.setItem('autoRead', String(newValue));
    
    if (!newValue) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Top Section: Image & Stats (Mobile) / Split View (Desktop) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left/Top: Visuals */}
        <div className="relative w-full lg:w-1/2 h-1/3 lg:h-full bg-black">
             <AnimatePresence mode="wait">
                {imageUrl && !imageLoading ? (
                    <motion.img 
                        key={imageUrl}
                        src={imageUrl} 
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        alt="Scenario Visualization" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                        <div className="w-12 h-12 border-4 border-zinc-800 border-t-cyan-500 rounded-full animate-spin" />
                    </div>
                )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-zinc-950" />
            
            {/* Turn Indicator Overlay */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="text-xs font-mono text-cyan-400">TURNO {turn}/{maxTurns}</span>
            </div>
        </div>

        {/* Right/Bottom: Narrative & Controls */}
        <div className="flex-1 flex flex-col bg-zinc-950 border-l border-zinc-900 relative z-10">
            
            {/* Stats Bar (Horizontal Scrollable) */}
            <div className="flex gap-4 p-4 overflow-x-auto border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-sm scrollbar-hide">
                <MiniStat icon={<DollarSign />} value={stats.dinheiro} color="text-emerald-500" label="Dinheiro" />
                <MiniStat icon={<BookOpen />} value={stats.conhecimento} color="text-blue-500" label="Conhecimento" />
                <MiniStat icon={<Users />} value={stats.relacionamentos} color="text-rose-500" label="Relacionamentos" />
                <MiniStat icon={<Zap />} value={stats.energia} color="text-amber-500" label="Energia" />
                <MiniStat icon={<Heart />} value={stats.saude} color="text-red-500" label="Saúde" />
                <MiniStat icon={<Crown />} value={stats.fama} color="text-yellow-500" label="Fama" />
                <MiniStat icon={<Brain />} value={stats.sanidade} color="text-purple-500" label="Sanidade" />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-12 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center h-full space-y-4"
                        >
                            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                            <p className="text-cyan-400 font-mono animate-pulse text-sm tracking-widest">
                                PROCESSANDO PROBABILIDADES...
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={showConsequence ? "consequence" : "scenario"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-2xl mx-auto w-full"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono border mb-4 ${showConsequence ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'}`}>
                                    {showConsequence ? "RELATÓRIO DE IMPACTO" : "CENÁRIO ATUAL"}
                                </span>
                                <button 
                                    onClick={toggleAutoRead}
                                    className={`p-2 rounded-full transition-colors ${autoRead ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' : 'hover:bg-zinc-800 text-zinc-400 hover:text-white'}`}
                                    title={autoRead ? "Desativar Leitura Automática" : "Ativar Leitura Automática"}
                                >
                                    {autoRead ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                                </button>
                            </div>

                            {showConsequence ? (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                                            Consequências
                                        </h2>
                                        <div className="space-y-6">
                                            <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                                                <h4 className="text-emerald-400 font-bold mb-2 text-sm uppercase tracking-wider">Imediato</h4>
                                                <p className="text-zinc-300 text-lg leading-relaxed">{lastConsequence?.consequencia_imediata}</p>
                                            </div>
                                            <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
                                                <h4 className="text-purple-400 font-bold mb-2 text-sm uppercase tracking-wider">Futuro</h4>
                                                <p className="text-zinc-300 text-lg leading-relaxed">{lastConsequence?.consequencia_futura}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button onClick={onContinue} size="lg" className="w-full py-6 text-lg">
                                        {(turn >= maxTurns || stats.saude <= 0 || stats.sanidade <= 0) ? "Ir para relatório" : "Continuar"} <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-2xl md:text-3xl leading-snug text-zinc-100 font-light mb-10">
                                        {scenario}
                                    </p>
                                    <div className="grid gap-4">
                                        {options.map((option, idx) => (
                                            <motion.button
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                onClick={() => onDecision(option)}
                                                className="group text-left p-5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500 hover:bg-zinc-800 transition-all duration-200 flex items-center justify-between"
                                            >
                                                <span className="text-zinc-300 group-hover:text-white text-lg">{option}</span>
                                                <ArrowRight className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ icon, value, color, label }: { icon: any, value: number, color: string, label: string }) {
    return (
        <div 
            className="group flex flex-col gap-1.5 px-3 py-2 bg-zinc-900/80 rounded-lg border border-zinc-800 transition-colors hover:border-zinc-700 hover:bg-zinc-900 shrink-0 cursor-default"
            title={label}
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center">
                    <div className={`w-4 h-4 ${color} shrink-0`}>{icon}</div>
                    <span className="text-xs font-medium text-zinc-400 max-w-0 opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 overflow-hidden whitespace-nowrap">
                        {label}
                    </span>
                </div>
                <span className={`text-sm font-bold font-mono ${value > 80 ? 'text-emerald-400' : value < 20 ? 'text-red-400' : 'text-zinc-300'}`}>
                    {value}
                </span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full rounded-full bg-current ${value > 80 ? 'text-emerald-500' : value < 20 ? 'text-red-500' : color}`}
                />
            </div>
        </div>
    )
}
