import { useState, useEffect, useRef } from "react";
import { Home } from "./screens/Home";
import { ThemeSelection } from "./screens/ThemeSelection";
import { GoalSelection } from "./screens/GoalSelection";
import { LengthSelection } from "./screens/LengthSelection";
import { GameLoop } from "./screens/GameLoop";
import { Report } from "./screens/Report";
import { CharacterCreation } from "./screens/CharacterCreation";
import { PhotoUpload } from "./screens/PhotoUpload";
import { GameState, Goal, Theme, PlayerProfile, StoryLength } from "./types";
import {
  startSimulation,
  processDecision,
  generateFinalReport,
  generateImage,
} from "./services/gemini";
import { Volume2, VolumeX } from "lucide-react";

const INITIAL_STATS = {
  dinheiro: 50,
  conhecimento: 50,
  relacionamentos: 50,
  energia: 50,
  saude: 50,
  fama: 50,
  sanidade: 50,
};

const LENGTH_TURNS: Record<StoryLength, number> = {
  "Curta": 5,
  "Média": 10,
  "Longa": 20,
};

export default function App() {
  const [hasKey, setHasKey] = useState<boolean>(true);
  const [checkingKey, setCheckingKey] = useState<boolean>(true);

  useEffect(() => {
    const checkKey = async () => {
      try {
        // @ts-ignore
        if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          // @ts-ignore
          const selected = await window.aistudio.hasSelectedApiKey();
          setHasKey(selected);
        }
      } catch (e) {
        console.error("Failed to check API key:", e);
      } finally {
        setCheckingKey(false);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      if (window.aistudio && window.aistudio.openSelectKey) {
        // @ts-ignore
        await window.aistudio.openSelectKey();
        setHasKey(true); // Assume success to avoid race condition
      }
    } catch (e) {
      console.error("Failed to open key selection:", e);
    }
  };

  const [gameState, setGameState] = useState<GameState>({
    screen: "home",
    playerProfile: null,
    playerPhoto: null,
    theme: null,
    storyLength: "Média",
    goal: null,
    stats: INITIAL_STATS,
    turn: 1,
    maxTurns: 10,
    history: [],
    currentScenario: "",
    currentOptions: [],
    currentImage: "",
    lastConsequence: null,
    loading: false,
    imageLoading: false,
    error: null,
  });

  const [finalReport, setFinalReport] = useState<{
    perfil: string;
    resumo: string;
    analise: string;
    conclusao_objetivo: string;
    resultado_vida: string;
  } | null>(null);

  const [nextTurnData, setNextTurnData] = useState<{
    scenario: string;
    options: string[];
    image_prompt: string;
  } | null>(null);

  // Audio State
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    const audio = new Audio("https://actions.google.com/sounds/v1/ambiences/coffee_shop.ogg");
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (audioEnabled) {
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [audioEnabled]);

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };

  const handleStart = () => {
    setGameState((prev) => ({ ...prev, screen: "character" }));
  };

  const handleCharacterComplete = (profile: PlayerProfile) => {
    setGameState((prev) => ({ ...prev, playerProfile: profile, screen: "photo" }));
  };

  const handlePhotoComplete = (photoBase64: string | null) => {
    setGameState((prev) => ({ ...prev, playerPhoto: photoBase64, screen: "length" }));
  };

  const handleLengthSelect = (length: StoryLength) => {
    setGameState((prev) => ({ 
      ...prev, 
      storyLength: length, 
      maxTurns: LENGTH_TURNS[length],
      screen: "theme" 
    }));
  };

  const handleThemeSelect = (theme: Theme) => {
    setGameState((prev) => ({ ...prev, theme, screen: "goal" }));
  };

  const handleGoalSelect = async (goal: Goal) => {
    if (!gameState.theme || !gameState.playerProfile) return;
    setGameState((prev) => ({ ...prev, loading: true, goal }));
    try {
      const { scenario, options, image_prompt } = await startSimulation(
        goal, 
        gameState.theme, 
        gameState.playerProfile,
        gameState.maxTurns
      );
      
      // Start image generation in background
      setGameState((prev) => ({
        ...prev,
        screen: "game",
        loading: false,
        imageLoading: true,
        currentScenario: scenario,
        currentOptions: options,
      }));

      generateImage(image_prompt, gameState.playerPhoto).then((imageUrl) => {
        setGameState((prev) => ({ ...prev, currentImage: imageUrl, imageLoading: false }));
      });

    } catch (error) {
      console.error(error);
      setGameState((prev) => ({
        ...prev,
        loading: false,
        error: "Erro ao iniciar simulação. Tente novamente.",
      }));
    }
  };

  const handleDecision = async (decision: string) => {
    if (!gameState.goal || !gameState.theme || !gameState.playerProfile) return;

    setGameState((prev) => ({ ...prev, loading: true }));

    try {
      const response = await processDecision(
        gameState.goal,
        gameState.theme,
        gameState.playerProfile,
        gameState.currentScenario,
        decision,
        gameState.turn,
        gameState.maxTurns
      );

      // Update stats with clamping
      const clamp = (val: number) => Math.min(100, Math.max(0, val));
      
      const newStats = {
        dinheiro: clamp(gameState.stats.dinheiro + (response.stats_change.dinheiro || 0)),
        conhecimento: clamp(gameState.stats.conhecimento + (response.stats_change.conhecimento || 0)),
        relacionamentos: clamp(gameState.stats.relacionamentos + (response.stats_change.relacionamentos || 0)),
        energia: clamp(gameState.stats.energia + (response.stats_change.energia || 0)),
        saude: clamp(gameState.stats.saude + (response.stats_change.saude || 0)),
        fama: clamp(gameState.stats.fama + (response.stats_change.fama || 0)),
        sanidade: clamp(gameState.stats.sanidade + (response.stats_change.sanidade || 0)),
      };

      const isDead = newStats.saude <= 0 || newStats.sanidade <= 0;

      setGameState((prev) => ({
        ...prev,
        loading: false,
        stats: newStats,
        lastConsequence: {
          immediate: response.consequencia_imediata,
          future: isDead ? "Sua jornada chegou a um fim trágico prematuramente." : response.consequencia_futura,
        },
        history: [
          ...prev.history,
          `Turno ${prev.turn}: ${decision} -> ${response.consequencia_imediata}`,
        ],
      }));

      setNextTurnData({
        scenario: response.nova_situacao,
        options: response.opcoes,
        image_prompt: response.image_prompt,
      });
    } catch (error) {
      console.error(error);
      setGameState((prev) => ({
        ...prev,
        loading: false,
        error: "Erro ao processar decisão. Tente novamente.",
      }));
    }
  };

  const handleContinue = async () => {
    const isDead = gameState.stats.saude <= 0 || gameState.stats.sanidade <= 0;
    if (gameState.turn >= gameState.maxTurns || isDead) {
      // End game
      setGameState((prev) => ({ ...prev, loading: true, lastConsequence: null }));
      try {
        if (!gameState.goal || !gameState.theme || !gameState.playerProfile) throw new Error("No goal/theme/profile");
        const report = await generateFinalReport(
          gameState.goal,
          gameState.theme,
          gameState.playerProfile,
          gameState.history,
          gameState.stats
        );
        setFinalReport(report);
        setGameState((prev) => ({ ...prev, screen: "end", loading: false }));
      } catch (error) {
        console.error(error);
        setGameState((prev) => ({
          ...prev,
          loading: false,
          error: "Erro ao gerar relatório final.",
        }));
      }
    } else {
      // Next turn
      if (nextTurnData) {
        setGameState((prev) => ({
          ...prev,
          turn: prev.turn + 1,
          currentScenario: nextTurnData.scenario,
          currentOptions: nextTurnData.options,
          lastConsequence: null,
          imageLoading: true,
        }));
        
        // Generate image for next turn
        generateImage(nextTurnData.image_prompt, gameState.playerPhoto).then((imageUrl) => {
            setGameState((prev) => ({ ...prev, currentImage: imageUrl, imageLoading: false }));
        });

        setNextTurnData(null);
      }
    }
  };

  const handleRestart = () => {
    setGameState({
      screen: "home",
      playerProfile: null,
      playerPhoto: null,
      theme: null,
      storyLength: "Média",
      goal: null,
      stats: INITIAL_STATS,
      turn: 1,
      maxTurns: 10,
      history: [],
      currentScenario: "",
      currentOptions: [],
      currentImage: "",
      lastConsequence: null,
      loading: false,
      imageLoading: false,
      error: null,
    });
    setFinalReport(null);
    setNextTurnData(null);
  };

  if (checkingKey) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-100">
        <div className="animate-pulse">Verificando acesso...</div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 p-4">
        <h1 className="text-3xl font-bold mb-4 text-center">Acesso Ilimitado</h1>
        <p className="text-zinc-400 mb-8 max-w-md text-center">
          Para evitar limites de geração de imagens e texto, por favor conecte sua chave de API do Google Cloud.
        </p>
        <button
          onClick={handleSelectKey}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Conectar Chave de API
        </button>
        <p className="mt-4 text-sm text-zinc-500 text-center">
          Você precisa de uma chave de um projeto com faturamento ativado.<br/>
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-cyan-500 hover:underline">
            Saiba mais sobre faturamento
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-cyan-500/30 relative">
      {/* Audio Toggle */}
      <button
        onClick={toggleAudio}
        className="fixed top-4 left-4 z-50 p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white"
        title={audioEnabled ? "Mute Music" : "Play Music"}
      >
        {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {gameState.error && (
        <div className="fixed top-4 right-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg z-50 backdrop-blur-md">
          {gameState.error}
          <button
            onClick={() => setGameState((prev) => ({ ...prev, error: null }))}
            className="ml-4 font-bold hover:text-red-400"
          >
            X
          </button>
        </div>
      )}

      {gameState.screen === "home" && <Home onStart={handleStart} />}

      {gameState.screen === "character" && (
        <CharacterCreation 
          onComplete={handleCharacterComplete} 
          onBack={() => setGameState(prev => ({ ...prev, screen: "home" }))}
        />
      )}

      {gameState.screen === "photo" && (
        <PhotoUpload 
          onComplete={handlePhotoComplete} 
          onBack={() => setGameState(prev => ({ ...prev, screen: "character" }))} 
        />
      )}

      {gameState.screen === "length" && (
        <LengthSelection 
          onSelect={handleLengthSelect} 
          onBack={() => setGameState(prev => ({ ...prev, screen: "photo" }))}
        />
      )}

      {gameState.screen === "theme" && (
        <ThemeSelection 
          onSelect={handleThemeSelect} 
          onBack={() => setGameState(prev => ({ ...prev, screen: "length" }))}
        />
      )}
      
      {gameState.screen === "goal" && (
        <GoalSelection 
          onSelect={handleGoalSelect} 
          onBack={() => setGameState(prev => ({ ...prev, screen: "theme" }))}
        />
      )}

      {gameState.screen === "game" && (
        <GameLoop
          stats={gameState.stats}
          scenario={gameState.currentScenario}
          options={gameState.currentOptions}
          turn={gameState.turn}
          maxTurns={gameState.maxTurns}
          onDecision={handleDecision}
          lastConsequence={
            gameState.lastConsequence
              ? {
                  consequencia_imediata: gameState.lastConsequence.immediate,
                  consequencia_futura: gameState.lastConsequence.future,
                  stats_change: {},
                  nova_situacao: "",
                  opcoes: [],
                  image_prompt: "",
                }
              : null
          }
          onContinue={handleContinue}
          loading={gameState.loading}
          imageLoading={gameState.imageLoading}
          imageUrl={gameState.currentImage}
        />
      )}

      {gameState.screen === "end" && finalReport && (
        <Report
          stats={gameState.stats}
          profile={finalReport.perfil}
          estiloJogo={finalReport.estilo_jogo}
          summary={finalReport.resumo}
          analysis={finalReport.analise}
          conclusaoObjetivo={finalReport.conclusao_objetivo}
          lifeOutcome={finalReport.resultado_vida}
          playerProfile={gameState.playerProfile}
          history={gameState.history}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
