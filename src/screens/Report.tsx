import { motion } from "motion/react";
import { Button } from "../components/Button";
import { Stats, PlayerProfile } from "../types";
import { Trophy, TrendingUp, Activity, RefreshCw, Skull, Heart, Crown, Brain, User, MapPin, Film, Loader2, List, BookOpen } from "lucide-react";
import { ReactNode, useState } from "react";
import { generateStoryVideo } from "../services/gemini";

interface ReportProps {
  stats: Stats;
  profile: string;
  estiloJogo: string;
  summary: string;
  analysis: string;
  conclusaoObjetivo: string;
  lifeOutcome: string;
  playerProfile: PlayerProfile | null;
  history: string[];
  onRestart: () => void;
}

export function Report({
  stats,
  profile,
  estiloJogo,
  summary,
  analysis,
  conclusaoObjetivo,
  lifeOutcome,
  playerProfile,
  history,
  onRestart,
}: ReportProps) {
  // ... (rest of the component)
  // Inside the component return:
  // Update the Narrative & Outcome section
  // Add Estilo de Jogo section
  // ...

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoError(null);
    try {
      const url = await generateStoryVideo(summary, lifeOutcome);
      setVideoUrl(url);
    } catch (err) {
      console.error(err);
      setVideoError("Erro ao gerar o vídeo. Tente novamente mais tarde.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            RELATÓRIO FINAL
          </h2>
          <p className="text-zinc-400 font-mono uppercase tracking-widest">
            SIMULAÇÃO CONCLUÍDA
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* Character Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-purple-500" />
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-4 border-2 border-zinc-700">
                        <User className="w-10 h-10 text-zinc-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{playerProfile?.name || "Desconhecido"}</h3>
                    <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                        <MapPin className="w-3 h-3" />
                        {playerProfile?.location || "N/A"}
                    </div>
                </div>
                
                <div className="space-y-4 border-t border-zinc-800 pt-6">
                    <StatRow label="Dinheiro" value={stats.dinheiro} />
                    <StatRow label="Conhecimento" value={stats.conhecimento} />
                    <StatRow label="Relacionamentos" value={stats.relacionamentos} />
                    <StatRow label="Energia" value={stats.energia} />
                    <StatRow label="Saúde" value={stats.saude} icon={<Heart className="w-4 h-4 text-red-500" />} />
                    <StatRow label="Fama" value={stats.fama} icon={<Crown className="w-4 h-4 text-yellow-500" />} />
                    <StatRow label="Sanidade" value={stats.sanidade} icon={<Brain className="w-4 h-4 text-purple-500" />} />
                </div>
            </div>
          </motion.div>

          {/* Narrative & Outcome */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
             <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Skull className="w-6 h-6 text-rose-500" />
                <h3 className="text-xl font-bold text-white">Destino Final</h3>
              </div>
              <p className="text-white text-xl leading-relaxed font-light border-l-4 border-rose-500 pl-6 italic">
                "{lifeOutcome}"
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <h4 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Perfil e Estilo
                    </h4>
                    <p className="text-zinc-300 text-sm leading-relaxed mb-2"><span className="font-bold text-white">Perfil:</span> {profile}</p>
                    <p className="text-zinc-300 text-sm leading-relaxed"><span className="font-bold text-white">Estilo de Jogo:</span> {estiloJogo}</p>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                    <h4 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4" /> Análise Estratégica
                    </h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">{analysis}</p>
                </div>
                
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl md:col-span-2">
                    <h4 className="text-cyan-400 font-bold mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4" /> Conclusão do Objetivo
                    </h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">{conclusaoObjetivo}</p>
                </div>
            </div>
            
            <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                <h4 className="text-zinc-400 font-bold mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> Resumo da Trajetória
                </h4>
                <p className="text-zinc-300 text-sm leading-relaxed">{summary}</p>
            </div>

          </motion.div>
        </div>
        
        {/* ... (rest of the component) */}


        {/* History Table Section */}
        {history && history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl mb-12 backdrop-blur-sm overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-6">
              <List className="w-6 h-6 text-cyan-400" />
              <h3 className="text-2xl font-bold text-white">Histórico de Decisões</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-medium">Turno</th>
                    <th className="p-4 font-medium">Decisão</th>
                    <th className="p-4 font-medium">Consequência Imediata</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300 text-sm">
                  {history.map((item, index) => {
                    const match = item.match(/Turno (\d+):\s*(.*?)\s*->\s*(.*)/);
                    if (match) {
                      const [, turn, decision, consequence] = match;
                      return (
                        <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                          <td className="p-4 font-mono text-cyan-500">{turn}</td>
                          <td className="p-4 font-medium text-white">{decision}</td>
                          <td className="p-4 text-zinc-400">{consequence}</td>
                        </tr>
                      );
                    }
                    // Fallback if format doesn't match
                    return (
                      <tr key={index} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="p-4" colSpan={3}>{item}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl mb-12 flex flex-col items-center backdrop-blur-sm"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Film className="w-7 h-7 text-cyan-400" />
            Trailer da Sua Vida
          </h3>

          {videoUrl ? (
            <video controls src={videoUrl} className="w-full max-w-4xl rounded-xl shadow-2xl border border-zinc-800" />
          ) : isGeneratingVideo ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
              <Loader2 className="w-12 h-12 animate-spin text-cyan-500 mb-6" />
              <p className="text-xl font-medium text-white">Dirigindo o seu trailer...</p>
              <p className="text-sm mt-3 text-center max-w-md">
                A inteligência artificial está renderizando um vídeo baseado na sua história. Isso pode levar alguns minutos, não feche a página.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <p className="text-zinc-400 mb-8 max-w-xl text-lg">
                Gere um vídeo curto e cinemático narrando os principais momentos da sua jornada e o seu destino final.
              </p>
              <Button onClick={handleGenerateVideo} size="lg" className="bg-cyan-600 hover:bg-cyan-500 text-white border-none">
                <Film className="w-5 h-5 mr-2" />
                Gerar Vídeo da História
              </Button>
              {videoError && <p className="text-red-400 mt-4 text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{videoError}</p>}
            </div>
          )}
        </motion.div>

        <div className="flex justify-center">
          <Button onClick={onRestart} size="lg" variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reiniciar Simulação
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

function StatRow({ label, value, icon }: { label: string; value: number; icon?: ReactNode }) {
    return (
        <div className="flex flex-col gap-2 border-b border-zinc-800 pb-3 last:border-0">
            <div className="flex justify-between items-center text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-medium">{label}</span>
                </div>
                <span className={`font-mono font-bold ${value > 80 ? 'text-emerald-400' : value < 20 ? 'text-red-400' : 'text-white'}`}>
                    {value}/100
                </span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${value > 80 ? 'bg-emerald-500' : value < 20 ? 'bg-red-500' : 'bg-cyan-500'}`}
                />
            </div>
        </div>
    )
}
